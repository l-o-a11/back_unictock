require('dotenv').config();
const connectDB = require('./Config/database');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Health: http://localhost:${PORT}/health`);
    console.log(` Protected: http://localhost:${PORT}/api/produccion/ordenes (requires JWT)`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
});

