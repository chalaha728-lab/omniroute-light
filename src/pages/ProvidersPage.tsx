import React from 'react';

const oauthProviders = [
  { id: 'claude-code', name: 'Claude Code', status: 'No connections', icon: '☀️' },
  { id: 'antigravity', name: 'Antigravity', status: 'No connections', icon: '◬' },
  { id: 'openai-codex', name: 'OpenAI Codex', status: 'No connections', icon: '🧠' },
  { id: 'qoder', name: 'Qoder', status: 'No connections', icon: '◓' },
  { id: 'github-copilot', name: 'GitHub Copilot', status: 'No connections', icon: '🤖' },
  { id: 'cursor-ide', name: 'Cursor IDE', status: 'No connections', icon: '⬛' },
  { id: 'kilo-code', name: 'Kilo Code', status: 'No connections', icon: '📟' },
  { id: 'cline', name: 'Cline', status: '1 Connected', icon: '👾', connected: true },
  { id: 'clinepass', name: 'ClinePass', status: 'No connections', icon: '👾' },
  { id: 'codebuddy', name: 'CodeBuddy', status: 'No connections', icon: '🟦' },
  { id: 'codebuddy-cn', name: 'CodeBuddy CN', status: 'No connections', icon: '🟦' },
  { id: 'kimi', name: 'Kimi', status: '1 Connected', icon: 'K', connected: true },
  { id: 'grok-cli', name: 'Grok CLI (Grok Bu...', status: 'No connections', icon: '∅' },
  { id: 'xai-grok', name: 'xAI (Grok)', status: 'No connections', icon: '∅' },
];

export default function ProvidersPage() {
  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="text-rose-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Providers</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage your AI provider connections</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search providers..." 
              className="bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Custom Providers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Custom Providers <span className="text-slate-400 font-normal text-lg">(OpenAI/Anthropic Compatible)</span></h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#F26535] hover:bg-[#e05625] text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add Anthropic Compatible
            </button>
            <button className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold py-2 px-4 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add OpenAI Compatible
            </button>
          </div>
        </div>
        <div className="border border-dashed border-slate-700/80 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 bg-slate-900/20">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>No custom providers — use buttons above to add OpenAI/Anthropic compatible endpoints</span>
          </div>
        </div>
      </div>

      {/* OAuth Providers */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">OAuth Providers</h2>
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm py-1.5 px-4 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Test All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {oauthProviders.map((provider) => (
            <div key={provider.id} className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e] border border-slate-800/80 p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
                {provider.icon}
              </div>
              <div>
                <h3 className="text-slate-200 font-bold text-sm">{provider.name}</h3>
                {provider.connected ? (
                  <p className="text-emerald-500 text-xs mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {provider.status}
                  </p>
                ) : (
                  <p className="text-slate-500 text-xs mt-0.5">{provider.status}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free Tier Providers */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Free Tier Providers</h2>
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm py-1.5 px-4 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Test All
          </button>
        </div>
        
        {/* Placeholder for Free Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* Add dummy items to match visual */}
           {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e] border border-slate-800/80 p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors opacity-50">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                <div className="w-5 h-5 bg-slate-800 rounded-full"></div>
              </div>
              <div>
                <div className="h-4 w-24 bg-slate-800 rounded mb-2"></div>
                <div className="h-3 w-16 bg-slate-800/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
