package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"syscall"
	"time"

	"omniroute-core/compression"
	"omniroute-core/handoff"
	"omniroute-core/providers"
	"omniroute-core/resilience"
	"omniroute-core/routing"
)

// Global Configuration & State Management
type Config struct {
	Port         int                          `json:"port"`
	DefaultModel string                       `json:"default_model"`
	Providers    map[string]ProviderSettings `json:"providers"`
	Combos       map[string][]string          `json:"combos"`
	RoutingStrategy routing.Strategy          `json:"routing_strategy"`
	CompressRTK  bool                         `json:"compress_rtk"`
	CompressCaveman bool                      `json:"compress_caveman"`
	Guardrails   GuardrailsSettings           `json:"guardrails"`
}

type ProviderSettings struct {
	Name    string   `json:"name"`
	BaseURL string   `json:"base_url"`
	APIKeys []string `json:"api_keys"`
	Models  []string `json:"models"`
	Enabled bool     `json:"enabled"`
}

type GuardrailsSettings struct {
	RedactPII         bool    `json:"redact_pii"`
	BlockDangerous    bool    `json:"block_dangerous"`
	MaxTokensPerMonth int     `json:"max_tokens_per_month"`
	BudgetLimitUSD    float64 `json:"budget_limit_usd"`
}

var (
	config = Config{
		Port:         20128,
		DefaultModel: "gpt-4o",
		Providers:    make(map[string]ProviderSettings),
		Combos:       make(map[string][]string),
		RoutingStrategy: routing.StrategyAutoCombo,
		CompressRTK:  true,
		CompressCaveman: false,
		Guardrails: GuardrailsSettings{
			RedactPII:         true,
			BlockDangerous:    true,
			MaxTokensPerMonth: 10000000,
			BudgetLimitUSD:    50.0,
		},
	}
	configMutex sync.RWMutex
	keyIndex    = make(map[string]int)
	keyMutex    sync.Mutex
)

// OpenAI Chat Completion Data Models
type ChatMessage struct {
	Role    string      `json:"role"`
	Content interface{} `json:"content"`
}

type ChatRequest struct {
	Model       string        `json:"model"`
	Messages    []interface{} `json:"messages"` // Using interface to support objects (like handoff system messages)
	Temperature *float64      `json:"temperature,omitempty"`
	Stream      bool          `json:"stream,omitempty"`
	MaxTokens   *int          `json:"max_tokens,omitempty"`
}

func main() {
	loadInitialConfig()

	mux := http.NewServeMux()

	// CORS & System endpoints
	mux.HandleFunc("/health", handleHealth)
	mux.HandleFunc("/v1/models", handleModels)
	mux.HandleFunc("/v1/chat/completions", handleChatCompletions)
	mux.HandleFunc("/api/config", handleConfig)
	mux.HandleFunc("/api/providers/catalog", handleProvidersCatalog)

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", config.Port),
		Handler:      corsMiddleware(mux),
		ReadTimeout:  120 * time.Second,
		WriteTimeout: 120 * time.Second,
		IdleTimeout:  240 * time.Second,
	}

	go func() {
		log.Printf("[OmniRoute-Light] High-Performance Go Proxy listening on http://localhost:%d\n", config.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v\n", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	log.Println("[OmniRoute-Light] Shutting down proxy server gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	server.Shutdown(ctx)
}

func loadInitialConfig() {
	configMutex.Lock()
	defer configMutex.Unlock()

	allMeta := providers.GlobalRegistry.GetAll()
	for _, meta := range allMeta {
		config.Providers[meta.ID] = ProviderSettings{
			Name:    meta.Name,
			BaseURL: meta.BaseURL,
			APIKeys: []string{os.Getenv(strings.ToUpper(meta.ID) + "_API_KEY")},
			Models:  meta.Models,
			Enabled: true,
		}
	}

	config.Combos["auto-fallback"] = []string{
		"openai:gpt-4o",
		"anthropic:claude-3-5-sonnet-latest",
		"deepseek:deepseek-chat",
		"groq:llama-3.3-70b-versatile",
		"gemini:gemini-1.5-pro",
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":   "ok",
		"version":  "4.0.0-light-advanced",
		"engine":   "Go/FastProxy",
		"providers": len(config.Providers),
	})
}

func handleProvidersCatalog(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(providers.GlobalRegistry.GetAll())
}

func handleModels(w http.ResponseWriter, r *http.Request) {
	configMutex.RLock()
	defer configMutex.RUnlock()

	var modelsList []map[string]interface{}
	for providerName, provider := range config.Providers {
		for _, m := range provider.Models {
			modelsList = append(modelsList, map[string]interface{}{
				"id":       fmt.Sprintf("%s:%s", providerName, m),
				"object":   "model",
				"created":  time.Now().Unix(),
				"owned_by": providerName,
			})
			modelsList = append(modelsList, map[string]interface{}{
				"id":       m,
				"object":   "model",
				"created":  time.Now().Unix(),
				"owned_by": providerName,
			})
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"object": "list",
		"data":   modelsList,
	})
}

func handleChatCompletions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read body", http.StatusBadRequest)
		return
	}

	var req ChatRequest
	if err := json.Unmarshal(bodyBytes, &req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// 1. Prompt Compression Pipeline
	if config.CompressRTK || config.CompressCaveman {
		for i, msg := range req.Messages {
			if msgMap, ok := msg.(map[string]interface{}); ok {
				if content, ok := msgMap["content"].(string); ok {
					msgMap["content"] = compression.ProcessPipeline(content, config.CompressRTK, config.CompressCaveman)
					req.Messages[i] = msgMap
				}
			}
		}
	}

	// 2. Extract Session ID for Context Handoff
	sessionID := handoff.ExtractSessionID(r.Header, bodyBytes)
	
	providerName, modelName := parseModelTarget(req.Model)
	provider, exists := config.Providers[providerName]

	if !exists || len(provider.APIKeys) == 0 || provider.APIKeys[0] == "" || resilience.GlobalBreaker.GetState(providerName) == resilience.StateDead {
		// 3. Advanced Routing & Auto-Combo
		handleFallbackCombo(w, r, req, sessionID)
		return
	}

	// 4. Context Handoff Injection
	req.Messages = handoff.DetectAndInjectHandoff(sessionID, providerName+":"+modelName, req.Messages)
	handoff.RecordModelUsage(sessionID, providerName+":"+modelName)

	apiKey := getNextAPIKey(providerName, provider.APIKeys)
	req.Model = modelName

	proxyToUpstream(w, r, providerName, provider, apiKey, req)
}

func parseModelTarget(modelInput string) (string, string) {
	if strings.Contains(modelInput, ":") {
		parts := strings.SplitN(modelInput, ":", 2)
		return parts[0], parts[1]
	}

	configMutex.RLock()
	defer configMutex.RUnlock()
	for pName, p := range config.Providers {
		for _, m := range p.Models {
			if m == modelInput {
				return pName, m
			}
		}
	}

	return "openai", modelInput
}

func getNextAPIKey(providerName string, keys []string) string {
	if len(keys) == 0 {
		return ""
	}
	keyMutex.Lock()
	defer keyMutex.Unlock()

	idx := keyIndex[providerName]
	key := keys[idx%len(keys)]
	keyIndex[providerName] = (idx + 1) % len(keys)
	return key
}

func proxyToUpstream(w http.ResponseWriter, r *http.Request, providerName string, provider ProviderSettings, apiKey string, req ChatRequest) {
	targetURL := provider.BaseURL + "/chat/completions"

	updatedBody, _ := json.Marshal(req)
	outReq, err := http.NewRequestWithContext(r.Context(), http.MethodPost, targetURL, bytes.NewReader(updatedBody))
	if err != nil {
		http.Error(w, "Failed to create upstream request", http.StatusInternalServerError)
		return
	}

	outReq.Header.Set("Content-Type", "application/json")
	if apiKey != "" {
		outReq.Header.Set("Authorization", "Bearer "+apiKey)
	}

	// Track Active Connections for Least-Used routing
	routing.ActiveConnections[providerName]++
	defer func() {
		routing.ActiveConnections[providerName]--
	}()

	start := time.Now()
	client := &http.Client{Timeout: 120 * time.Second}
	resp, err := client.Do(outReq)
	latency := time.Since(start)

	if err != nil || resp.StatusCode >= 500 || resp.StatusCode == http.StatusTooManyRequests {
		// Record Failure in Circuit Breaker
		resilience.GlobalBreaker.RecordFailure(providerName)
		http.Error(w, fmt.Sprintf("Upstream error: %v", err), http.StatusBadGateway)
		return
	}
	
	// Record Success and Latency in Circuit Breaker
	resilience.GlobalBreaker.RecordSuccess(providerName, latency)
	
	defer resp.Body.Close()

	for k, vv := range resp.Header {
		for _, v := range vv {
			w.Header().Add(k, v)
		}
	}
	w.WriteHeader(resp.StatusCode)

	buf := make([]byte, 32*1024)
	io.CopyBuffer(w, resp.Body, buf)
}

func handleFallbackCombo(w http.ResponseWriter, r *http.Request, req ChatRequest, sessionID string) {
	configMutex.RLock()
	combos := config.Combos["auto-fallback"]
	strategy := config.RoutingStrategy
	configMutex.RUnlock()
	
	// Retry loop for fallbacks
	maxAttempts := len(combos)
	if maxAttempts > 5 {
		maxAttempts = 5
	}
	
	for attempt := 0; attempt < maxAttempts; attempt++ {
		target := routing.SelectNextTarget(combos, strategy, resilience.GlobalBreaker)
		if target == "" {
			break // No valid targets available
		}

		pName, mName := parseModelTarget(target)
		configMutex.RLock()
		provider, exists := config.Providers[pName]
		configMutex.RUnlock()

		if exists && len(provider.APIKeys) > 0 && resilience.GlobalBreaker.GetState(pName) != resilience.StateDead {
			apiKey := getNextAPIKey(pName, provider.APIKeys)
			req.Model = mName
			
			// Inject Handoff context
			req.Messages = handoff.DetectAndInjectHandoff(sessionID, pName+":"+mName, req.Messages)
			handoff.RecordModelUsage(sessionID, pName+":"+mName)
			
			// We cannot directly use proxyToUpstream here without handling the response ourselves,
			// but for simplicity in this proxy model, we will dispatch the request and if it fails,
			// the client receives a 502. Real OmniRoute reads the SSE stream and falls back dynamically.
			// Here we are executing a pre-flight circuit-breaker check and selecting the best node.
			
			proxyToUpstream(w, r, pName, provider, apiKey, req)
			return
		}
	}

	http.Error(w, "No active healthy API keys found for configured providers or fallback combos", http.StatusServiceUnavailable)
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	configMutex.RLock()
	defer configMutex.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}