const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
let latest = null;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => res.json({ ok: true }));

// app.post('/api/temperature', (req, res) => {
  // const { device_id, temperature } = req.body || {};
  // if (typeof temperature !== 'number') {
    // return res.status(400).json({ error: 'temperature must be a number' });
  // }
  // latest = { device_id: device_id || 'unknown', temperature, received_at: new Date().toISOString() };
  // res.json({ ok: true, data: latest });
// });


app.post('/api/temperature', (req, res) => {
    const { device_id, temperature } = req.body || {};
    
    // Parse incoming value into a float just in case it arrived wrapped as a string
    const parsedTemperature = typeof temperature === 'string' ? parseFloat(temperature) : temperature;

    // Validate that the parsed result is a genuine, usable numerical float value
    if (parsedTemperature === undefined || parsedTemperature === null || isNaN(parsedTemperature)) {
        return res.status(400).json({ error: 'temperature must be a valid number' });
    }

    // Save the corrected parsed numerical telemetry metric into your global storage object
    latest = {
        device_id: device_id || 'unknown',
        temperature: parsedTemperature,
        received_at: new Date().toISOString()
    };

    res.json({ ok: true, data: latest });
});

// app.get('/api/temperature', (_req, res) => res.json(latest || { temperature: null }));

	app.get('/api/temperature', (_req, res) => {
		// If we have received data, extract the value cleanly and return it at root level
		if (latest) {
			return res.json({ 
				temperature: latest.temperature,
				device_id: latest.device_id,
				received_at: latest.received_at
			});
		}
		
		// Default fallback structural layout if no data has arrived yet
		res.json({ temperature: null });
	});

app.listen(port, '0.0.0.0', () => console.log(`Temperature dashboard: http://localhost:${port}`));
