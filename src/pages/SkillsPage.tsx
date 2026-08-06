import React from 'react';

export default function SkillsPage() {
  const skills = [
    { name: 'code-review-assistant', type: 'ACP Skill', description: 'Enforces strict TypeScript & security conventions' },
    { name: 'documentation-accuracy', type: 'ACP Skill', description: 'Verifies API routes against actual codebase definitions' },
    { name: 'vector-memory-search', type: 'Vector Memory', description: 'Stores past conversation context in SQLite-vec' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-100">🧠 Agent Memory & Skills System</h2>
          <p className="text-xs text-slate-400 mt-1">Manage prompt skills, ACP protocol handlers, and vector memory indexing.</p>
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all">
          + Create Skill
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((s, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-100 font-mono text-sm">{s.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{s.description}</p>
            </div>
            <span className="text-xs bg-slate-950 text-cyan-300 border border-slate-800 px-3 py-1 rounded-lg font-mono">
              {s.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
