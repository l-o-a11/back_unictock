// infrastructure/db/SupplierModel.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    nit:                 { type: String, required: true, unique: true, trim: true },
    nombre_de_empresa:   { type: String, required: true, trim: true },
    nombre_del_contacto: { type: String, required: true, trim: true },
    direccion:           { type: String, required: true, trim: true },
    telefono:            { type: String, required: true, trim: true },
    correo:              { type: String, required: true, unique: true, lowercase: true, trim: true },
    sitio_web:           { type: String, default: null, trim: true },
    activo:              { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Índices para búsquedas rápidas
supplierSchema.index({ nombre_de_empresa: 'text', nombre_del_contacto: 'text', correo: 'text' });
supplierSchema.index({ activo: 1 });

module.exports = mongoose.model('Supplier', supplierSchema);
