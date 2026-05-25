require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const suppliersRoutes   = require('./src/infrastructures/routes/suppliersRoutes');
const thirdPartyRoutes  = require('./src/infrastructures/routes/thirdPartyRoutes');
const productCategoryRoutes = require('./src/infrastructures/routes/productCategoryRoutes');
const productionRoutes  = require('./src/infrastructures/routes/productionRoutes');
const productsRoutes    = require('./src/infrastructures/routes/productsRoutes');
const roleRoutes        = require('./src/infrastructures/routes/roleRoutes');

const app = express();

// Security & Standard middleware
app.use(helmet());

// CORS Configuration - Allow frontend connection
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() }));

// API Routes - /api prefix for consistency
app.use(['/api/product-categories', '/product-categories'], productCategoryRoutes);
app.use('/api/produccion', productionRoutes);
app.use('/api/proveedores', suppliersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/terceros', thirdPartyRoutes);
app.use('/api/roles', roleRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Ruta ${req.originalUrl} no encontrada`,
  });
});

module.exports = app;

