import React, { useState } from 'react';

export default function GuardrailsPage() {
  const [redactPII, setRedactPII] = useState(true);
  const [blockDangerous, setBlockDangerous] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(50);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-bold text-slate-100">🛡️ Safety, Guardrails & Governance</h2>
        <p className="text-xs text-slate-400 mt-1">Configure compliance rules, PII redaction, token budgets, and prompt injection filters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-100 text-sm">Privacy & Security Policies</h3>
          
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-200 font-medium block">Automatic PII Redaction</span>
              <span className="text-[11px] text-slate-400">Strips emails, phone numbers, and API keys prior to upstream proxy</span>
            </div>
            <input
              type="checkbox"
              checked={redactPII}
              onChange={(e) => setRedactPII(e.target.checked)}
              className="w-4 h-4 accent-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-200 font-medium block">Prompt Injection Guard</span>
              <span className="text-[11px] text-slate-400">Blocks malicious jailbreak instructions and unsafe system overrides</span>
            </div>
            <input
              type="checkbox"
              checked={blockDangerous}
              onChange={(e) => setBlockDangerous(e.target.checked)}
              className="w-4 h-4 accent-cyan-500"
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-100 text-sm">Token Budget & Cost Caps</h3>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 flex justify-between">
              <span>Monthly Budget Hard Cap</span>
              <span className="font-mono text-cyan-400 font-bold">${monthlyBudget}.00 USD</span>
            </label>
            <input
              type="range"
              min="10"
              max="500"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
            <span className="text-slate-400">Current Monthly Spend</span>
            <span className="font-mono text-emerald-400 font-bold">$4.18 USD (8.3% used)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
