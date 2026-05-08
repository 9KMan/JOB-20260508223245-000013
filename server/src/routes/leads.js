const express = require('express');
const { Lead } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, status, agent } = req.query;
    const query = {};
    if (status) query.status = status;
    if (agent) query.assignedAgent = agent;
    const leads = await Lead.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    const total = await Lead.countDocuments(query);
    res.json({ leads, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).lean();
    res.json(lead || { error: 'Lead not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/disposition', async (req, res) => {
  try {
    const { disposition, notes, agentId } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        lastDisposition: disposition,
        lastCallDate: new Date(),
        status: disposition === 'promise' ? 'promised' : 'called',
        $push: { notes: { text: notes, agent: agentId, ts: new Date() } }
      },
      { new: true }
    );
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;