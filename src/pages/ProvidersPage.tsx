import React, { useState, useEffect } from 'react';

export interface ProviderCatalogItem {
  id: string;
  name: string;
  category: string;
  base_url: string;
  doc_url: string;
  default_model: string;
  models: string[];
  supports_vision: boolean;
  supports_tools: boolean;
  supports_stream: boolean;
}

const DEFAULT_CATALOG: ProviderCatalogItem[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'Major AI Lab',
    base_url: 'https://api.openai.com/v1',
    doc_url: 'https://platform.openai.com/docs',
    default_model: 'gpt-4o',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o1-preview', 'o1-mini', 'o3-mini'],
    supports_vision: true,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    category: 'Major AI Lab',
    base_url: 'https://api.anthropic.com/v1',
    doc_url: 'https://docs.anthropic.com',
    default_model: 'claude-3-5-sonnet-latest',
    models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    supports_vision: true,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'Major AI Lab',
    base_url: 'https://generativelanguage.googleapis.com/v1beta',
    doc_url: 'https://ai.google.dev/docs',
    default_model: 'gemini-1.5-pro',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash-exp'],
    supports_vision: true,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    category: 'Reasoning & Frontier',
    base_url: 'https://api.deepseek.com/v1',
    doc_url: 'https://platform.deepseek.com',
    default_model: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
    supports_vision: false,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'groq',
    name: 'Groq LPU',
    category: 'Ultra-Fast Inference',
    base_url: 'https://api.groq.com/openai/v1',
    doc_url: 'https://console.groq.com/docs',
    default_model: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    supports_vision: false,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    category: 'European AI Leader',
    base_url: 'https://api.mistral.ai/v1',
    doc_url: 'https://docs.mistral.ai',
    default_model: 'mistral-large-latest',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest', 'codestral-latest'],
    supports_vision: true,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'together',
    name: 'Together AI',
    category: 'Open-Source Cloud',
    base_url: 'https://api.together.xyz/v1',
    doc_url: 'https://docs.together.ai',
    default_model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'Qwen/Qwen2.5-Coder-32B-Instruct', 'deepseek-ai/DeepSeek-R1'],
    supports_vision: true,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    category: 'Fast Inference',
    base_url: 'https://api.fireworks.ai/inference/v1',
    doc_url: 'https://docs.fireworks.ai',
    default_model: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
    models: ['accounts/fireworks/models/llama-v3p3-70b-instruct', 'accounts/fireworks/models/deepseek-r1'],
    supports_vision: true,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter Aggregator',
    category: 'Unified Aggregator',
    base_url: 'https://openrouter.ai/api/v1',
    doc_url: 'https://openrouter.ai/docs',
    default_model: 'anthropic/claude-3.5-sonnet',
    models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-2.0-flash-exp:free', 'deepseek/deepseek-r1'],
    supports_vision: true,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'ollama',
    name: 'Ollama (Local LLM)',
    category: 'Local Engine',
    base_url: 'http://localhost:11434/v1',
    doc_url: 'https://ollama.com',
    default_model: 'llama3.2:latest',
    models: ['llama3.2:latest', 'qwen2.5-coder:latest', 'deepseek-r1:8b', 'mistral:latest'],
    supports_vision: true,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'bedrock',
    name: 'Amazon Bedrock',
    category: 'Cloud Enterprise',
    base_url: 'https://bedrock-runtime.us-east-1.amazonaws.com',
    doc_url: 'https://aws.amazon.com/bedrock',
    default_model: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    models: ['anthropic.claude-3-5-sonnet-20241022-v2:0', 'amazon.titan-text-express-v1'],
    supports_vision: true,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'cohere',
    name: 'Cohere Enterprise',
    category: 'Enterprise & Search',
    base_url: 'https://api.cohere.com/v1',
    doc_url: 'https://docs.cohere.com',
    default_model: 'command-r-plus',
    models: ['command-r-plus', 'command-r', 'command-light'],
    supports_vision: false,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'perplexity',
    name: 'Perplexity Search AI',
    category: 'Search & Web RAG',
    base_url: 'https://api.perplexity.ai',
    doc_url: 'https://docs.perplexity.ai',
    default_model: 'sonar-pro',
    models: ['sonar-pro', 'sonar', 'sonar-reasoning-pro'],
    supports_vision: false,
    supports_tools: false,
    supports_stream: true,
  },
  {
    id: 'cerebras',
    name: 'Cerebras Wafer-Scale',
    category: 'Ultra-Fast Hardware',
    base_url: 'https://api.cerebras.ai/v1',
    doc_url: 'https://inference-docs.cerebras.ai',
    default_model: 'llama3.3-70b',
    models: ['llama3.3-70b', 'llama3.1-8b'],
    supports_vision: false,
    supports_tools: true,
    supports_stream: true,
  },
  {
    id: 'sambanova',
    name: 'SambaNova Systems',
    category: 'Ultra-Fast Hardware',
    base_url: 'https://api.sambanova.ai/v1',
    doc_url: 'https://docs.sambanova.ai',
    default_model: 'Meta-Llama-3.3-70B-Instruct',
    models: ['Meta-Llama-3.3-70B-Instruct', 'DeepSeek-R1-Distill-Llama-70B'],
    supports_vision: false,
    supports_tools: true,
    supports_stream: true,
  },
];

export default function ProvidersPage() {
  const [catalog, setCatalog] = useState<ProviderCatalogItem[]>(DEFAULT_CATALOG);
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
      .catch((err) => console.error('Using default catalog:', err));
  }, []);

  const categories = ['All', ...Array.from(new Set(catalog.map((item) => item.category)))];

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
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
            📡 Provider & Endpoint Hub
            <span className="text-xs bg-cyan-950 border border-cyan-800/60 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono">
              {filteredCatalog.length} Providers Available
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure keys, endpoints, and model parameters across 290+ supported AI provider channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search providers or models..."
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
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                    {p.category}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-mono mb-4 truncate">{p.base_url}</p>

                <div className="space-y-1.5 mb-4">
                  <label className="text-[11px] text-slate-400 font-medium flex justify-between">
                    <span>API Key / Token</span>
                    <a
                      href={p.doc_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline text-[10px]"
                    >
                      Get Key ↗
                    </a>
                  </label>
                  <input
                    type="password"
                    placeholder={`Enter ${p.name} Key...`}
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
                      className="text-[10px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded"
                    >
                      {m}
                    </span>
                  ))}
                  {p.models.length > 4 && (
                    <span className="text-[10px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded">
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
