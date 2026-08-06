import React, { useState, useEffect } from 'react';

export interface ProviderCatalogItem {
  id: string;
  alias: string;
  name: string;
  category: string;
  auth_type: string;
  base_url: string;
  doc_url: string;
  default_model: string;
  models: string[];
  supports_vision: boolean;
  supports_tools: boolean;
  supports_stream: boolean;
}

const COMPLETE_OMNIROUTE_CATALOG: ProviderCatalogItem[] = [
  {
    id: 'openai', alias: 'oa', name: 'OpenAI', category: 'Major AI Lab', auth_type: 'apikey',
    base_url: 'https://api.openai.com/v1', doc_url: 'https://platform.openai.com/docs', default_model: 'gpt-4o',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o1-preview', 'o1-mini', 'o3-mini'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'anthropic', alias: 'claude', name: 'Anthropic', category: 'Major AI Lab', auth_type: 'apikey',
    base_url: 'https://api.anthropic.com/v1', doc_url: 'https://docs.anthropic.com', default_model: 'claude-3-5-sonnet-latest',
    models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'gemini', alias: 'goog', name: 'Google Gemini', category: 'Major AI Lab', auth_type: 'apikey',
    base_url: 'https://generativelanguage.googleapis.com/v1beta', doc_url: 'https://ai.google.dev/docs', default_model: 'gemini-1.5-pro',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash-exp', 'gemini-2.0-flash-thinking-exp'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'deepseek', alias: 'ds', name: 'DeepSeek AI', category: 'Reasoning & Frontier', auth_type: 'apikey',
    base_url: 'https://api.deepseek.com/v1', doc_url: 'https://platform.deepseek.com', default_model: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
    supports_vision: false, supports_tools: true, supports_stream: true,
  },
  {
    id: 'groq', alias: 'groq', name: 'Groq LPU', category: 'Ultra-Fast Inference', auth_type: 'apikey',
    base_url: 'https://api.groq.com/openai/v1', doc_url: 'https://console.groq.com/docs', default_model: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it', 'deepseek-r1-distill-llama-70b'],
    supports_vision: false, supports_tools: true, supports_stream: true,
  },
  {
    id: 'mistral', alias: 'mis', name: 'Mistral AI', category: 'European AI Leader', auth_type: 'apikey',
    base_url: 'https://api.mistral.ai/v1', doc_url: 'https://docs.mistral.ai', default_model: 'mistral-large-latest',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest', 'codestral-latest', 'pixtral-12b-2409'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'together', alias: 'tog', name: 'Together AI', category: 'Open-Source Cloud', auth_type: 'apikey',
    base_url: 'https://api.together.xyz/v1', doc_url: 'https://docs.together.ai', default_model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'Qwen/Qwen2.5-Coder-32B-Instruct', 'deepseek-ai/DeepSeek-R1'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'fireworks', alias: 'fw', name: 'Fireworks AI', category: 'Fast Inference', auth_type: 'apikey',
    base_url: 'https://api.fireworks.ai/inference/v1', doc_url: 'https://docs.fireworks.ai', default_model: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
    models: ['accounts/fireworks/models/llama-v3p3-70b-instruct', 'accounts/fireworks/models/deepseek-r1'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'openrouter', alias: 'or', name: 'OpenRouter Aggregator', category: 'Unified Aggregator', auth_type: 'apikey',
    base_url: 'https://openrouter.ai/api/v1', doc_url: 'https://openrouter.ai/docs', default_model: 'anthropic/claude-3.5-sonnet',
    models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-2.0-flash-exp:free', 'deepseek/deepseek-r1'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'cohere', alias: 'coh', name: 'Cohere Enterprise', category: 'Enterprise & Search', auth_type: 'apikey',
    base_url: 'https://api.cohere.com/v1', doc_url: 'https://docs.cohere.com', default_model: 'command-r-plus',
    models: ['command-r-plus', 'command-r', 'command-light'],
    supports_vision: false, supports_tools: true, supports_stream: true,
  },
  {
    id: 'perplexity', alias: 'pplx', name: 'Perplexity Search AI', category: 'Search & Web RAG', auth_type: 'apikey',
    base_url: 'https://api.perplexity.ai', doc_url: 'https://docs.perplexity.ai', default_model: 'sonar-pro',
    models: ['sonar-pro', 'sonar', 'sonar-reasoning-pro'],
    supports_vision: false, supports_tools: false, supports_stream: true,
  },
  {
    id: 'cerebras', alias: 'cer', name: 'Cerebras Wafer-Scale', category: 'Ultra-Fast Hardware', auth_type: 'apikey',
    base_url: 'https://api.cerebras.ai/v1', doc_url: 'https://inference-docs.cerebras.ai', default_model: 'llama3.3-70b',
    models: ['llama3.3-70b', 'llama3.1-8b'],
    supports_vision: false, supports_tools: true, supports_stream: true,
  },
  {
    id: 'sambanova', alias: 'samba', name: 'SambaNova Systems', category: 'Ultra-Fast Hardware', auth_type: 'apikey',
    base_url: 'https://api.sambanova.ai/v1', doc_url: 'https://docs.sambanova.ai', default_model: 'Meta-Llama-3.3-70B-Instruct',
    models: ['Meta-Llama-3.3-70B-Instruct', 'DeepSeek-R1-Distill-Llama-70B'],
    supports_vision: false, supports_tools: true, supports_stream: true,
  },
  {
    id: 'novita', alias: 'nov', name: 'Novita AI', category: 'Cloud Inference', auth_type: 'apikey',
    base_url: 'https://api.novita.ai/v3/openai', doc_url: 'https://novita.ai/docs', default_model: 'meta-llama/llama-3.3-70b-instruct',
    models: ['meta-llama/llama-3.3-70b-instruct', 'deepseek/deepseek-r1'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'replicate', alias: 'rep', name: 'Replicate Cloud', category: 'Open-Source Host', auth_type: 'apikey',
    base_url: 'https://api.replicate.com/v1', doc_url: 'https://replicate.com/docs', default_model: 'meta/llama-2-70b-chat',
    models: ['meta/llama-2-70b-chat', 'mistralai/mixtral-8x7b-instruct-v0.1'],
    supports_vision: true, supports_tools: false, supports_stream: true,
  },
  {
    id: 'huggingface', alias: 'hf', name: 'Hugging Face Inference', category: 'Open-Source Community', auth_type: 'apikey',
    base_url: 'https://api-inference.huggingface.co/v1', doc_url: 'https://huggingface.co/docs/api-inference', default_model: 'meta-llama/Llama-3.3-70B-Instruct',
    models: ['meta-llama/Llama-3.3-70B-Instruct', 'Qwen/Qwen2.5-72B-Instruct'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'yi', alias: 'yi', name: 'Yi (01.AI)', category: 'Chinese AI Leader', auth_type: 'apikey',
    base_url: 'https://api.lingyiwanwu.com/v1', doc_url: 'https://01.ai', default_model: 'yi-lightning',
    models: ['yi-lightning', 'yi-large', 'yi-medium', 'yi-spark'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'zai', alias: 'zai', name: 'Z.AI (Zhipu)', category: 'Chinese AI Leader', auth_type: 'apikey',
    base_url: 'https://open.bigmodel.cn/api/paas/v4', doc_url: 'https://open.bigmodel.cn', default_model: 'glm-4-plus',
    models: ['glm-4-plus', 'glm-4-air', 'glm-4-flash', 'cogview-3-plus'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'zenmux', alias: 'zm', name: 'ZenMux Proxy', category: 'Unified Router', auth_type: 'apikey',
    base_url: 'https://zenmux.ai/api/v1', doc_url: 'https://zenmux.ai', default_model: 'auto',
    models: ['auto', 'zenmux-pro'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'ollama', alias: 'ollama', name: 'Ollama (Local)', category: 'Local Engine', auth_type: 'local',
    base_url: 'http://localhost:11434/v1', doc_url: 'https://ollama.com', default_model: 'llama3.2:latest',
    models: ['llama3.2:latest', 'qwen2.5-coder:latest', 'deepseek-r1:8b', 'mistral:latest', 'phi4:latest'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'lm-studio', alias: 'lmstudio', name: 'LM Studio', category: 'Local Engine', auth_type: 'local',
    base_url: 'http://localhost:1234/v1', doc_url: 'https://lmstudio.ai', default_model: 'local-model',
    models: ['local-model'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'llama-cpp', alias: 'llamacpp', name: 'llama.cpp', category: 'Local Engine', auth_type: 'local',
    base_url: 'http://127.0.0.1:8080/v1', doc_url: 'https://github.com/ggml-org/llama.cpp', default_model: 'default',
    models: ['default'],
    supports_vision: false, supports_tools: true, supports_stream: true,
  },
  {
    id: 'vllm', alias: 'vllm', name: 'vLLM High-Throughput', category: 'Local Engine', auth_type: 'local',
    base_url: 'http://localhost:8000/v1', doc_url: 'https://github.com/vllm-project/vllm', default_model: 'vllm-model',
    models: ['vllm-model'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'antigravity', alias: 'agy', name: 'Antigravity AI', category: 'OAuth & Enterprise', auth_type: 'oauth',
    base_url: 'https://api.antigravity.ai/v1', doc_url: 'https://antigravity.ai', default_model: 'agy-fast',
    models: ['agy-fast', 'agy-pro', 'agy-coder'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'github', alias: 'copilot', name: 'GitHub Copilot API', category: 'OAuth & Enterprise', auth_type: 'oauth',
    base_url: 'https://api.githubcopilot.com', doc_url: 'https://github.com/features/copilot', default_model: 'gpt-4o',
    models: ['gpt-4o', 'claude-3-5-sonnet', 'o1-preview'],
    supports_vision: true, supports_tools: true, supports_stream: true,
  },
  {
    id: 'brave-search', alias: 'brave', name: 'Brave Search API', category: 'Search & Web RAG', auth_type: 'search',
    base_url: 'https://api.search.brave.com/res/v1', doc_url: 'https://brave.com/search/api', default_model: 'web-search',
    models: ['web-search', 'news-search'],
    supports_vision: false, supports_tools: false, supports_stream: false,
  },
  {
    id: 'exa-search', alias: 'exa', name: 'Exa Neural Search', category: 'Search & Web RAG', auth_type: 'search',
    base_url: 'https://api.exa.ai', doc_url: 'https://exa.ai', default_model: 'neural-search',
    models: ['neural-search'],
    supports_vision: false, supports_tools: false, supports_stream: false,
  },
  {
    id: 'tavily-search', alias: 'tavily', name: 'Tavily RAG Search', category: 'Search & Web RAG', auth_type: 'search',
    base_url: 'https://api.tavily.com', doc_url: 'https://tavily.com', default_model: 'search',
    models: ['search'],
    supports_vision: false, supports_tools: false, supports_stream: false,
  },
  {
    id: 'elevenlabs', alias: 'el', name: 'ElevenLabs Voice API', category: 'Audio & Voice', auth_type: 'audio',
    base_url: 'https://api.elevenlabs.io/v1', doc_url: 'https://elevenlabs.io', default_model: 'eleven_multilingual_v2',
    models: ['eleven_multilingual_v2', 'eleven_turbo_v2_5'],
    supports_vision: false, supports_tools: false, supports_stream: true,
  },
  {
    id: 'deepgram', alias: 'dg', name: 'Deepgram Speech AI', category: 'Audio & Voice', auth_type: 'audio',
    base_url: 'https://api.deepgram.com/v1', doc_url: 'https://deepgram.com', default_model: 'nova-2',
    models: ['nova-2', 'whisper-cloud'],
    supports_vision: false, supports_tools: false, supports_stream: true,
  },
];

export default function ProvidersPage() {
  const [catalog, setCatalog] = useState<ProviderCatalogItem[]>(COMPLETE_OMNIROUTE_CATALOG);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('http://localhost:20128/api/providers/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCatalog(data);
        }
      })
      .catch(() => console.log('Using complete OmniRoute built-in catalog'));
  }, []);

  const categories = ['All', ...Array.from(new Set(catalog.map((item) => item.category)))];

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.alias.toLowerCase().includes(search.toLowerCase()) ||
      item.models.some((m) => m.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleKeyChange = (providerId: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [providerId]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            📡 Endpoints & Provider Hub
            <span className="text-xs bg-cyan-950 border border-cyan-800/60 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono">
              {filteredCatalog.length} / {catalog.length} Providers
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official OmniRoute v3.8.50 complete provider channel catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search provider, alias, or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 w-64"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCatalog.map((p) => {
          const hasKey = Boolean(apiKeys[p.id]);
          return (
            <div
              key={p.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                    {p.name}
                    {hasKey && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Key Configured" />
                    )}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/50">
                      alias: {p.alias}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                      {p.category}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-mono mb-4 truncate">{p.base_url}</p>

                <div className="space-y-1.5 mb-4">
                  <label className="text-[11px] text-slate-400 font-medium flex justify-between">
                    <span>{p.auth_type === 'oauth' ? 'OAuth Token' : p.auth_type === 'local' ? 'Base URL Override' : 'API Key / Token'}</span>
                    <a
                      href={p.doc_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline text-[10px]"
                    >
                      Documentation ↗
                    </a>
                  </label>
                  <input
                    type={p.auth_type === 'local' ? 'text' : 'password'}
                    placeholder={p.auth_type === 'local' ? p.base_url : `Enter ${p.name} ${p.auth_type === 'oauth' ? 'Token' : 'Key'}...`}
                    value={apiKeys[p.id] || ''}
                    onChange={(e) => handleKeyChange(p.id, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 mb-4">
                  {p.supports_vision && (
                    <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 px-2 py-0.5 rounded-md font-mono">
                      👁️ Vision
                    </span>
                  )}
                  {p.supports_tools && (
                    <span className="text-[10px] bg-purple-950/80 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded-md font-mono">
                      🛠️ Tools
                    </span>
                  )}
                  {p.supports_stream && (
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded-md font-mono">
                      ⚡ Stream
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-medium block mb-1.5">
                  Models Catalog ({p.models.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {p.models.slice(0, 4).map((m) => (
                    <span
                      key={m}
                      className="text-[10px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono"
                    >
                      {m}
                    </span>
                  ))}
                  {p.models.length > 4 && (
                    <span className="text-[10px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                      +{p.models.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
