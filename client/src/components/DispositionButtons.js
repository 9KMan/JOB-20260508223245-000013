import React, { useState } from 'react';
import { useCall } from '../context/CallContext';

const DISPOSITIONS = [
  { value: 'promise', label: 'Promise to Pay', color: '#4CAF50' },
  { value: 'no-answer', label: 'No Answer', color: '#9E9E9E' },
  { value: 'dnc', label: 'Do Not Call', color: '#F44336' },
  { value: 'wrong-number', label: 'Wrong Number', color: '#FF9800' },
  { value: 'callback', label: 'Callback Requested', color: '#2196F3' },
  { value: 'paid', label: 'Paid in Full', color: '#4CAF50' },
  { value: 'dispute', label: 'Dispute', color: '#FF5722' }
];

export default function DispositionButtons() {
  const { state } = useCall();
  const { lead, currentCall } = state;
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitDisposition = async (disposition) => {
    if (!lead && !currentCall?.leadId) return;
    const leadId = lead?._id || currentCall?.leadId;

    try {
      await fetch(`/api/leads/${leadId}/disposition`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disposition, notes, agentId: 'currentAgent' })
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Failed to submit disposition:', err);
    }
  };

  return (
    <div className="disposition-panel">
      <h3>Log Disposition</h3>
      {submitted && <p className="success-msg">Disposition logged successfully</p>}
      <div className="disposition-buttons">
        {DISPOSITIONS.map(d => (
          <button
            key={d.value}
            onClick={() => submitDisposition(d.value)}
            style={{ backgroundColor: d.color }}
            disabled={!lead && !currentCall?.leadId}
          >
            {d.label}
          </button>
        ))}
      </div>
      <textarea
        placeholder="Add notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="disposition-notes"
      />
    </div>
  );
}