// interfaces/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const DEV_USER = {
  id: '000000000000000000000001',
  nombreCompleto: 'Usuario Desarrollo',
  rolId: '000000000000000000000001',
  sedeId: '000000000000000000000001',
  rolNombre: 'Gerente', // en dev tiene acceso total
};

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = DEV_USER;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    // Token inválido → en dev igual permitir
    req.user = DEV_USER;
    next();
  }
};

// Restringe por rol. En dev siempre pasa porque DEV_USER tiene rolNombre 'Gerente'
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'No autenticado' });
  }
  const rolNombre = req.user.rolNombre?.toLowerCase();
  const permitidos = roles.map((r) => r.toLowerCase());
  if (!permitidos.includes(rolNombre)) {
    return res.status(403).json({ success: false, error: 'No tienes permisos para esta acción' });
  }
  next();
};

module.exports = { requireAuth, requireRole };