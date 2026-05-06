// src/infrastructures/db/ProductModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nombre es requerido'],
    trim: true,
    maxlength: [100, 'Nombre muy largo']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Descripción muy larga']
  },
  price: {
    type: Number,
    required: [true, 'Precio es requerido'],
    min: [0, 'Precio no puede ser negativo']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock no puede ser negativo']
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

