const jwt = require('jsonwebtoken');
require('dotenv').config();

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // ✅ DEVELOPMENT MODE: Permitir requests sin JWT
  // ObjectId fijo de 24 hex chars — compatible con campos ObjectId de Mongoose
  const DEV_USER = {
    id: '000000000000000000000001',
    nombre: 'Usuario Desarrollo',
    rolId: 1,
  };

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = DEV_USER;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: userId, ... }
    next();
  } catch (error) {
    // Token inválido → en desarrollo igualmente permitir con dev user
    req.user = DEV_USER;
    next();
  }
};

module.exports = { requireAuth };

