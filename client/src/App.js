import React from 'react';
import CallControlPanel from './components/CallControlPanel';
import ContactInfoPanel from './components/ContactInfoPanel';
import ScriptPanel from './components/ScriptPanel';
import DispositionButtons from './components/DispositionButtons';
import LiveCallStats from './components/LiveCallStats';
import { CallProvider } from './context/CallContext';
import './App.css';

function AgentDashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Collections Agent Dashboard</h1>
        <LiveCallStats />
      </header>
      <main className="dashboard-grid">
        <div className="panel call-controls">
          <CallControlPanel />
        </div>
        <div className="panel contact-info">
          <ContactInfoPanel />
        </div>
        <div className="panel script">
          <ScriptPanel />
        </div>
        <div className="panel disposition">
          <DispositionButtons />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CallProvider agentId="agent-001">
      <AgentDashboard />
    </CallProvider>
  );
}