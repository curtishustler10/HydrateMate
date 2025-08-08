const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 HYDRATEMATE ROOT SERVER STARTING - VERSION 2.1');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port from env:', process.env.PORT);
console.log('Port being used:', PORT);
console.log('Railway deployment fix applied');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({ 
    message: 'HydrateMate API is running!',
    port: PORT,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/ping', (req, res) => {
  console.log('Ping endpoint hit');
  res.json({ 
    status: 'ok', 
    server: 'hydratemate-root',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  console.log('Health endpoint hit');
  res.json({
    status: 'healthy',
    server: 'running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ HYDRATEMATE SERVER v2.1 STARTED SUCCESSFULLY');
  console.log(`🌐 Server listening on 0.0.0.0:${PORT}`);
  console.log(`🔗 Test endpoints:`);
  console.log(`   - http://0.0.0.0:${PORT}/`);
  console.log(`   - http://0.0.0.0:${PORT}/ping`);
  console.log(`   - http://0.0.0.0:${PORT}/health`);
  console.log('🔥 Ready for Railway traffic!');
  
  // Keep server alive
  setInterval(() => {
    console.log(`💓 Server heartbeat - ${new Date().toISOString()}`);
  }, 30000);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('📥 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('👋 Server closed gracefully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📥 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('👋 Server closed gracefully');  
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});