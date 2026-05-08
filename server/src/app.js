const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const config = require('../config');
const { Lead, CallLog, AgentSession, Queue } = require('../models');
const vapiRoutes = require('../routes/vapi');
const vicidialRoutes = require('../routes/vicidial');
const leadsRoutes = require('../routes/leads');
const agentsRoutes = require('../routes/agents');
const callsRoutes = require('../routes/calls');
const queueRoutes = require('../routes/queue');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: config.cors.origin, methods: ['GET', 'POST'] }
});

app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

app.use('/api/vapi', vapiRoutes);
app.use('/api/vicidial', vicidialRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/calls', callsRoutes);
app.use('/api/queue', queueRoutes);

io.on('connection', (socket) => {
  socket.on('agent:join', async (agentId) => {
    await AgentSession.findOneAndUpdate(
      { agentId },
      { $set: { agentId, status: 'available', loginTime: new Date() } },
      { upsert: true, new: true }
    );
    socket.join(`agent:${agentId}`);
    io.emit('agents:update', await AgentSession.find().lean());
  });

  socket.on('call:start', async (data) => {
    const callLog = await CallLog.create({
      direction: data.direction,
      agentId: data.agentId,
      leadId: data.leadId,
      startTime: new Date()
    });
    await AgentSession.findOneAndUpdate({ agentId: data.agentId }, { status: 'on-call', currentCallId: callLog._id });
    io.to(`agent:${data.agentId}`).emit('call:started', callLog);
    io.emit('queue:update', await Queue.findOne({ queueName: 'default' }) || { waiting: 0 });
  });

  socket.on('call:end', async (data) => {
    const callLog = await CallLog.findByIdAndUpdate(data.callId, { endTime: new Date() }, { new: true });
    if (callLog) {
      callLog.duration = (callLog.endTime - callLog.startTime) / 1000;
      await callLog.save();
    }
    await AgentSession.findOneAndUpdate({ agentId: data.agentId }, { status: 'wrap-up', currentCallId: null });
    io.to(`agent:${data.agentId}`).emit('call:ended', callLog);
  });

  socket.on('disconnect', async () => {
  });
});

app.set('io', io);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

module.exports = { app, server, io };