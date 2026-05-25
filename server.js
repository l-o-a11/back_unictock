require('dotenv').config();
const connectDB = require('./Config/database');
const app = require('./app');

const PORT = process.env.PORT || 3020;

// Connect DB then start server
let serverStarted = false;
const startServer = () => {
  if (serverStarted) return;
  serverStarted = true;

  const listener = app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Health: http://localhost:${PORT}/health`);
    console.log(` Protected: http://localhost:${PORT}/api/produccion/ordenes (requires JWT)`);
  });

  listener.on('error', (err) => {
    // Evitar crash por EADDRINUSE: port ya ocupado.
    if (err?.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} already in use. Backend not started (another instance is running).`);
      return;
    }
    throw err;
  });
};

connectDB()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    // No tumbar el server si Mongo cae por red/whitelist/DNS.
    // Igual iniciamos para que el frontend pueda operar con rutas mock/fallback.
    console.error('Failed to start server (mongo connection):', err?.message || err);
    startServer();
  });


