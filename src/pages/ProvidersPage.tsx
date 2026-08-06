import React, { useState, useEffect } from 'react';

const oauthProvidersList = [
  { id: 'claude', name: 'Claude Code', status: 'No connections', icon: '☀️' },
  { id: 'antigravity', name: 'Antigravity', status: 'No connections', icon: '◬' },
  { id: 'openai', name: 'OpenAI Codex', status: 'No connections', icon: '🧠' },
  { id: 'qoder', name: 'Qoder', status: 'No connections', icon: '◓' },
  { id: 'github-copilot', name: 'GitHub Copilot', status: 'No connections', icon: '🤖' },
  { id: 'cursor-ide', name: 'Cursor IDE', status: 'No connections', icon: '⬛' },
  { id: 'kilo-code', name: 'Kilo Code', status: 'No connections', icon: '📟' },
  { id: 'cline', name: 'Cline', status: 'No connections', icon: '👾' },
  { id: 'clinepass', name: 'ClinePass', status: 'No connections', icon: '👾' },
  { id: 'codebuddy', name: 'CodeBuddy', status: 'No connections', icon: '🟦' },
  { id: 'codebuddy-cn', name: 'CodeBuddy CN', status: 'No connections', icon: '🟦' },
  { id: 'kimi', name: 'Kimi', status: 'No connections', icon: 'K' },
  { id: 'grok-cli', name: 'Grok CLI (Grok Bu...', status: 'No connections', icon: '∅' },
  { id: 'xai-grok', name: 'xAI (Grok)', status: 'No connections', icon: '∅' },
];

const freeProvidersList = [
  { id: 'opencode', name: 'OpenCode Free', status: 'Ready', icon: '⚡', type: 'no-auth' },
  { id: 'kiro', name: 'Kiro AI', status: 'No connections', icon: 'aws', type: 'oauth' }
];

export default function ProvidersPage() {
  const [oauthProviders, setOauthProviders] = useState(oauthProvidersList);
  const [freeProviders, setFreeProviders] = useState(freeProvidersList);
  const [standardProviders, setStandardProviders] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [authData, setAuthData] = useState<any>(null);
  const [pollingProvider, setPollingProvider] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:20128/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        
        // Map connected states based on API keys array length
        const updated = oauthProvidersList.map(provider => {
          const pConfig = data.providers[provider.id];
          if (pConfig && pConfig.api_keys && pConfig.api_keys.length > 0) {
            return {
              ...provider,
              status: `${pConfig.api_keys.length} Connected`,
              connected: true
            };
          }
          return provider;
        });
        setOauthProviders(updated);

        // Map free providers
        const updatedFree = freeProvidersList.map(provider => {
          const pConfig = data.providers[provider.id];
          if (provider.type === 'no-auth') {
            return { ...provider, status: 'Ready', connected: true };
          } else if (provider.type === 'oauth' && pConfig?.oauth?.access_token) {
            return { ...provider, status: '1 Connected', connected: true };
          }
          return provider;
        });
        setFreeProviders(updatedFree);

        // Map standard providers
        const std = Object.keys(data.providers || {})
          .filter(id => !oauthProvidersList.find(o => o.id === id) && !freeProvidersList.find(f => f.id === id))
          .map(id => {
            const p = data.providers[id];
            const hasKeys = p.api_keys && p.api_keys.length > 0 && p.api_keys[0] !== "";
            return {
              id,
              name: p.name || id,
              status: hasKeys ? `${p.api_keys.length} Connected` : 'No connections',
              connected: hasKeys,
              icon: id.includes('openai') ? '🧠' : id.includes('anthropic') ? '🤖' : id.includes('gemini') ? 'G' : id.includes('groq') ? '⚡' : id.includes('deepseek') ? '🐋' : '☁️'
            };
          });
        setStandardProviders(std);
      });
  }, []);

  useEffect(() => {
    let interval: any;
    if (showModal && authData && pollingProvider) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('http://localhost:20128/api/oauth/poll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: pollingProvider, device_code: authData.device_code })
          });
          const data = await res.json();
          if (data.ok) {
            clearInterval(interval);
            setShowModal(false);
            window.location.reload();
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [showModal, authData, pollingProvider]);

  const handleProviderClick = async (provider: any) => {
    if (provider.type === 'oauth' && !provider.connected) {
      setPollingProvider(provider.id);
      setAuthData(null);
      setShowModal(true);
      const res = await fetch('http://localhost:20128/api/oauth/device_code', { method: 'POST' });
      const data = await res.json();
      setAuthData(data);
    }
  };
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

      {/* Standard Providers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Standard Providers <span className="text-slate-400 font-normal text-lg">(Official API)</span></h2>
          <div className="flex items-center gap-3">
            <button onClick={() => alert("Add Anthropic configuration modal triggered!")} className="flex items-center gap-2 bg-[#F26535] hover:bg-[#e05625] text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add Anthropic Compatible
            </button>
            <button onClick={() => alert("Add OpenAI configuration modal triggered!")} className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold py-2 px-4 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add OpenAI Compatible
            </button>
          </div>
        </div>
        
        {standardProviders.length === 0 ? (
          <div className="border border-dashed border-slate-700/80 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 bg-slate-900/20">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>No custom providers — use buttons above to add OpenAI/Anthropic compatible endpoints</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {standardProviders.map((provider) => (
              <div 
                key={provider.id} 
                onClick={() => alert(`Configuring settings for ${provider.name}`)}
                className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e] border border-slate-800/80 p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors"
              >
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
        )}
      </div>

      {/* OAuth Providers */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">OAuth Providers</h2>
          <button onClick={() => alert("Testing all OAuth Providers...")} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm py-1.5 px-4 rounded-lg transition-colors">
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
          <button onClick={() => alert("Testing all Free Tier Providers...")} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm py-1.5 px-4 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Test All
          </button>
        </div>
        
        {/* Placeholder for Free Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {freeProviders.map((provider) => (
            <div 
              key={provider.id} 
              onClick={() => handleProviderClick(provider)}
              className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e] border border-slate-800/80 p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
                {provider.icon === 'aws' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M12 21.5c-5.25 0-9.5-4.25-9.5-9.5S6.75 2.5 12 2.5 21.5 6.75 21.5 12c0 3.94-2.4 7.33-5.83 8.76"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                ) : provider.icon}
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
      
      {/* Device Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Connect Device</h2>
            <p className="text-slate-400 text-sm mb-6">Complete the login in your browser to connect this provider to OmniRoute.</p>
            
            {authData ? (
              <div className="space-y-6">
                <div className="bg-black/50 p-6 rounded-xl text-center border border-slate-800">
                  <p className="text-slate-500 text-xs mb-2 font-bold uppercase tracking-wider">Your User Code</p>
                  <p className="text-4xl font-mono tracking-widest text-white">{authData.user_code}</p>
                </div>
                
                <a 
                  href={authData.verification_uri} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full bg-[#007acc] hover:bg-[#005c99] text-white font-bold py-3 px-4 rounded-xl text-center transition-colors shadow-lg shadow-blue-900/20"
                >
                  Complete Login &rarr;
                </a>
                
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Waiting for authorization...
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-[#007acc]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}