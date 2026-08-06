import React, { useState } from 'react';

export default function SettingsPage() {
  const [port, setPort] = useState(20128);
  const [compressRTK, setCompressRTK] = useState(true);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-bold text-slate-100">⚙️ System & Security Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Configure OmniRoute Light daemon port, token compression defaults, and database backups.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 max-w-2xl">
        <div className="space-y-2">
          <label className="text-xs text-slate-300 font-medium">Local Gateway Listening Port</label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          />
          <p className="text-[11px] text-slate-500">Default port: 20128. Endpoint will be http://localhost:{port}/v1</p>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
          <div>
            <span className="text-xs text-slate-200 font-medium block">Global RTK Token Compression</span>
            <span className="text-[11px] text-slate-400">Automatically compress prompt whitespace and comments</span>
          </div>
          <input
            type="checkbox"
            checked={compressRTK}
            onChange={(e) => setCompressRTK(e.target.checked)}
            className="w-4 h-4 accent-cyan-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl transition-colors">
            Export Config JSON
          </button>
          <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
