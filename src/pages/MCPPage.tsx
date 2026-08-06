import React, { useState } from 'react';

export default function MCPPage() {
  const [servers, setServers] = useState([
    { id: 'filesystem', name: 'File System MCP', status: 'Active', toolsCount: 8, transport: 'stdio' },
    { id: 'github', name: 'GitHub Integration MCP', status: 'Active', toolsCount: 14, transport: 'SSE' },
    { id: 'postgres', name: 'PostgreSQL Database MCP', status: 'Standby', toolsCount: 6, transport: 'stdio' },
    { id: 'brave-search', name: 'Brave Web Search MCP', status: 'Active', toolsCount: 3, transport: 'stdio' },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            🛠️ Model Context Protocol (MCP) & A2A
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Connect external tool servers, database inspectors, and agent-to-agent protocols directly through OmniRoute's unified proxy.
          </p>
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
          + Add MCP Server
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {servers.map((s) => (
          <div key={s.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  {s.name}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      s.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                </h3>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {s.transport}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mb-4">ID: {s.id}</p>

              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">Exposed Tools</span>
                <span className="font-mono text-cyan-300 font-bold">{s.toolsCount} Tools Active</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-emerald-400 font-mono text-[11px]">{s.status}</span>
              <button className="text-cyan-400 hover:underline text-xs">Inspect Tools ↗</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
