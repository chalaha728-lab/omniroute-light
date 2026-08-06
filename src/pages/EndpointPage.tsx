import React, { useState } from 'react';

export default function EndpointPage() {
  const [requireKey, setRequireKey] = useState(true);
  const [keyEnabled, setKeyEnabled] = useState(true);

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="text-rose-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 12l10 10 10-10L12 2zm0 14.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Endpoint</h1>
            <p className="text-sm text-slate-400 mt-0.5">API endpoint configuration</p>
          </div>
        </div>
      </div>

      {/* API Endpoint Card */}
      <div className="bg-[#1e1e1e]/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-6">
          <span className="text-rose-500 text-lg">❖</span> API Endpoint
        </h2>

        <div className="space-y-4">
          {/* Local */}
          <div className="flex items-center gap-4">
            <div className="w-24 bg-slate-800/50 text-slate-400 text-xs py-2 px-3 rounded-lg text-center font-medium border border-slate-800">
              Local
            </div>
            <div className="flex-1 flex items-center bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden">
              <div className="flex-1 px-4 py-2.5 text-sm font-mono text-slate-200">
                http://localhost:20128/v1
              </div>
              <button className="p-3 text-slate-400 hover:text-slate-200 transition-colors border-l border-slate-700/50 hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
          </div>

          {/* Tunnel */}
          <div className="flex items-center gap-4">
            <div className="w-24 bg-slate-800/50 text-slate-400 text-xs py-2 px-3 rounded-lg text-center font-medium border border-slate-800">
              Tunnel
            </div>
            <button className="flex items-center gap-2 bg-[#F26535] hover:bg-[#e05625] text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-[#F26535]/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
              Enable
            </button>
          </div>

          {/* Tailscale */}
          <div className="flex items-center gap-4">
            <div className="w-24 bg-slate-800/50 text-slate-400 text-xs py-2 px-3 rounded-lg text-center font-medium border border-slate-800">
              Tailscale
            </div>
            <button className="flex items-center gap-2 bg-[#8C52FF] hover:bg-[#7b46e3] text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-[#8C52FF]/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              Enable
            </button>
          </div>

          {/* Warning Alert */}
          <div className="mt-6 bg-[#2d2215] border border-[#523b20] rounded-lg p-4 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              </div>
              <span className="text-amber-500/90 text-sm">
                Change the default dashboard password before activating the tunnel.
              </span>
            </div>
            <button className="text-amber-500 text-sm font-bold hover:text-amber-400 hover:underline">
              Open settings
            </button>
          </div>
        </div>
      </div>

      {/* API Keys Card */}
      <div className="bg-[#1e1e1e]/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="text-rose-500 text-lg">🔑</span> API Keys
          </h2>
          <button className="flex items-center gap-2 bg-[#F26535] hover:bg-[#e05625] text-white text-sm font-bold py-2 px-5 rounded-xl transition-colors shadow-lg shadow-[#F26535]/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Create Key
          </button>
        </div>

        {/* Require API Key Setting */}
        <div className="flex items-center justify-between py-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-slate-200 font-bold text-sm">Require API key</h3>
            <p className="text-slate-400 text-xs mt-1">Requests without a valid key will be rejected</p>
          </div>
          <button 
            onClick={() => setRequireKey(!requireKey)}
            className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${requireKey ? 'bg-[#F26535]' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-transform ${requireKey ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Default Key */}
        <div className="py-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-slate-200 font-bold text-sm mb-3">Default Key</h3>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-400">sk-242••••••••••••••••••••••••••••••1365</span>
                <button className="text-slate-500 hover:text-slate-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button className="text-slate-500 hover:text-slate-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
              <p className="text-slate-500 text-[11px] mt-4">Created 8/5/2026</p>
            </div>
            
            <button 
              onClick={() => setKeyEnabled(!keyEnabled)}
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${keyEnabled ? 'bg-[#F26535]' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-transform ${keyEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
