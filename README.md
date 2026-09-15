# ESP32 Temperature Dashboard

Small cloud-ready Node.js dashboard that accepts the ESP32 payload:

```json
{"device_id":"ESP32_P4_PROBE","temperature":28.63}
```

## Run locally

```text
npm install
npm start
```

Open `http://localhost:3000`. The receiver endpoint is:

```text
POST http://localhost:3000/api/temperature
Content-Type: application/json
```

## Deploy as a demo

Create a free account on a cloud host that supports Node.js, connect this project/repository, and use:

- Build command: `npm install`
- Start command: `npm start`
- Health check: `/health`

After deployment, update the ESP32 URL to:

```text
https://YOUR-APP-DOMAIN/api/temperature
```

The current demo stores the latest reading in memory. A database should be added before production use or historical charts.
