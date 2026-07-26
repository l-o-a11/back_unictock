// infrastructures/db/UserModel.js
// Modelo mínimo de Usuario — solo se usa para validar relaciones con Roles.
// El CRUD completo de usuarios vive en la otra API (Api_Unistock).

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // `nombreCompleto` es el campo del servicio de usuarios actual; `nombre`
    // se conserva para registros legados de este backend.
    nombre:    { type: String, trim: true },
    nombreCompleto: { type: String, trim: true },
    correo:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true },
    rolId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    // Un empleado puede ser responsable de varias etapas de producción.
    cargo:     { type: [String], default: [] },
    estado:    { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
