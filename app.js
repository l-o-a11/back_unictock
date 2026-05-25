require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const productCategoryRoutes = require('./src/infrastructures/routes/productCategoryRoutes');
const suppliersRoutes   = require('./src/infrastructures/routes/suppliersRoutes');
const productsRoutes    = require('./src/infrastructures/routes/productsRoutes');
const thirdPartyRoutes  = require('./src/infrastructures/routes/thirdPartyRoutes');

const app = express();

// Security & Standard middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() }));

// API Routes - /api prefix for consistency
app.use('/api/product-categories', require('./src/infrastructures/routes/productCategoryRoutes'));
app.use('/api/products', require('./src/infrastructures/routes/productsRoutes'));
app.use('/api/produccion', productionRoutes);
app.use('/api/proveedores', suppliersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/terceros', thirdPartyRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

module.exports = app;

