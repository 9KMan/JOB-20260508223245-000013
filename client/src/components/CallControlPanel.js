import React from 'react';
import { useCall } from '../context/CallContext';

export default function CallControlPanel() {
  const { state, dispatch } = useCall();
  const { currentCall, agentStatus, queueStats } = state;

  const startCall = async (leadId) => {
    const socket = window.socket;
    if (socket) {
      socket.emit('call:start', { direction: 'outbound', leadId, agentId: 'currentAgent' });
    }
  };

  const endCall = () => {
    const socket = window.socket;
    if (socket && currentCall) {
      socket.emit('call:end', { callId: currentCall._id, agentId: 'currentAgent' });
    }
    dispatch({ type: 'RESET' });
  };

  const setStatus = async (status) => {
    await fetch(`/api/agents/currentAgent/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    dispatch({ type: 'SET_STATUS', payload: status });
  };

  return (
    <div className="call-control-panel">
      <div className="status-bar">
        <span className="status-indicator" data-status={agentStatus} />
        <span>{agentStatus.replace('-', ' ')}</span>
      </div>

      <div className="queue-info">
        <span>Queue: {queueStats.waiting} waiting</span>
        <span>Agents: {queueStats.agentsOnline} online</span>
      </div>

      <div className="call-buttons">
        {currentCall ? (
          <>
            <span>Call Active: {currentCall._id}</span>
            <button onClick={endCall} className="btn-end">End Call</button>
          </>
        ) : (
          <button onClick={() => startCall('lead123')} className="btn-start">Start Call</button>
        )}
      </div>

      <div className="status-buttons">
        <button onClick={() => setStatus('available')} disabled={agentStatus === 'on-call'}>Available</button>
        <button onClick={() => setStatus('break')} disabled={agentStatus === 'on-call'}>Break</button>
        <button onClick={() => setStatus('wrap-up')} disabled={agentStatus !== 'on-call'}>Wrap Up</button>
      </div>
    </div>
  );
}