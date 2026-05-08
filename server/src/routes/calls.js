const express = require('express');
const { CallLog } = require('../models');

const router = express.Router();

router.get('/active', async (req, res) => {
  try {
    const calls = await CallLog.find({ endTime: null }).populate('leadId').lean();
    res.json(calls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/recording', async (req, res) => {
  try {
    const callLog = await CallLog.findById(req.params.id);
    if (callLog && callLog.recordingUrl) {
      res.redirect(callLog.recordingUrl);
    } else {
      res.status(404).json({ error: 'Recording not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/transcript', async (req, res) => {
  try {
    const callLog = await CallLog.findById(req.params.id);
    res.json({ transcript: callLog?.transcript || '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;