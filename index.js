const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 ROOT LEVEL TEST SERVER');
console.log(`Port: ${PORT}`);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Root level server working!',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/ping', (req, res) => {
  res.json({ status: 'ok', location: 'root' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ ROOT SERVER RUNNING ON PORT ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('ROOT UNCAUGHT:', err);
});