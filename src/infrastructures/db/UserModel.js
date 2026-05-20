// infrastructures/db/UserModel.js
// Modelo mínimo de Usuario — solo se usa para validar relaciones con Roles.
// El CRUD completo de usuarios vive en la otra API (Api_Unistock).

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nombre:    { type: String, required: true, trim: true },
    correo:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true },
    rolId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    estado:    { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
