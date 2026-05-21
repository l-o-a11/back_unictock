// infrastructures/db/SupplyCategoryModel.js

const mongoose = require('mongoose');

const supplyCategorySchema = new mongoose.Schema(
  {
    nombre: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    descripcion: {
      type:    String,
      default: '',
      trim:    true,
    },
    estado: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

supplyCategorySchema.index({ nombre: 'text' });
supplyCategorySchema.index({ estado: 1 });

module.exports = mongoose.model('SupplyCategory', supplyCategorySchema);
