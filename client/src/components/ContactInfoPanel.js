import React from 'react';
import { useCall } from '../context/CallContext';

export default function ContactInfoPanel() {
  const { state } = useCall();
  const { lead, currentCall } = state;

  if (!lead && !currentCall) {
    return (
      <div className="contact-panel">
        <p>No active contact</p>
      </div>
    );
  }

  return (
    <div className="contact-panel">
      <h3>Contact Information</h3>
      {lead ? (
        <div className="contact-details">
          <p><strong>Name:</strong> {lead.firstName} {lead.lastName}</p>
          <p><strong>Phone:</strong> {lead.phone}</p>
          <p><strong>Account #:</strong> {lead.accountNumber}</p>
          <p><strong>Balance:</strong> ${lead.balance?.toFixed(2) || '0.00'}</p>
          <p><strong>Status:</strong> {lead.status}</p>
          {lead.lastDisposition && (
            <p><strong>Last Disposition:</strong> {lead.lastDisposition}</p>
          )}
        </div>
      ) : (
        <p>Loading contact...</p>
      )}
    </div>
  );
}