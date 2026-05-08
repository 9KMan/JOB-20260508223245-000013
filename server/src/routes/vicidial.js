const express = require('express');
const { vicidial } = require('../../config');
const { CallLog, Lead, AgentSession } = require('../models');

const router = express.Router();

router.post('/webhook', async (req, res) => {
  try {
    const { lead_id, user, event, recording_url, disposition } = req.body;
    const callLog = await CallLog.findOneAndUpdate(
      { vicidialLeadId: lead_id },
      {
        vicidialLeadId: lead_id,
        disposition,
        recordingUrl: recording_url,
        agentId: user
      },
      { new: true }
    );
    if (disposition) {
      const lead = await Lead.findOneAndUpdate(
        { accountNumber: lead_id },
        { lastDisposition: disposition, lastCallDate: new Date() },
        { new: true }
      );
      if (lead) {
        const io = req.app.get('io');
        io.to(`agent:${user}`).emit('vicidial:update', { lead, callLog });
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/leads', async (req, res) => {
  try {
    const leads = await Lead.find().limit(100).lean();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/agent-status', async (req, res) => {
  try {
    const agents = await AgentSession.find().lean();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/disposition', async (req, res) => {
  try {
    const { leadId, disposition, notes } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      leadId,
      {
        lastDisposition: disposition,
        lastCallDate: new Date(),
        status: disposition === 'promise' ? 'promised' : 'called',
        $push: { notes: { text: notes, ts: new Date() } }
      },
      { new: true }
    );
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/call-recording', async (req, res) => {
  try {
    const { callId } = req.query;
    const callLog = await CallLog.findById(callId);
    if (callLog && callLog.recordingUrl) {
      res.redirect(callLog.recordingUrl);
    } else {
      res.status(404).json({ error: 'Recording not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;