import React, { useState, useEffect } from 'react';
import Sidebar, { TabType } from './components/Sidebar';
import ProvidersPage from './pages/ProvidersPage';
import CombosPage from './pages/CombosPage';
import MCPPage from './pages/MCPPage';
import SkillsPage from './pages/SkillsPage';
import GuardrailsPage from './pages/GuardrailsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('providers');
  const [status, setStatus] = useState<string>('Connecting...');

  useEffect(() => {
    fetch('http://localhost:20128/health')
      .then((res) => res.json())
      .then((data) => setStatus(`Online (Engine: ${data.engine})`))
      .catch(() => setStatus('Proxy Disconnected'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-cyan-500 selection:text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} status={status} />

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {activeTab === 'providers' && <ProvidersPage />}
        {activeTab === 'combos' && <CombosPage />}
        {activeTab === 'mcp' && <MCPPage />}
        {activeTab === 'skills' && <SkillsPage />}
        {activeTab === 'guardrails' && <GuardrailsPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}
