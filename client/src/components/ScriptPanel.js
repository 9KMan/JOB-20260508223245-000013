import React from 'react';
import { useCall } from '../context/CallContext';

export default function ScriptPanel() {
  const { state } = useCall();
  const { script } = state;

  const defaultScript = `Welcome to Collections Services. My name is [Agent Name].

I'm calling regarding account number [Account #] with a balance of $[Balance].

[Based on customer's response, follow the appropriate script path...]

Do you need anything else from me today?`;

  return (
    <div className="script-panel">
      <h3>Collection Script</h3>
      <div className="script-content">
        <pre>{script || defaultScript}</pre>
      </div>
    </div>
  );
}