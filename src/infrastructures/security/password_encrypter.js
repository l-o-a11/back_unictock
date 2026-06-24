const bcrypt = require('bcryptjs');

const hash = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const compare = async (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

// Alias para compatibilidad
module.exports = { hash, compare, hashPassword: hash, comparePassword: compare };