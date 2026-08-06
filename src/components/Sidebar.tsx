import React from 'react';

export type TabType = 'endpoint' | 'providers' | 'combos' | 'mcp' | 'skills' | 'guardrails' | 'analytics' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  status: string;
}

export default function Sidebar({ activeTab, setActiveTab, status }: SidebarProps) {
  const menuItems: { id: TabType; label: string; icon: string; badge?: string }[] = [
    { id: 'endpoint', label: 'Endpoint', icon: '⚡' },
    { id: 'providers', label: 'Endpoints & Providers', icon: '📡', badge: '18+' },
    { id: 'combos', label: 'Auto-Combo Router', icon: '🔀' },
    { id: 'mcp', label: 'MCP Tools & A2A', icon: '🛠️', badge: 'MCP' },
    { id: 'skills', label: 'Agent Memory & Skills', icon: '🧠' },
    { id: 'guardrails', label: 'Guardrails & Governance', icon: '🛡️' },
    { id: 'analytics', label: 'Usage & Cost Analytics', icon: '📊' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 selection:bg-cyan-500">
      <div>
        {/* Logo Branding */}
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-xl gradient-glow flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            OR
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
              OmniRoute <span className="text-cyan-400 font-mono text-xs bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/50">Light</span>
            </h1>
            <p className="text-[11px] text-slate-400">High-Speed AI Router Engine</p>
          </div>
        </div>

        {/* Engine Status */}
        <div className="mb-6 px-2 py-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${status.includes('Online') ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs font-mono text-slate-300">{status}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Port 20128</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 px-2 text-[11px] text-slate-500 font-mono">
        <div className="flex justify-between items-center mb-1">
          <span>Engine RAM</span>
          <span className="text-emerald-400 font-bold">18.4 MB</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Routing Overhead</span>
          <span className="text-cyan-400 font-bold">&lt; 0.8 ms</span>
        </div>
      </div>
    </aside>
  );
}
