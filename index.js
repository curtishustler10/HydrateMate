const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 HYDRATEMATE ROOT SERVER STARTING');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port from env:', process.env.PORT);
console.log('Port being used:', PORT);

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
  console.log('✅ HYDRATEMATE SERVER STARTED SUCCESSFULLY');
  console.log(`🌐 Server listening on 0.0.0.0:${PORT}`);
  console.log(`🔗 Test endpoints:`);
  console.log(`   - http://0.0.0.0:${PORT}/`);
  console.log(`   - http://0.0.0.0:${PORT}/ping`);
  console.log(`   - http://0.0.0.0:${PORT}/health`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});