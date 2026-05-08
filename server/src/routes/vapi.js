const express = require('express');
const { VAPI } = require('../config');
const { CallLog, Lead } = require('../models');
const { normalizeVapiEvent } = require('../services/vapiService');

const router = express.Router();

router.post('/create-call', async (req, res) => {
  try {
    const { phone, leadId, agentId } = req.body;
    const callLog = await CallLog.create({
      direction: 'outbound',
      leadId,
      agentId,
      startTime: new Date()
    });
    res.json({ success: true, callId: callLog._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const normalized = normalizeVapiEvent(req.body);
    if (normalized.type === 'call-ended' && normalized.callId) {
      await CallLog.findOneAndUpdate(
        { vapiCallId: normalized.callId },
        {
          endTime: new Date(normalized.endTime),
          duration: normalized.duration,
          transcript: normalized.transcript,
          sentiment: normalized.sentiment
        }
      );
    }
    if (normalized.leadId && normalized.disposition) {
      await Lead.findByIdAndUpdate(normalized.leadId, {
        lastDisposition: normalized.disposition,
        lastCallDate: new Date(),
        status: normalized.disposition === 'promise' ? 'promised' : 'called'
      });
    }
    const io = req.app.get('io');
    io.emit('vapi:event', normalized);
    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/end-call', async (req, res) => {
  try {
    const { callId } = req.body;
    await CallLog.findByIdAndUpdate(callId, { endTime: new Date() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/get-call-status', async (req, res) => {
  try {
    const { callId } = req.query;
    const callLog = await CallLog.findById(callId).populate('leadId');
    res.json(callLog || { status: 'unknown' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;