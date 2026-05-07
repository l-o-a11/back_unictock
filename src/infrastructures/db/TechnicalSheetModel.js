// src/infrastructures/db/TechnicalSheetModel.js
const mongoose = require('mongoose');

const technicalSheetSchema = new mongoose.Schema(
  {
    id_producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'id_producto es requerido'],
      index: true,
    },
    version: {
      type: Number,
      required: [true, 'version es requerida'],
      min: [1, 'La versión debe ser al menos 1'],
      default: 1,
    },
    responsable: {
      type: String,
      required: [true, 'responsable es requerido'],
      trim: true,
    },
    fecha_inicio: {
      type: Date,
      required: [true, 'fecha_inicio es requerida'],
    },
    fecha_fin: {
      type: Date,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TechnicalSheet', technicalSheetSchema);
