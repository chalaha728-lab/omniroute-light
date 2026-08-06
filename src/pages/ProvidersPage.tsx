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

export default function ProvidersPage() {
  const [catalog, setCatalog] = useState<ProviderCatalogItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('http://localhost:20128/api/providers/catalog')
      .then((res) => res.json())
      .then((data) => setCatalog(data))
      .catch((err) => console.error('Failed to load catalog:', err));
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
              {catalog.length} Providers Available
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
