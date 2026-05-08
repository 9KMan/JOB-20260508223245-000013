const express = require('express');
const { AgentSession } = require('../models');

const router = express.Router();

router.get('/:id/status', async (req, res) => {
  try {
    const session = await AgentSession.findOne({ agentId: req.params.id }).lean();
    res.json(session || { status: 'offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const session = await AgentSession.findOneAndUpdate(
      { agentId: req.params.id },
      { $set: { status } },
      { upsert: true, new: true }
    );
    const io = req.app.get('io');
    io.emit('agents:update', await AgentSession.find().lean());
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;