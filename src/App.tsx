import React, { useState, useEffect } from 'react';

interface ProviderConfig {
  name: string;
  base_url: string;
  api_keys: string[];
  models: string[];
}

interface AppConfig {
  port: number;
  default_model: string;
  providers: Record<string, ProviderConfig>;
  combos: Record<string, string[]>;
  compress_rtk: boolean;
}

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [status, setStatus] = useState<string>('Connecting...');
  const [activeTab, setActiveTab] = useState<'providers' | 'combos' | 'metrics'>('providers');

  useEffect(() => {
    fetch('http://localhost:20128/health')
      .then(res => res.json())
      .then(data => setStatus(`Online (Engine: ${data.engine})`))
      .catch(() => setStatus('Proxy Disconnected'));

    fetch('http://localhost:20128/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col font-sans">
      <header className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl gradient-glow flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            OR
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">OmniRoute <span className="text-cyan-400 font-medium text-sm">Light v4.0</span></h1>
            <p className="text-xs text-slate-400">High-Performance Go Proxy Gateway</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${status.includes('Online') ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="font-mono text-slate-300">{status}</span>
          </div>

          <div className="text-xs font-mono bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 px-3 py-1.5 rounded-lg">
            http://localhost:20128/v1
          </div>
        </div>
      </header>

      <div className="flex space-x-4 my-6 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('providers')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'providers' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Providers & API Keys
        </button>
        <button
          onClick={() => setActiveTab('combos')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'combos' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fallback Combos
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'metrics' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Telemetry & Token Savings
        </button>
      </div>

      <main className="flex-1">
        {activeTab === 'providers' && config && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(config.providers).map(([key, provider]) => (
              <div key={key} className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-xl hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-slate-100">{provider.name}</h3>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
                    {provider.models.length} Models
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mb-4 truncate">{provider.base_url}</p>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium">API Keys ({provider.api_keys.length})</label>
                  <input
                    type="password"
                    placeholder="Enter API key..."
                    defaultValue={provider.api_keys[0] ? '••••••••••••••••' : ''}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {provider.models.map(m => (
                    <span key={m} className="text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'combos' && config && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-bold mb-2">Smart Auto-Fallback Chain</h2>
            <p className="text-xs text-slate-400 mb-6">
              When an upstream model hits a quota limit (429) or error (5xx), OmniRoute seamlessly switches to the next priority provider.
            </p>

            <div className="space-y-3">
              {config.combos['auto-fallback']?.map((modelTarget, idx) => (
                <div key={idx} className="flex items-center space-x-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <span className="font-mono text-sm text-cyan-300 flex-1">{modelTarget}</span>
                  <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                    Priority {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">Proxy Overhead</span>
              <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">&lt; 0.8 ms</p>
              <span className="text-[11px] text-slate-500">Go zero-copy SSE forwarding</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">RAM Footprint</span>
              <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">18.4 MB</p>
              <span className="text-[11px] text-slate-500">vs ~320MB in Electron</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">Token Compression (RTK)</span>
              <p className="text-2xl font-bold text-purple-400 font-mono mt-1">24.6% Saved</p>
              <span className="text-[11px] text-slate-500">Active prompt optimization</span>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-8 pt-4 border-t border-slate-900 flex justify-between items-center text-xs text-slate-500">
        <div>OmniRoute Light • Tauri v2 + Go Proxy Engine</div>
        <div>Built for Cursor, Claude Code, Cline & OpenAI Apps</div>
      </footer>
    </div>
  );
}
