require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const productionRoutes = require('./src/infrastructures/routes/productionRoutes');
const suppliersRoutes = require('./src/infrastructures/routes/suppliersRoutes');

const app = express();

// Security & Standard middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() }));

// API Routes - /api prefix for consistency
app.use('/api/produccion', productionRoutes);
app.use('/api/proveedores', suppliersRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

module.exports = app;

