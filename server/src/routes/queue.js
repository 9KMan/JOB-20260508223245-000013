const express = require('express');
const { Queue } = require('../models');

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const queues = await Queue.find().lean();
    res.json(queues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;