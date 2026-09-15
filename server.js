const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
let latest = null;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/temperature', (req, res) => {
  const { device_id, temperature } = req.body || {};
  if (typeof temperature !== 'number') {
    return res.status(400).json({ error: 'temperature must be a number' });
  }
  latest = { device_id: device_id || 'unknown', temperature, received_at: new Date().toISOString() };
  res.json({ ok: true, data: latest });
});

app.get('/api/temperature', (_req, res) => res.json(latest || { temperature: null }));

app.listen(port, '0.0.0.0', () => console.log(`Temperature dashboard: http://localhost:${port}`));
