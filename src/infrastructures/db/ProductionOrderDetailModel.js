// src/infrastructures/db/ProductionOrderDetailModel.js
const mongoose = require('mongoose');
 
const productionOrderDetailSchema = new mongoose.Schema(
  {
    id_orden:    { type: mongoose.Schema.Types.ObjectId, ref: 'ProductionOrder', required: true, index: true },
    id_producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product',         required: true },
    cantidad:    { type: Number, required: true, min: 1 },
    color:       { type: String, trim: true, default: null },
    estado:      { type: Boolean, default: true },
  },
  { timestamps: true },
);
 
module.exports = mongoose.model('ProductionOrderDetail', productionOrderDetailSchema);
 