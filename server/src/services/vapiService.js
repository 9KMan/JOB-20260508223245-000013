function normalizeVapiEvent(event) {
  const normalized = {
    type: event.event || event.type,
    callId: event.call_id || event.id,
    leadId: event.metadata?.lead_id,
    disposition: null,
    transcript: null,
    sentiment: null,
    endTime: null,
    duration: null
  };

  if (event.event === 'end' || event.type === 'end') {
    normalized.type = 'call-ended';
    normalized.endTime = event.end_time || event.timestamp;
    normalized.duration = event.duration;
    if (event.metadata?.transcript) {
      normalized.transcript = event.metadata.transcript;
    }
    if (event.metadata?.sentiment) {
      normalized.sentiment = event.metadata.sentiment;
    }
  }

  if (event.disposition || event.result) {
    const disp = event.disposition || event.result;
    if (disp.includes('promise') || disp.includes('pay')) {
      normalized.disposition = 'promise';
    } else if (disp.includes('no-answer') || disp.includes('no answer')) {
      normalized.disposition = 'no-answer';
    } else if (disp.includes('dnc') || disp.includes('do not call')) {
      normalized.disposition = 'dnc';
    } else if (disp.includes('wrong') || disp.includes('bad number')) {
      normalized.disposition = 'wrong-number';
    } else {
      normalized.disposition = disp.toLowerCase().replace(/\s+/g, '-');
    }
  }

  if (event.actions && Array.isArray(event.actions)) {
    const dispositionAction = event.actions.find(a => a.name === 'log_disposition');
    if (dispositionAction && dispositionAction.parameters) {
      normalized.disposition = dispositionAction.parameters.disposition || normalized.disposition;
    }
  }

  return normalized;
}

module.exports = { normalizeVapiEvent };