const { normalizeVapiEvent } = require('./vapiService');

function normalizeVicidialEvent(event) {
  const normalized = {
    type: event.event || event.action,
    leadId: event.lead_id,
    agentId: event.user || event.agent_id,
    disposition: null,
    recordingUrl: null,
    callId: event.call_id || event.uniqueid
  };

  if (event.disposition || event.disposition_text) {
    const disp = event.disposition || event.disposition_text;
    if (disp === 'SALE') normalized.disposition = 'promise';
    else if (disp === 'NOANSWER') normalized.disposition = 'no-answer';
    else if (disp === 'DNC') normalized.disposition = 'dnc';
    else if (disp === 'NEWRESCHED') normalized.disposition = 'callback';
    else normalized.disposition = disp.toLowerCase();
  }

  if (event.recording_url || event.recording) {
    normalized.recordingUrl = event.recording_url || event.recording;
  }

  return normalized;
}

module.exports = { normalizeVicidialEvent };