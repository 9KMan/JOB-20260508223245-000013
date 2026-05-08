module.exports = {
  port: process.env.PORT || 3001,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/collections'
  },
  vapi: {
    apiKey: process.env.VAPI_API_KEY || '',
    assistantId: process.env.VAPI_ASSISTANT_ID || '',
    webhookSecret: process.env.VAPI_WEBHOOK_SECRET || ''
  },
  vicidial: {
    baseUrl: process.env.VICIDIAL_URL || 'http://localhost:8080',
    apiKey: process.env.VICIDIAL_API_KEY || ''
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  }
};