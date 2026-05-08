require('dotenv').config();
const connectDB = require('./Config/database');
const { seed }  = require('./Config/seed');
const app       = require('./app');

const PORT = process.env.PORT || 3020;

// Connect DB then start server
connectDB()
  .then(async () => {
    await seed();       // Llama al seed() al arrancar para poblar módulos y privilegios base
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Health: http://localhost:${PORT}/health`);
    console.log(` Protected: http://localhost:${PORT}/api/produccion/ordenes (requires JWT)`);
    console.log(`Roles:  http://localhost:${PORT}/api/roles`);
  });
})
.catch((err) => {
  console.error('Failed to start server:', err);
});

