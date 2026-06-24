// src/infrastructures/db/TechnicalSheetModel.js
const mongoose = require('mongoose');

const technicalSheetSchema = new mongoose.Schema(
  {
    // ── Relación con producto ─────────────────────────────────
    id_producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'id_producto es requerido'],
      index: true,
    },

    // ── Versión ───────────────────────────────────────────────
    version: {
      type: Number,
      required: [true, 'version es requerida'],
      min: [1, 'La versión debe ser al menos 1'],
      default: 1,
    },

    // ── Autor / responsable ───────────────────────────────────
    responsable: {
      type: String,
      trim: true,
      default: 'Sin responsable',
    },
    createdBy: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Fechas ────────────────────────────────────────────────
    fecha_inicio: {
      type: Date,
      default: Date.now,
    },
    fecha_fin: {
      type: Date,
      default: null,
    },

    // ── Datos generales de la ficha ───────────────────────────
    client: {
      type: String,
      trim: true,
      default: '',
    },
    ref: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    observations: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Imagen ────────────────────────────────────────────────
    image: {
      type: String,
      default: null,
    },

    // ── Materiales estructurados de la ficha ──────────────────
    fabrics: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    cups: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    closures: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    accessories: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    measurements: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    // ── Estado ────────────────────────────────────────────────
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TechnicalSheet', technicalSheetSchema);