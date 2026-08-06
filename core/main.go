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

	"omniroute-core/providers"
)

type Config struct {
	Port         int                          `json:"port"`
	DefaultModel string                       `json:"default_model"`
	Providers    map[string]ProviderSettings `json:"providers"`
	Combos       map[string][]string          `json:"combos"`
	CompressRTK  bool                         `json:"compress_rtk"`
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
		CompressRTK:  true,
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

type ChatMessage struct {
	Role    string      `json:"role"`
	Content interface{} `json:"content"`
}

type ChatRequest struct {
	Model       string        `json:"model"`
	Messages    []ChatMessage `json:"messages"`
	Temperature *float64      `json:"temperature,omitempty"`
	Stream      bool          `json:"stream,omitempty"`
	MaxTokens   *int          `json:"max_tokens,omitempty"`
}

func main() {
	loadInitialConfig()

	mux := http.NewServeMux()
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
		"status":    "ok",
		"version":   "4.0.0-light",
		"engine":    "Go/FastProxy",
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

	if config.CompressRTK {
		req.Messages = compressPromptMessages(req.Messages)
	}

	providerName, modelName := parseModelTarget(req.Model)
	provider, exists := config.Providers[providerName]

	if !exists || len(provider.APIKeys) == 0 || provider.APIKeys[0] == "" {
		handleFallbackCombo(w, r, req, bodyBytes)
		return
	}

	apiKey := getNextAPIKey(providerName, provider.APIKeys)
	req.Model = modelName

	proxyToUpstream(w, r, provider, apiKey, req)
}

func compressPromptMessages(messages []ChatMessage) []ChatMessage {
	for i := range messages {
		if strContent, ok := messages[i].Content.(string); ok {
			lines := strings.Split(strContent, "\n")
			var cleaned []string
			for _, line := range lines {
				trimmed := strings.TrimSpace(line)
				if trimmed != "" && !strings.HasPrefix(trimmed, "// ") {
					cleaned = append(cleaned, trimmed)
				}
			}
			messages[i].Content = strings.Join(cleaned, "\n")
		}
	}
	return messages
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

func proxyToUpstream(w http.ResponseWriter, r *http.Request, provider ProviderSettings, apiKey string, req ChatRequest) {
	targetURL := provider.BaseURL + "/chat/completions"

	updatedBody, _ := json.Marshal(req)
	outReq, err := http.NewRequestWithContext(r.Context(), http.MethodPost, targetURL, bytes.NewReader(updatedBody))
	if err != nil {
		http.Error(w, "Failed to create upstream request", http.StatusInternalServerError)
		return
	}

	outReq.Header.Set("Content-Type", "application/json")
	outReq.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 120 * time.Second}
	resp, err := client.Do(outReq)
	if err != nil || resp.StatusCode >= 500 {
		http.Error(w, fmt.Sprintf("Upstream error: %v", err), http.StatusBadGateway)
		return
	}
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

func handleFallbackCombo(w http.ResponseWriter, r *http.Request, req ChatRequest, rawBody []byte) {
	configMutex.RLock()
	combos := config.Combos["auto-fallback"]
	configMutex.RUnlock()

	for _, target := range combos {
		pName, mName := parseModelTarget(target)
		configMutex.RLock()
		provider, exists := config.Providers[pName]
		configMutex.RUnlock()

		if exists && len(provider.APIKeys) > 0 && provider.APIKeys[0] != "" {
			apiKey := getNextAPIKey(pName, provider.APIKeys)
			req.Model = mName
			proxyToUpstream(w, r, provider, apiKey, req)
			return
		}
	}

	http.Error(w, "No active API keys found for configured providers or fallback combos", http.StatusUnauthorized)
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
