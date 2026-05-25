// infrastructures/db/ThirdPartyModel.js

const mongoose = require('mongoose');

// Sub-schema for linked production orders
const produccionSchema = new mongoose.Schema(
  {
    orden:        { type: Number },
    fecha:        { type: String },
    produccionId: { type: String },
  },
  { _id: false }
);

const thirdPartySchema = new mongoose.Schema(
  {
    // Código autogenerado tipo TP-001, TP-002...
    codigo:          { type: String, required: true, unique: true },

    // NIT es opcional pero único cuando se provee (sparse evita conflictos con nulos)
    nit:             { type: String, default: null, sparse: true },

    nombre_empresa:  { type: String, required: true },
    nombre_contacto: { type: String, required: true },
    direccion:       { type: String, required: true },
    telefono:        { type: String, required: true },
    correo_empresa:  { type: String, default: null },
    correo_contacto: { type: String, default: null },
    sitio_web:       { type: String, default: null },

    estado:          { type: Boolean, default: true },
    producciones:    { type: [produccionSchema], default: [] },
  },
  { timestamps: true }
);

// Índices para búsqueda eficiente
thirdPartySchema.index({ nombre_empresa: 1 });
thirdPartySchema.index({ estado: 1 });
thirdPartySchema.index({ nit: 1 }, { sparse: true });

module.exports = mongoose.model('ThirdParty', thirdPartySchema);
