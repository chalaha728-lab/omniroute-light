import React, { useState } from 'react';

export default function CombosPage() {
  const [comboChain, setComboChain] = useState<string[]>([
    'openai:gpt-4o',
    'anthropic:claude-3-5-sonnet-latest',
    'deepseek:deepseek-chat',
    'groq:llama-3.3-70b-versatile',
    'gemini:gemini-1.5-pro',
  ]);

  const [strategy, setStrategy] = useState<string>('priority-fallback');

  const addTarget = (target: string) => {
    if (target && !comboChain.includes(target)) {
      setComboChain([...comboChain, target]);
    }
  };

  const removeTarget = (index: number) => {
    setComboChain(comboChain.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            🔀 Auto-Combo & Priority Router
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure dynamic failover trees. When a provider encounters rate limits (429) or outages, OmniRoute instantly falls back to the next target without breaking client connections.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-400 font-medium">Strategy:</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="priority-fallback">Priority Fallback Chain</option>
            <option value="lowest-latency">Lowest Latency First</option>
            <option value="lowest-cost">Lowest Token Cost First</option>
            <option value="round-robin">Round-Robin Load Balance</option>
          </select>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Configured Priority Cascade Order</h3>

        <div className="space-y-3">
          {comboChain.map((target, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800/80 shadow-md hover:border-slate-700 transition-all"
            >
              <div className="flex items-center space-x-4">
                <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-mono text-xs font-bold">
                  {idx + 1}
                </span>
                <div>
                  <span className="font-mono text-sm text-cyan-300 font-medium">{target}</span>
                  <span className="text-[11px] text-slate-500 block">
                    {idx === 0 ? 'Primary Target' : `Fallback Priority Level ${idx + 1}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`text-[11px] font-mono px-3 py-1 rounded-full border ${
                    idx === 0
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {idx === 0 ? 'Primary' : `Priority ${idx + 1}`}
                </span>
                <button
                  onClick={() => removeTarget(idx)}
                  className="text-slate-500 hover:text-rose-400 text-xs px-2 py-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Add Target:</span>
          {['mistral:mistral-large-latest', 'together:meta-llama/Llama-3.3-70B-Instruct-Turbo', 'ollama:llama3.2:latest'].map(
            (preset) => (
              <button
                key={preset}
                onClick={() => addTarget(preset)}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors font-mono"
              >
                + {preset}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
