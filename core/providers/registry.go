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
		Models: []string{"gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo", "o1-preview", "o1-mini", "o3-mini"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["anthropic"] = ProviderMetadata{
		ID: "anthropic", Alias: "claude", Name: "Anthropic", Category: "Major AI Lab", AuthType: "apikey",
		BaseURL: "https://api.anthropic.com/v1", DocURL: "https://docs.anthropic.com", DefaultModel: "claude-3-5-sonnet-latest",
		Models: []string{"claude-3-5-sonnet-latest", "claude-3-5-haiku-latest", "claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["gemini"] = ProviderMetadata{
		ID: "gemini", Alias: "goog", Name: "Google Gemini", Category: "Major AI Lab", AuthType: "apikey",
		BaseURL: "https://generativelanguage.googleapis.com/v1beta", DocURL: "https://ai.google.dev/docs", DefaultModel: "gemini-1.5-pro",
		Models: []string{"gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-2.0-flash-exp", "gemini-2.0-flash-thinking-exp"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["deepseek"] = ProviderMetadata{
		ID: "deepseek", Alias: "ds", Name: "DeepSeek AI", Category: "Reasoning & Frontier", AuthType: "apikey",
		BaseURL: "https://api.deepseek.com/v1", DocURL: "https://platform.deepseek.com", DefaultModel: "deepseek-chat",
		Models: []string{"deepseek-chat", "deepseek-reasoner", "deepseek-coder"},
		SupportsVision: false, SupportsTools: true, SupportsStream: true,
	}

	r.providers["groq"] = ProviderMetadata{
		ID: "groq", Alias: "groq", Name: "Groq LPU", Category: "Ultra-Fast Inference", AuthType: "apikey",
		BaseURL: "https://api.groq.com/openai/v1", DocURL: "https://console.groq.com/docs", DefaultModel: "llama-3.3-70b-versatile",
		Models: []string{"llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it", "deepseek-r1-distill-llama-70b"},
		SupportsVision: false, SupportsTools: true, SupportsStream: true,
	}

	r.providers["mistral"] = ProviderMetadata{
		ID: "mistral", Alias: "mis", Name: "Mistral AI", Category: "European AI Leader", AuthType: "apikey",
		BaseURL: "https://api.mistral.ai/v1", DocURL: "https://docs.mistral.ai", DefaultModel: "mistral-large-latest",
		Models: []string{"mistral-large-latest", "mistral-medium-latest", "mistral-small-latest", "codestral-latest", "pixtral-12b-2409"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["together"] = ProviderMetadata{
		ID: "together", Alias: "tog", Name: "Together AI", Category: "Open-Source Cloud", AuthType: "apikey",
		BaseURL: "https://api.together.xyz/v1", DocURL: "https://docs.together.ai", DefaultModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
		Models: []string{"meta-llama/Llama-3.3-70B-Instruct-Turbo", "Qwen/Qwen2.5-Coder-32B-Instruct", "deepseek-ai/DeepSeek-R1"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["fireworks"] = ProviderMetadata{
		ID: "fireworks", Alias: "fw", Name: "Fireworks AI", Category: "Fast Inference", AuthType: "apikey",
		BaseURL: "https://api.fireworks.ai/inference/v1", DocURL: "https://docs.fireworks.ai", DefaultModel: "accounts/fireworks/models/llama-v3p3-70b-instruct",
		Models: []string{"accounts/fireworks/models/llama-v3p3-70b-instruct", "accounts/fireworks/models/deepseek-r1"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["openrouter"] = ProviderMetadata{
		ID: "openrouter", Alias: "or", Name: "OpenRouter Aggregator", Category: "Unified Aggregator", AuthType: "apikey",
		BaseURL: "https://openrouter.ai/api/v1", DocURL: "https://openrouter.ai/docs", DefaultModel: "anthropic/claude-3.5-sonnet",
		Models: []string{"anthropic/claude-3.5-sonnet", "openai/gpt-4o", "google/gemini-2.0-flash-exp:free", "deepseek/deepseek-r1"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["cohere"] = ProviderMetadata{
		ID: "cohere", Alias: "coh", Name: "Cohere Enterprise", Category: "Enterprise & Search", AuthType: "apikey",
		BaseURL: "https://api.cohere.com/v1", DocURL: "https://docs.cohere.com", DefaultModel: "command-r-plus",
		Models: []string{"command-r-plus", "command-r", "command-light"},
		SupportsVision: false, SupportsTools: true, SupportsStream: true,
	}

	r.providers["perplexity"] = ProviderMetadata{
		ID: "perplexity", Alias: "pplx", Name: "Perplexity Search AI", Category: "Search & Web RAG", AuthType: "apikey",
		BaseURL: "https://api.perplexity.ai", DocURL: "https://docs.perplexity.ai", DefaultModel: "sonar-pro",
		Models: []string{"sonar-pro", "sonar", "sonar-reasoning-pro", "sonar-reasoning"},
		SupportsVision: false, SupportsTools: false, SupportsStream: true,
	}

	r.providers["cerebras"] = ProviderMetadata{
		ID: "cerebras", Alias: "cer", Name: "Cerebras Wafer-Scale", Category: "Ultra-Fast Hardware", AuthType: "apikey",
		BaseURL: "https://api.cerebras.ai/v1", DocURL: "https://inference-docs.cerebras.ai", DefaultModel: "llama3.3-70b",
		Models: []string{"llama3.3-70b", "llama3.1-8b"},
		SupportsVision: false, SupportsTools: true, SupportsStream: true,
	}

	r.providers["sambanova"] = ProviderMetadata{
		ID: "sambanova", Alias: "samba", Name: "SambaNova Systems", Category: "Ultra-Fast Hardware", AuthType: "apikey",
		BaseURL: "https://api.sambanova.ai/v1", DocURL: "https://docs.sambanova.ai", DefaultModel: "Meta-Llama-3.3-70B-Instruct",
		Models: []string{"Meta-Llama-3.3-70B-Instruct", "DeepSeek-R1-Distill-Llama-70B"},
		SupportsVision: false, SupportsTools: true, SupportsStream: true,
	}

	r.providers["novita"] = ProviderMetadata{
		ID: "novita", Alias: "nov", Name: "Novita AI", Category: "Cloud Inference", AuthType: "apikey",
		BaseURL: "https://api.novita.ai/v3/openai", DocURL: "https://novita.ai/docs", DefaultModel: "meta-llama/llama-3.3-70b-instruct",
		Models: []string{"meta-llama/llama-3.3-70b-instruct", "deepseek/deepseek-r1"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["replicate"] = ProviderMetadata{
		ID: "replicate", Alias: "rep", Name: "Replicate Cloud", Category: "Open-Source Host", AuthType: "apikey",
		BaseURL: "https://api.replicate.com/v1", DocURL: "https://replicate.com/docs", DefaultModel: "meta/llama-2-70b-chat",
		Models: []string{"meta/llama-2-70b-chat", "mistralai/mixtral-8x7b-instruct-v0.1"},
		SupportsVision: true, SupportsTools: false, SupportsStream: true,
	}

	r.providers["huggingface"] = ProviderMetadata{
		ID: "huggingface", Alias: "hf", Name: "Hugging Face Inference", Category: "Open-Source Community", AuthType: "apikey",
		BaseURL: "https://api-inference.huggingface.co/v1", DocURL: "https://huggingface.co/docs/api-inference", DefaultModel: "meta-llama/Llama-3.3-70B-Instruct",
		Models: []string{"meta-llama/Llama-3.3-70B-Instruct", "Qwen/Qwen2.5-72B-Instruct"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["yi"] = ProviderMetadata{
		ID: "yi", Alias: "yi", Name: "Yi (01.AI)", Category: "Chinese AI Leader", AuthType: "apikey",
		BaseURL: "https://api.lingyiwanwu.com/v1", DocURL: "https://01.ai", DefaultModel: "yi-lightning",
		Models: []string{"yi-lightning", "yi-large", "yi-medium", "yi-spark"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["zai"] = ProviderMetadata{
		ID: "zai", Alias: "zai", Name: "Z.AI (Zhipu)", Category: "Chinese AI Leader", AuthType: "apikey",
		BaseURL: "https://open.bigmodel.cn/api/paas/v4", DocURL: "https://open.bigmodel.cn", DefaultModel: "glm-4-plus",
		Models: []string{"glm-4-plus", "glm-4-air", "glm-4-flash", "cogview-3-plus"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["zenmux"] = ProviderMetadata{
		ID: "zenmux", Alias: "zm", Name: "ZenMux Proxy", Category: "Unified Router", AuthType: "apikey",
		BaseURL: "https://zenmux.ai/api/v1", DocURL: "https://zenmux.ai", DefaultModel: "auto",
		Models: []string{"auto", "zenmux-pro"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["ollama"] = ProviderMetadata{
		ID: "ollama", Alias: "ollama", Name: "Ollama (Local)", Category: "Local Engine", AuthType: "local",
		BaseURL: "http://localhost:11434/v1", DocURL: "https://ollama.com", DefaultModel: "llama3.2:latest",
		Models: []string{"llama3.2:latest", "qwen2.5-coder:latest", "deepseek-r1:8b", "mistral:latest", "phi4:latest"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["lm-studio"] = ProviderMetadata{
		ID: "lm-studio", Alias: "lmstudio", Name: "LM Studio", Category: "Local Engine", AuthType: "local",
		BaseURL: "http://localhost:1234/v1", DocURL: "https://lmstudio.ai", DefaultModel: "local-model",
		Models: []string{"local-model"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["llama-cpp"] = ProviderMetadata{
		ID: "llama-cpp", Alias: "llamacpp", Name: "llama.cpp", Category: "Local Engine", AuthType: "local",
		BaseURL: "http://127.0.0.1:8080/v1", DocURL: "https://github.com/ggml-org/llama.cpp", DefaultModel: "default",
		Models: []string{"default"},
		SupportsVision: false, SupportsTools: true, SupportsStream: true,
	}

	r.providers["vllm"] = ProviderMetadata{
		ID: "vllm", Alias: "vllm", Name: "vLLM High-Throughput", Category: "Local Engine", AuthType: "local",
		BaseURL: "http://localhost:8000/v1", DocURL: "https://github.com/vllm-project/vllm", DefaultModel: "vllm-model",
		Models: []string{"vllm-model"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["antigravity"] = ProviderMetadata{
		ID: "antigravity", Alias: "agy", Name: "Antigravity AI", Category: "OAuth & Enterprise", AuthType: "oauth",
		BaseURL: "https://api.antigravity.ai/v1", DocURL: "https://antigravity.ai", DefaultModel: "agy-fast",
		Models: []string{"agy-fast", "agy-pro", "agy-coder"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["github"] = ProviderMetadata{
		ID: "github", Alias: "copilot", Name: "GitHub Copilot API", Category: "OAuth & Enterprise", AuthType: "oauth",
		BaseURL: "https://api.githubcopilot.com", DocURL: "https://github.com/features/copilot", DefaultModel: "gpt-4o",
		Models: []string{"gpt-4o", "claude-3-5-sonnet", "o1-preview"},
		SupportsVision: true, SupportsTools: true, SupportsStream: true,
	}

	r.providers["brave-search"] = ProviderMetadata{
		ID: "brave-search", Alias: "brave", Name: "Brave Search API", Category: "Search & Web RAG", AuthType: "search",
		BaseURL: "https://api.search.brave.com/res/v1", DocURL: "https://brave.com/search/api", DefaultModel: "web-search",
		Models: []string{"web-search", "news-search"},
		SupportsVision: false, SupportsTools: false, SupportsStream: false,
	}

	r.providers["exa-search"] = ProviderMetadata{
		ID: "exa-search", Alias: "exa", Name: "Exa Neural Search", Category: "Search & Web RAG", AuthType: "search",
		BaseURL: "https://api.exa.ai", DocURL: "https://exa.ai", DefaultModel: "neural-search",
		Models: []string{"neural-search"},
		SupportsVision: false, SupportsTools: false, SupportsStream: false,
	}

	r.providers["tavily-search"] = ProviderMetadata{
		ID: "tavily-search", Alias: "tavily", Name: "Tavily RAG Search", Category: "Search & Web RAG", AuthType: "search",
		BaseURL: "https://api.tavily.com", DocURL: "https://tavily.com", DefaultModel: "search",
		Models: []string{"search"},
		SupportsVision: false, SupportsTools: false, SupportsStream: false,
	}

	r.providers["elevenlabs"] = ProviderMetadata{
		ID: "elevenlabs", Alias: "el", Name: "ElevenLabs Voice API", Category: "Audio & Voice", AuthType: "audio",
		BaseURL: "https://api.elevenlabs.io/v1", DocURL: "https://elevenlabs.io", DefaultModel: "eleven_multilingual_v2",
		Models: []string{"eleven_multilingual_v2", "eleven_turbo_v2_5"},
		SupportsVision: false, SupportsTools: false, SupportsStream: true,
	}

	r.providers["deepgram"] = ProviderMetadata{
		ID: "deepgram", Alias: "dg", Name: "Deepgram Speech AI", Category: "Audio & Voice", AuthType: "audio",
		BaseURL: "https://api.deepgram.com/v1", DocURL: "https://deepgram.com", DefaultModel: "nova-2",
		Models: []string{"nova-2", "whisper-cloud"},
		SupportsVision: false, SupportsTools: false, SupportsStream: true,
	}
}
