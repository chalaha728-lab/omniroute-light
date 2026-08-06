package providers

import (
	"strings"
	"sync"
)

type ProviderMetadata struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Category    string   `json:"category"`
	BaseURL     string   `json:"base_url"`
	DocURL      string   `json:"doc_url"`
	DefaultModel string  `json:"default_model"`
	Models      []string `json:"models"`
	SupportsVision bool  `json:"supports_vision"`
	SupportsTools  bool  `json:"supports_tools"`
	SupportsStream bool  `json:"supports_stream"`
}

type ProviderRegistry struct {
	mu        sync.RWMutex
	providers map[string]ProviderMetadata
}

var GlobalRegistry = NewRegistry()

func NewRegistry() *ProviderRegistry {
	r := &ProviderRegistry{
		providers: make(map[string]ProviderMetadata),
	}
	r.registerBuiltinProviders()
	return r
}

func (r *ProviderRegistry) GetAll() []ProviderMetadata {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]ProviderMetadata, 0, len(r.providers))
	for _, p := range r.providers {
		result = append(result, p)
	}
	return result
}

func (r *ProviderRegistry) Get(id string) (ProviderMetadata, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	p, exists := r.providers[strings.ToLower(id)]
	return p, exists
}

func (r *ProviderRegistry) registerBuiltinProviders() {
	r.providers["openai"] = ProviderMetadata{
		ID:           "openai",
		Name:         "OpenAI",
		Category:     "Major AI Lab",
		BaseURL:      "https://api.openai.com/v1",
		DocURL:       "https://platform.openai.com/docs",
		DefaultModel: "gpt-4o",
		Models: []string{
			"gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo",
			"o1-preview", "o1-mini", "o3-mini", "gpt-4o-realtime-preview",
		},
		SupportsVision: true,
		SupportsTools:  true,
		SupportsStream: true,
	}

	r.providers["anthropic"] = ProviderMetadata{
		ID:           "anthropic",
		Name:         "Anthropic",
		Category:     "Major AI Lab",
		BaseURL:      "https://api.anthropic.com/v1",
		DocURL:       "https://docs.anthropic.com",
		DefaultModel: "claude-3-5-sonnet-latest",
		Models: []string{
			"claude-3-5-sonnet-latest", "claude-3-5-haiku-latest",
			"claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307",
		},
		SupportsVision: true,
		SupportsTools:  true,
		SupportsStream: true,
	}

	r.providers["gemini"] = ProviderMetadata{
		ID:           "gemini",
		Name:         "Google Gemini",
		Category:     "Major AI Lab",
		BaseURL:      "https://generativelanguage.googleapis.com/v1beta",
		DocURL:       "https://ai.google.dev/docs",
		DefaultModel: "gemini-1.5-pro",
		Models: []string{
			"gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.5-flash-8b",
			"gemini-2.0-flash-exp", "gemini-2.0-flash-thinking-exp", "gemini-exp-1206",
		},
		SupportsVision: true,
		SupportsTools:  true,
		SupportsStream: true,
	}

	r.providers["deepseek"] = ProviderMetadata{
		ID:           "deepseek",
		Name:         "DeepSeek AI",
		Category:     "Reasoning & Frontier",
		BaseURL:      "https://api.deepseek.com/v1",
		DocURL:       "https://platform.deepseek.com",
		DefaultModel: "deepseek-chat",
		Models: []string{
			"deepseek-chat", "deepseek-reasoner", "deepseek-coder",
		},
		SupportsVision: false,
		SupportsTools:  true,
		SupportsStream: true,
	}

	r.providers["groq"] = ProviderMetadata{
		ID:           "groq",
		Name:         "Groq LPU",
		Category:     "Ultra-Fast Inference",
		BaseURL:      "https://api.groq.com/openai/v1",
		DocURL:       "https://console.groq.com/docs",
		DefaultModel: "llama-3.3-70b-versatile",
		Models: []string{
			"llama-3.3-70b-versatile", "llama-3.1-8b-instant",
			"mixtral-8x7b-32768", "gemma2-9b-it", "deepseek-r1-distill-llama-70b",
		},
		SupportsVision: false,
		SupportsTools:  true,
		SupportsStream: true,
	}

	r.providers["mistral"] = ProviderMetadata{
		ID:           "mistral",
		Name:         "Mistral AI",
		Category:     "European AI Leader",
		BaseURL:      "https://api.mistral.ai/v1",
		DocURL:       "https://docs.mistral.ai",
		DefaultModel: "mistral-large-latest",
		Models: []string{
			"mistral-large-latest", "mistral-medium-latest", "mistral-small-latest",
			"open-mixtral-8x22b", "codestral-latest", "pixtral-12b-2409",
		},
		SupportsVision: true,
		SupportsTools:  true,
		SupportsStream: true,
	}

	r.providers["together"] = ProviderMetadata{
		ID:           "together",
		Name:         "Together AI",
		Category:     "Open-Source Cloud",
		BaseURL:      "https://api.together.xyz/v1",
		DocURL:       "https://docs.together.ai",
		DefaultModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
		Models: []string{
			"meta-llama/Llama-3.3-70B-Instruct-Turbo",
			"Qwen/Qwen2.5-Coder-32B-Instruct",
			"deepseek-ai/DeepSeek-R1",
			"mistralai/Mixtral-8x22B-Instruct-v0.1",
		},
		SupportsVision: true,
		SupportsTools:  true,
		SupportsStream: true,
	}

	r.providers["fireworks"] = ProviderMetadata{
		ID:           "fireworks",
		Name:         "Fireworks AI",
		Category:     "Fast Inference",
		BaseURL:      "https://api.fireworks.ai/inference/v1",
		DocURL:       "https://docs.fireworks.ai",
		DefaultModel: "accounts/fireworks/models/llama-v3p3-70b-instruct",
		Models: []string{
			"accounts/fireworks/models/llama-v3p3-70b-instruct",
			"accounts/fireworks/models/deepseek-r1",
			"accounts/fireworks/models/qwen2p5-coder-32b-instruct",
		},
		SupportsVision: true,
		SupportsTools:  true,
		SupportsStream: true,
	}

	r.providers["openrouter"] = ProviderMetadata{
		ID:           "openrouter",
		Name:         "OpenRouter Aggregator",
		Category:     "Unified Aggregator",
		BaseURL:      "https://openrouter.ai/api/v1",
		DocURL:       "https://openrouter.ai/docs",
		DefaultModel: "anthropic/claude-3.5-sonnet",
		Models: []string{
			"anthropic/claude-3.5-sonnet", "openai/gpt-4o",
			"google/gemini-2.0-flash-exp:free", "deepseek/deepseek-r1",
			"meta-llama/llama-3.3-70b-instruct",
		},
		SupportsVision: true,
		SupportsTools:  true,
		SupportsStream: true,
	}

	r.providers["ollama"] = ProviderMetadata{
		ID:           "ollama",
		Name:         "Ollama (Local LLM)",
		Category:     "Local Engine",
		BaseURL:      "http://localhost:11434/v1",
		DocURL:       "https://ollama.com",
		DefaultModel: "llama3.2:latest",
		Models: []string{
			"llama3.2:latest", "qwen2.5-coder:latest",
			"deepseek-r1:8b", "mistral:latest", "phi4:latest",
		},
		SupportsVision: true,
		SupportsTools:  true,
		SupportsStream: true,
	}
}
