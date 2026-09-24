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
    const {
        device_id,
        temperature,
        acceleration_magnitude_g,
        shock_alarm,
        temperature_alarm,
    } = req.body || {};
    
    // Parse incoming value into a float just in case it arrived wrapped as a string
    const parsedTemperature = typeof temperature === 'string' ? parseFloat(temperature) : temperature;

    // Validate that the parsed result is a genuine, usable numerical float value
    if (parsedTemperature === undefined || parsedTemperature === null || isNaN(parsedTemperature)) {
        return res.status(400).json({ error: 'temperature must be a valid number' });
    }

    const parsedAcceleration = acceleration_magnitude_g === undefined || acceleration_magnitude_g === null
        ? null
        : Number(acceleration_magnitude_g);

    if (parsedAcceleration !== null && !Number.isFinite(parsedAcceleration)) {
        return res.status(400).json({ error: 'acceleration_magnitude_g must be a valid number' });
    }

    // Save the corrected parsed numerical telemetry metric into your global storage object
    latest = {
        ...req.body,
        device_id: device_id || 'unknown',
        temperature: parsedTemperature,
        acceleration_magnitude_g: parsedAcceleration,
        shock_alarm: Boolean(shock_alarm),
        temperature_alarm: Boolean(temperature_alarm),
        received_at: new Date().toISOString()
    };

    res.json({ ok: true, data: latest });
});

// app.get('/api/temperature', (_req, res) => res.json(latest || { temperature: null }));

	app.get('/api/temperature', (_req, res) => {
		// If we have received data, extract the value cleanly and return it at root level
		if (latest) {
			return res.json(latest);
		}
		
		// Default fallback structural layout if no data has arrived yet
		res.json({
			temperature: null,
			acceleration_magnitude_g: null,
			shock_alarm: false,
			temperature_alarm: false,
		});
	});

app.listen(port, '0.0.0.0', () => console.log(`Temperature dashboard: http://localhost:${port}`));
