const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  firstName: { type: String },
  lastName: { type: String },
  accountNumber: { type: String, index: true },
  balance: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['new', 'assigned', 'called', 'promised', 'paid', 'closed'],
    default: 'new',
    index: true
  },
  assignedAgent: { type: String },
  lastCallDate: { type: Date },
  lastDisposition: { type: String },
  notes: [{
    text: String,
    agent: String,
    ts: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

leadSchema.index({ phone: 1, accountNumber: 1 });

const CallLogSchema = new mongoose.Schema({
  direction: { type: String, enum: ['inbound', 'outbound'], required: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', index: true },
  agentId: { type: String, index: true },
  vapiCallId: { type: String },
  vicidialLeadId: { type: String },
  startTime: { type: Date },
  endTime: { type: Date },
  duration: { type: Number },
  disposition: { type: String },
  recordingUrl: { type: String },
  transcript: { type: String },
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] }
}, { timestamps: true });

CallLogSchema.index({ vapiCallId: 1 });
CallLogSchema.index({ agentId: 1, startTime: -1 });

const AgentSessionSchema = new mongoose.Schema({
  agentId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['available', 'on-call', 'wrap-up', 'break'],
    default: 'available'
  },
  currentCallId: { type: mongoose.Schema.Types.ObjectId, ref: 'CallLog' },
  loginTime: { type: Date },
  callsToday: { type: Number, default: 0 }
}, { timestamps: true });

const QueueSchema = new mongoose.Schema({
  queueName: { type: String, required: true, unique: true },
  waiting: { type: Number, default: 0 },
  avgWaitTime: { type: Number, default: 0 },
  agentsOnline: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
  Lead: mongoose.model('Lead', leadSchema),
  CallLog: mongoose.model('CallLog', CallLogSchema),
  AgentSession: mongoose.model('AgentSession', AgentSessionSchema),
  Queue: mongoose.model('Queue', QueueSchema)
};