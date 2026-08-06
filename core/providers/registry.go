package providers

import (
	"strings"
	"sync"
)

type ProviderMetadata struct {
	ID             string   `json:"id"`
	Alias          string   `json:"alias"`
	Name           string   `json:"name"`
	Category       string   `json:"category"`
	AuthType       string   `json:"auth_type"`
	BaseURL        string   `json:"base_url"`
	DocURL         string   `json:"doc_url"`
	DefaultModel   string   `json:"default_model"`
	Models         []string `json:"models"`
	SupportsVision bool     `json:"supports_vision"`
	SupportsTools  bool     `json:"supports_tools"`
	SupportsStream bool     `json:"supports_stream"`
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
		ID: "openai", Alias: "oa", Name: "OpenAI", Category: "Major AI Lab", AuthType: "apikey",
		BaseURL: "https://api.openai.com/v1", DocURL: "https://platform.openai.com/docs", DefaultModel: "gpt-4o",
		Models: []string{"gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "o1-preview", "o1-mini", "o3-mini"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["anthropic"] = ProviderMetadata{
		ID: "anthropic", Alias: "claude", Name: "Anthropic", Category: "Major AI Lab", AuthType: "apikey",
		BaseURL: "https://api.anthropic.com/v1", DocURL: "https://docs.anthropic.com", DefaultModel: "claude-3-5-sonnet-latest",
		Models: []string{"claude-3-5-sonnet-latest", "claude-3-5-haiku-latest", "claude-3-opus-20240229", "claude-3-haiku-20240307"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["gemini"] = ProviderMetadata{
		ID: "gemini", Alias: "goog", Name: "Google Gemini", Category: "Major AI Lab", AuthType: "apikey",
		BaseURL: "https://generativelanguage.googleapis.com/v1beta", DocURL: "https://ai.google.dev/docs", DefaultModel: "gemini-1.5-pro",
		Models: []string{"gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash-exp", "gemini-2.0-flash-thinking-exp"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["deepseek"] = ProviderMetadata{
		ID: "deepseek", Alias: "ds", Name: "DeepSeek AI", Category: "Reasoning & Frontier", AuthType: "apikey",
		BaseURL: "https://api.deepseek.com/v1", DocURL: "https://platform.deepseek.com", DefaultModel: "deepseek-chat",
		Models: []string{"deepseek-chat", "deepseek-reasoner", "deepseek-coder"},
		SupportsVision: false, SupportsTools: true, SupportsStream: true,
	}

	r.providers["groq"] = ProviderMetadata{
		ID: "groq", Alias: "groq", Name: "Groq LPU", Category: "Major AI Lab", AuthType: "apikey",
		BaseURL: "https://api.groq.com/openai/v1", DocURL: "https://console.groq.com/docs", DefaultModel: "llama-3.3-70b-versatile",
		Models: []string{"llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "deepseek-r1-distill-llama-70b"},
		SupportsVision: false, SupportsTools: true, SupportsStream: true,
	}

	r.providers["mistral"] = ProviderMetadata{
		ID: "mistral", Alias: "mis", Name: "Mistral AI", Category: "Major AI Lab", AuthType: "apikey",
		BaseURL: "https://api.mistral.ai/v1", DocURL: "https://docs.mistral.ai", DefaultModel: "mistral-large-latest",
		Models: []string{"mistral-large-latest", "mistral-medium-latest", "mistral-small-latest", "codestral-latest"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["qwen"] = ProviderMetadata{
		ID: "qwen", Alias: "qwen", Name: "Qwen AI (Alibaba Cloud)", Category: "Chinese AI Ecosystem", AuthType: "apikey",
		BaseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1", DocURL: "https://dashscope.aliyun.com", DefaultModel: "qwen-max",
		Models: []string{"qwen-max", "qwen-plus", "qwen-turbo", "qwen-coder-plus"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["ollama"] = ProviderMetadata{
		ID: "ollama", Alias: "olla", Name: "Ollama (Local)", Category: "Local & Self-Hosted", AuthType: "local",
		BaseURL: "http://localhost:11434/v1", DocURL: "https://ollama.com", DefaultModel: "llama3.2:latest",
		Models: []string{"llama3.2:latest", "qwen2.5-coder:latest", "deepseek-r1:8b", "mistral:latest"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}
}
