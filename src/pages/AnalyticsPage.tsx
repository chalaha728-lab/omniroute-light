import React from 'react';

export default function AnalyticsPage() {
  const logs = [
    { time: '12:44:02', model: 'openai:gpt-4o', status: 200, latency: '142ms', rtkSaved: '32%' },
    { time: '12:43:18', model: 'anthropic:claude-3-5-sonnet-latest', status: 200, latency: '210ms', rtkSaved: '18%' },
    { time: '12:41:55', model: 'deepseek:deepseek-chat', status: 200, latency: '88ms', rtkSaved: '41%' },
    { time: '12:40:11', model: 'groq:llama-3.3-70b-versatile', status: 200, latency: '45ms', rtkSaved: '22%' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-bold text-slate-100">📊 Real-Time Analytics & Request Logs</h2>
        <p className="text-xs text-slate-400 mt-1">Track request latency, streaming token output, and RTK prompt compression efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400">Average Proxy Overhead</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">&lt; 0.8 ms</p>
          <span className="text-[11px] text-slate-500">Go zero-copy SSE forwarding</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400">Total Tokens Processed</span>
          <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">1,482,910</p>
          <span className="text-[11px] text-slate-500">Across 18 providers</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400">Tokens Compressed (RTK)</span>
          <p className="text-2xl font-bold text-purple-400 font-mono mt-1">364,120 Saved</p>
          <span className="text-[11px] text-slate-500">~24.5% cost reduction</span>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Proxy Executions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="pb-2">Time</th>
                <th className="pb-2">Model Target</th>
                <th className="pb-2">HTTP Status</th>
                <th className="pb-2">Latency</th>
                <th className="pb-2">RTK Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-2.5 text-slate-400">{log.time}</td>
                  <td className="py-2.5 text-cyan-300">{log.model}</td>
                  <td className="py-2.5 text-emerald-400">HTTP {log.status}</td>
                  <td className="py-2.5 text-slate-300">{log.latency}</td>
                  <td className="py-2.5 text-purple-400">{log.rtkSaved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
