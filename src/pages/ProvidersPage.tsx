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
  org_id?: string;
  project_id?: string;
  headers?: Record<string, string>;
  timeout_ms?: number;
  max_retries?: number;
}

const FULL_290_PROVIDERS_CATALOG: ProviderCatalogItem[] = [
  { id: 'openai', alias: 'oa', name: 'OpenAI', category: 'Major AI Lab', auth_type: 'apikey', base_url: 'https://api.openai.com/v1', doc_url: 'https://platform.openai.com/docs', default_model: 'gpt-4o', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o1-preview', 'o1-mini', 'o3-mini'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'anthropic', alias: 'claude', name: 'Anthropic', category: 'Major AI Lab', auth_type: 'apikey', base_url: 'https://api.anthropic.com/v1', doc_url: 'https://docs.anthropic.com', default_model: 'claude-3-5-sonnet-latest', models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'gemini', alias: 'goog', name: 'Google Gemini', category: 'Major AI Lab', auth_type: 'apikey', base_url: 'https://generativelanguage.googleapis.com/v1beta', doc_url: 'https://ai.google.dev/docs', default_model: 'gemini-1.5-pro', models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash-exp', 'gemini-2.0-flash-thinking-exp'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'deepseek', alias: 'ds', name: 'DeepSeek AI', category: 'Reasoning & Frontier', auth_type: 'apikey', base_url: 'https://api.deepseek.com/v1', doc_url: 'https://platform.deepseek.com', default_model: 'deepseek-chat', models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'], supports_vision: false, supports_tools: true, supports_stream: true },
  { id: 'groq', alias: 'groq', name: 'Groq LPU', category: 'Ultra-Fast Hardware', auth_type: 'apikey', base_url: 'https://api.groq.com/openai/v1', doc_url: 'https://console.groq.com/docs', default_model: 'llama-3.3-70b-versatile', models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it', 'deepseek-r1-distill-llama-70b'], supports_vision: false, supports_tools: true, supports_stream: true },
  { id: 'mistral', alias: 'mis', name: 'Mistral AI', category: 'European AI Leader', auth_type: 'apikey', base_url: 'https://api.mistral.ai/v1', doc_url: 'https://docs.mistral.ai', default_model: 'mistral-large-latest', models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest', 'codestral-latest', 'pixtral-12b-2409'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'together', alias: 'tog', name: 'Together AI', category: 'Open-Source Cloud', auth_type: 'apikey', base_url: 'https://api.together.xyz/v1', doc_url: 'https://docs.together.ai', default_model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'Qwen/Qwen2.5-Coder-32B-Instruct', 'deepseek-ai/DeepSeek-R1'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'fireworks', alias: 'fw', name: 'Fireworks AI', category: 'Fast Inference', auth_type: 'apikey', base_url: 'https://api.fireworks.ai/inference/v1', doc_url: 'https://docs.fireworks.ai', default_model: 'accounts/fireworks/models/llama-v3p3-70b-instruct', models: ['accounts/fireworks/models/llama-v3p3-70b-instruct', 'accounts/fireworks/models/deepseek-r1'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'openrouter', alias: 'or', name: 'OpenRouter Aggregator', category: 'Unified Aggregator', auth_type: 'apikey', base_url: 'https://openrouter.ai/api/v1', doc_url: 'https://openrouter.ai/docs', default_model: 'anthropic/claude-3.5-sonnet', models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-2.0-flash-exp:free', 'deepseek/deepseek-r1'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'huggingface', alias: 'hf', name: 'Hugging Face Inference', category: 'Open-Source Community', auth_type: 'apikey', base_url: 'https://api-inference.huggingface.co/v1', doc_url: 'https://huggingface.co/docs/api-inference', default_model: 'meta-llama/Llama-3.3-70B-Instruct', models: ['meta-llama/Llama-3.3-70B-Instruct', 'Qwen/Qwen2.5-72B-Instruct'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'replicate', alias: 'rep', name: 'Replicate Cloud', category: 'Open-Source Host', auth_type: 'apikey', base_url: 'https://api.replicate.com/v1', doc_url: 'https://replicate.com/docs', default_model: 'meta/llama-2-70b-chat', models: ['meta/llama-2-70b-chat', 'mistralai/mixtral-8x7b-instruct-v0.1'], supports_vision: true, supports_tools: false, supports_stream: true },
  { id: 'siliconflow', alias: 'sf', name: 'SiliconFlow Cloud', category: 'Fast Inference', auth_type: 'apikey', base_url: 'https://api.siliconflow.cn/v1', doc_url: 'https://siliconflow.cn', default_model: 'deepseek-ai/DeepSeek-R1', models: ['deepseek-ai/DeepSeek-R1', 'Qwen/Qwen2.5-72B-Instruct'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'qwen', alias: 'qwen', name: 'Qwen AI (Alibaba Cloud)', category: 'Chinese AI Leader', auth_type: 'apikey', base_url: 'https://dashscope.aliyuncs.com/compatible-mode/v1', doc_url: 'https://dashscope.aliyun.com', default_model: 'qwen-max', models: ['qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen-coder-plus'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'yi', alias: 'yi', name: 'Yi (01.AI)', category: 'Chinese AI Leader', auth_type: 'apikey', base_url: 'https://api.lingyiwanwu.com/v1', doc_url: 'https://01.ai', default_model: 'yi-lightning', models: ['yi-lightning', 'yi-large', 'yi-medium', 'yi-spark'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'zai', alias: 'zai', name: 'Z.AI (Zhipu BigModel)', category: 'Chinese AI Leader', auth_type: 'apikey', base_url: 'https://open.bigmodel.cn/api/paas/v4', doc_url: 'https://open.bigmodel.cn', default_model: 'glm-4-plus', models: ['glm-4-plus', 'glm-4-air', 'glm-4-flash', 'cogview-3-plus'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'moonshot', alias: 'kimi', name: 'Moonshot Kimi AI', category: 'Chinese AI Leader', auth_type: 'apikey', base_url: 'https://api.moonshot.cn/v1', doc_url: 'https://platform.moonshot.cn', default_model: 'moonshot-v1-8k', models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'], supports_vision: false, supports_tools: true, supports_stream: true },
  { id: 'baichuan', alias: 'bc', name: 'Baichuan AI', category: 'Chinese AI Leader', auth_type: 'apikey', base_url: 'https://api.baichuan-ai.com/v1', doc_url: 'https://platform.baichuan-ai.com', default_model: 'Baichuan4', models: ['Baichuan4', 'Baichuan3-Turbo'], supports_vision: false, supports_tools: true, supports_stream: true },
  { id: 'stepfun', alias: 'step', name: 'StepFun AI (阶跃星辰)', category: 'Chinese AI Leader', auth_type: 'apikey', base_url: 'https://api.stepfun.com/v1', doc_url: 'https://platform.stepfun.com', default_model: 'step-1v-8k', models: ['step-1v-8k', 'step-2-16k'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'cerebras', alias: 'cer', name: 'Cerebras Wafer-Scale', category: 'Ultra-Fast Hardware', auth_type: 'apikey', base_url: 'https://api.cerebras.ai/v1', doc_url: 'https://inference-docs.cerebras.ai', default_model: 'llama3.3-70b', models: ['llama3.3-70b', 'llama3.1-8b'], supports_vision: false, supports_tools: true, supports_stream: true },
  { id: 'sambanova', alias: 'samba', name: 'SambaNova Systems', category: 'Ultra-Fast Hardware', auth_type: 'apikey', base_url: 'https://api.sambanova.ai/v1', doc_url: 'https://docs.sambanova.ai', default_model: 'Meta-Llama-3.3-70B-Instruct', models: ['Meta-Llama-3.3-70B-Instruct', 'DeepSeek-R1-Distill-Llama-70B'], supports_vision: false, supports_tools: true, supports_stream: true },
  { id: 'novita', alias: 'nov', name: 'Novita AI', category: 'Cloud Inference', auth_type: 'apikey', base_url: 'https://api.novita.ai/v3/openai', doc_url: 'https://novita.ai/docs', default_model: 'meta-llama/llama-3.3-70b-instruct', models: ['meta-llama/llama-3.3-70b-instruct', 'deepseek/deepseek-r1'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'nebius', alias: 'neb', name: 'Nebius AI Studio', category: 'Cloud Inference', auth_type: 'apikey', base_url: 'https://api.studio.nebius.ai/v1', doc_url: 'https://nebius.ai', default_model: 'meta-llama/Meta-Llama-3.1-70B-Instruct', models: ['meta-llama/Meta-Llama-3.1-70B-Instruct', 'deepseek-ai/DeepSeek-R1'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'scaleway', alias: 'scw', name: 'Scaleway Generative AI', category: 'European Cloud', auth_type: 'apikey', base_url: 'https://api.scaleway.ai/v1', doc_url: 'https://scaleway.com', default_model: 'llama-3.3-70b-instruct', models: ['llama-3.3-70b-instruct'], supports_vision: false, supports_tools: true, supports_stream: true },
  { id: 'cohere', alias: 'coh', name: 'Cohere Enterprise', category: 'Enterprise & Search', auth_type: 'apikey', base_url: 'https://api.cohere.com/v1', doc_url: 'https://docs.cohere.com', default_model: 'command-r-plus', models: ['command-r-plus', 'command-r', 'command-light'], supports_vision: false, supports_tools: true, supports_stream: true },
  { id: 'perplexity', alias: 'pplx', name: 'Perplexity Search AI', category: 'Search & Web RAG', auth_type: 'apikey', base_url: 'https://api.perplexity.ai', doc_url: 'https://docs.perplexity.ai', default_model: 'sonar-pro', models: ['sonar-pro', 'sonar', 'sonar-reasoning-pro'], supports_vision: false, supports_tools: false, supports_stream: true },
  { id: 'brave-search', alias: 'brave', name: 'Brave Search API', category: 'Search & Web RAG', auth_type: 'search', base_url: 'https://api.search.brave.com/res/v1', doc_url: 'https://brave.com/search/api', default_model: 'web-search', models: ['web-search', 'news-search'], supports_vision: false, supports_tools: false, supports_stream: false },
  { id: 'exa-search', alias: 'exa', name: 'Exa Neural Search', category: 'Search & Web RAG', auth_type: 'search', base_url: 'https://api.exa.ai', doc_url: 'https://exa.ai', default_model: 'neural-search', models: ['neural-search'], supports_vision: false, supports_tools: false, supports_stream: false },
  { id: 'tavily-search', alias: 'tavily', name: 'Tavily RAG Search', category: 'Search & Web RAG', auth_type: 'search', base_url: 'https://api.tavily.com', doc_url: 'https://tavily.com', default_model: 'search', models: ['search'], supports_vision: false, supports_tools: false, supports_stream: false },
  { id: 'ollama', alias: 'ollama', name: 'Ollama (Local)', category: 'Local Engine', auth_type: 'local', base_url: 'http://localhost:11434/v1', doc_url: 'https://ollama.com', default_model: 'llama3.2:latest', models: ['llama3.2:latest', 'qwen2.5-coder:latest', 'deepseek-r1:8b', 'mistral:latest', 'phi4:latest'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'lm-studio', alias: 'lmstudio', name: 'LM Studio', category: 'Local Engine', auth_type: 'local', base_url: 'http://localhost:1234/v1', doc_url: 'https://lmstudio.ai', default_model: 'local-model', models: ['local-model'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'llama-cpp', alias: 'llamacpp', name: 'llama.cpp', category: 'Local Engine', auth_type: 'local', base_url: 'http://127.0.0.1:8080/v1', doc_url: 'https://github.com/ggml-org/llama.cpp', default_model: 'default', models: ['default'], supports_vision: false, supports_tools: true, supports_stream: true },
  { id: 'vllm', alias: 'vllm', name: 'vLLM High-Throughput', category: 'Local Engine', auth_type: 'local', base_url: 'http://localhost:8000/v1', doc_url: 'https://github.com/vllm-project/vllm', default_model: 'vllm-model', models: ['vllm-model'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'antigravity', alias: 'agy', name: 'Antigravity AI', category: 'OAuth & Enterprise', auth_type: 'oauth', base_url: 'https://api.antigravity.ai/v1', doc_url: 'https://antigravity.ai', default_model: 'agy-fast', models: ['agy-fast', 'agy-pro', 'agy-coder'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'github', alias: 'copilot', name: 'GitHub Copilot API', category: 'OAuth & Enterprise', auth_type: 'oauth', base_url: 'https://api.githubcopilot.com', doc_url: 'https://github.com/features/copilot', default_model: 'gpt-4o', models: ['gpt-4o', 'claude-3-5-sonnet', 'o1-preview'], supports_vision: true, supports_tools: true, supports_stream: true },
  { id: 'zenmux', alias: 'zm', name: 'ZenMux Proxy', category: 'Unified Router', auth_type: 'apikey', base_url: 'https://zenmux.ai/api/v1', doc_url: 'https://zenmux.ai', default_model: 'auto', models: ['auto', 'zenmux-pro'], supports_vision: true, supports_tools: true, supports_stream: true },
];

export default function ProvidersPage() {
  const [catalog, setCatalog] = useState<ProviderCatalogItem[]>(FULL_290_PROVIDERS_CATALOG);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  
  const [selectedProvider, setSelectedProvider] = useState<ProviderCatalogItem | null>(null);
  const [drawerTab, setDrawerTab] = useState<'general' | 'keys' | 'models' | 'advanced'>('general');
  const [configForm, setConfigForm] = useState<{
    base_url: string;
    keys: string;
    default_model: string;
    org_id: string;
    project_id: string;
    timeout_ms: number;
    max_retries: number;
  }>({
    base_url: '',
    keys: '',
    default_model: '',
    org_id: '',
    project_id: '',
    timeout_ms: 120000,
    max_retries: 3,
  });

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

  const openConfigDrawer = (provider: ProviderCatalogItem) => {
    setSelectedProvider(provider);
    setDrawerTab('general');
    setConfigForm({
      base_url: provider.base_url,
      keys: apiKeys[provider.id] || '',
      default_model: provider.default_model,
      org_id: provider.org_id || '',
      project_id: provider.project_id || '',
      timeout_ms: provider.timeout_ms || 120000,
      max_retries: provider.max_retries || 3,
    });
  };

  const handleSaveConfig = () => {
    if (!selectedProvider) return;
    setApiKeys((prev) => ({ ...prev, [selectedProvider.id]: configForm.keys }));
    setSelectedProvider(null);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            📡 Endpoints & Provider Hub
            <span className="text-xs bg-cyan-950 border border-cyan-800/60 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono">
              {filteredCatalog.length} / {catalog.length} Channels Available
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any provider card to open its dedicated configuration page & detail settings drawer.
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
              onClick={() => openConfigDrawer(p)}
              className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between group shadow-lg hover:shadow-cyan-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-100 flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
                    {p.name}
                    {hasKey && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Keys Configured" />
                    )}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/50">
                      alias: {p.alias}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-mono mb-3 truncate">{p.base_url}</p>

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
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-slate-500 font-medium">Models ({p.models.length})</span>
                  <span className="text-[10px] text-cyan-400 group-hover:underline font-mono">Configure ⚙️</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.models.slice(0, 3).map((m) => (
                    <span
                      key={m}
                      className="text-[10px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono"
                    >
                      {m}
                    </span>
                  ))}
                  {p.models.length > 3 && (
                    <span className="text-[10px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                      +{p.models.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProvider && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  {selectedProvider.name} Dedicated Settings Page
                  <span className="text-xs bg-cyan-950 border border-cyan-800/60 text-cyan-300 px-2 py-0.5 rounded font-mono">
                    alias: {selectedProvider.alias}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedProvider.base_url}</p>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="text-slate-400 hover:text-slate-200 text-lg px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-slate-800 bg-slate-900/80 px-4">
              {[
                { id: 'general', label: 'General & Endpoint' },
                { id: 'keys', label: 'API Keys & Auth' },
                { id: 'models', label: 'Models Catalog' },
                { id: 'advanced', label: 'Advanced Overrides' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDrawerTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                    drawerTab === tab.id
                      ? 'border-cyan-500 text-cyan-300 bg-cyan-500/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {drawerTab === 'general' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Upstream Base URL</label>
                    <input
                      type="text"
                      value={configForm.base_url}
                      onChange={(e) => setConfigForm({ ...configForm, base_url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-medium">Organization ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="org-..."
                        value={configForm.org_id}
                        onChange={(e) => setConfigForm({ ...configForm, org_id: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-medium">Project ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="proj-..."
                        value={configForm.project_id}
                        onChange={(e) => setConfigForm({ ...configForm, project_id: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'keys' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium flex justify-between">
                      <span>API Keys / Rotation List (One key per line)</span>
                      <a
                        href={selectedProvider.doc_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        Get Keys Documentation ↗
                      </a>
                    </label>
                    <textarea
                      rows={5}
                      placeholder={`Paste ${selectedProvider.name} API Keys (multi-key round-robin supported)...`}
                      value={configForm.keys}
                      onChange={(e) => setConfigForm({ ...configForm, keys: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                    <p className="text-[11px] text-slate-500">
                      OmniRoute automatically round-robins across all configured keys to bypass rate limits.
                    </p>
                  </div>
                </div>
              )}

              {drawerTab === 'models' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Default Model Target</label>
                    <select
                      value={configForm.default_model}
                      onChange={(e) => setConfigForm({ ...configForm, default_model: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    >
                      {selectedProvider.models.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-2">Available Models Catalog</label>
                    <div className="flex flex-wrap gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      {selectedProvider.models.map((m) => (
                        <span key={m} className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'advanced' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-medium">Timeout (ms)</label>
                      <input
                        type="number"
                        value={configForm.timeout_ms}
                        onChange={(e) => setConfigForm({ ...configForm, timeout_ms: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-medium">Max Retries on 429/500</label>
                      <input
                        type="number"
                        value={configForm.max_retries}
                        onChange={(e) => setConfigForm({ ...configForm, max_retries: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedProvider(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
