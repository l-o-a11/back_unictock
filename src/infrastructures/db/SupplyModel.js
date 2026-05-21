// infrastructures/db/SupplyModel.js

const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema(
  {
    nombre: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    // Referencia a la categoría (ObjectId) — se popula en queries si se necesita
    categoria: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'SupplyCategory',
      required: true,
    },
    stock: {
      type:    Number,
      default: 0,
      min:     0,
    },
    valor_medida: {
      type:     Number,
      required: true,
      min:      0,
    },
    medida: {
      type:     String,
      required: true,
      trim:     true,
    },
    imagenes_Url: {
      type:    [String],
      default: [],
    },
    estado: {
      type:    Boolean,
      default: true,
    },
    propiedades: {
      type:    [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true },
);

// Índice de texto para búsquedas rápidas
supplySchema.index({ nombre: 'text' });
supplySchema.index({ categoria: 1 });
supplySchema.index({ estado: 1 });

module.exports = mongoose.model('Supply', supplySchema);
