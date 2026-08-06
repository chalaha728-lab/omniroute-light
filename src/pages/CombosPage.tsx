import React, { useState } from 'react';

export default function CombosPage() {
  const [comboChain, setComboChain] = useState<string[]>([
    'openai:gpt-4o',
    'anthropic:claude-3-5-sonnet-latest',
    'deepseek:deepseek-chat',
    'groq:llama-3.3-70b-versatile',
    'gemini:gemini-1.5-pro',
  ]);

  const [strategy, setStrategy] = useState<string>('auto-combo');
  const [circuitBreaker, setCircuitBreaker] = useState(true);
  const [rtkCompression, setRtkCompression] = useState(true);
  const [cavemanMode, setCavemanMode] = useState(false);

  const addTarget = (target: string) => {
    if (target && !comboChain.includes(target)) {
      setComboChain([...comboChain, target]);
    }
  };

  const removeTarget = (index: number) => {
    setComboChain(comboChain.filter((_, i) => i !== index));
  };

  const saveConfig = () => {
    console.log('Saved Routing Config');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            🔀 Advanced Routing & Auto-Combo Engine
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Configure dynamic multi-tier fallback trees. OmniRoute's core evaluates provider latency, cost, 
            and circuit-breaker health in real-time to select the optimal model target without breaking client connections.
          </p>
        </div>

        <div className="flex flex-col gap-3 min-w-[280px]">
          <div className="flex items-center justify-between space-x-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Strategy Engine</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 shadow-inner"
            >
              <option value="auto-combo">Auto-Combo (Scoring Matrix)</option>
              <option value="priority-fallback">Strict Priority Fallback</option>
              <option value="lowest-latency">Least Used / Lowest Latency</option>
              <option value="round-robin">Round-Robin Distributed</option>
              <option value="weighted">Weighted Percentage</option>
            </select>
          </div>
          <button 
            onClick={saveConfig}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-colors shadow-lg shadow-cyan-900/50"
          >
            Apply Routing Engine Config
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Chain Configuration */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                🔗 Configured Routing Targets 
                <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{comboChain.length} Targets</span>
              </h3>
            </div>

            <div className="space-y-3">
              {comboChain.map((target, idx) => {
                // Mock circuit breaker status for UI preview
                const isDegraded = idx === 1;
                const isDead = idx === 3;
                
                return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-xl border shadow-md transition-all ${
                    isDead ? 'bg-rose-950/10 border-rose-900/30 opacity-70' :
                    isDegraded ? 'bg-amber-950/10 border-amber-900/30' :
                    'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                      isDead ? 'bg-rose-950 text-rose-500 border border-rose-900/50' :
                      isDegraded ? 'bg-amber-950 text-amber-500 border border-amber-900/50' :
                      idx === 0 ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                      'bg-slate-900 text-slate-400 border border-slate-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-mono text-sm text-slate-200 font-medium">{target}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                          {idx === 0 ? 'Primary' : 'Fallback'}
                        </span>
                        {strategy === 'auto-combo' && !isDead && (
                          <span className="text-[10px] text-emerald-400/80 font-mono">score: {((5 - idx) * 0.15 + 0.1).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      {isDead ? (
                        <span className="bg-rose-950/80 text-rose-400 px-2 py-0.5 rounded border border-rose-900/50">CIRCUIT DEAD</span>
                      ) : isDegraded ? (
                        <span className="bg-amber-950/80 text-amber-400 px-2 py-0.5 rounded border border-amber-900/50">DEGRADED</span>
                      ) : (
                        <span className="bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/50">HEALTHY</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeTarget(idx)}
                      className="text-slate-600 hover:text-rose-400 text-xs px-2 py-1 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )})}
            </div>

            {/* Quick Add Bar */}
            <div className="mt-5 pt-5 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Quick Append:</span>
                <div className="flex flex-wrap gap-2">
                  {['mistral:mistral-large-latest', 'together:meta-llama/Llama-3.3-70B-Instruct', 'ollama:qwen2.5-coder:latest', 'novita:deepseek/deepseek-r1'].map(
                    (preset) => (
                      <button
                        key={preset}
                        onClick={() => addTarget(preset)}
                        className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors font-mono"
                      >
                        + {preset}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-Processing Pipeline & Circuit Breakers */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-lg">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              🛡️ Resilience & Handoff
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer group p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                <input type="checkbox" checked={circuitBreaker} onChange={() => setCircuitBreaker(!circuitBreaker)} className="mt-1 w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30 bg-slate-900" />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">In-Memory Circuit Breaker</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Auto-isolates failing proxy endpoints for 5-30 mins after 3 consecutive 500/429 errors.
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                <input type="checkbox" checked={true} readOnly className="mt-1 w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30 bg-slate-900" />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">Universal Context Handoff</div>
                  <div className="text-[11px] text-emerald-400/80 mt-0.5 leading-relaxed font-mono bg-emerald-950/30 px-2 py-1 rounded">
                    &lt;omniroute_system_transfer/&gt;
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Automatically injects XML summary of prior model context when failing over mid-session.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-lg">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              🗜️ Token Compression Pipeline
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer group p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                <input type="checkbox" checked={rtkCompression} onChange={() => setRtkCompression(!rtkCompression)} className="mt-1 w-4 h-4 rounded border-slate-700 text-purple-500 focus:ring-purple-500/30 bg-slate-900" />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors">RTK Mode (Structural)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Strips ANSI, deduplicates repeated terminal lines, optimizes tool output structures. ~60% savings.
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                <input type="checkbox" checked={cavemanMode} onChange={() => setCavemanMode(!cavemanMode)} className="mt-1 w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500/30 bg-slate-900" />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">Caveman Mode (Semantic)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Strips polite AI hedging and conversational filler while strictly preserving Markdown code blocks. ~30% savings.
                  </div>
                </div>
              </label>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}