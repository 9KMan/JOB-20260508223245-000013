import React from 'react';
import { useCall } from '../context/CallContext';

export default function LiveCallStats() {
  const { state } = useCall();
  const { currentCall, agentStatus } = state;

  const getDuration = () => {
    if (!currentCall?.startTime) return '0:00';
    const diff = Math.floor((Date.now() - new Date(currentCall.startTime).getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="live-stats">
      <div className="stat-item">
        <span className="stat-label">Status</span>
        <span className="stat-value">{agentStatus.replace('-', ' ')}</span>
      </div>
      {currentCall && (
        <>
          <div className="stat-item">
            <span className="stat-label">Duration</span>
            <span className="stat-value">{getDuration()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Direction</span>
            <span className="stat-value">{currentCall.direction}</span>
          </div>
        </>
      )}
    </div>
  );
}