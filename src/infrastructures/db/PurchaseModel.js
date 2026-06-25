// infrastructures/db/PurchaseModel.js
// Modelo de solo lectura — las compras se crean y gestionan desde la API (puerto 3000).
// Este archivo existe para que el Backend pueda consultar compras sin duplicar la lógica.

const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    consecutivo:     { type: Number },
    fecha:           { type: Date },
    proveedorId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Suppliers' },
    total:           { type: Number },
    anulada:         { type: Boolean, default: false },
    observaciones:   { type: String },
    numeroFactura:   { type: String },
    motivoAnulacion: { type: String, default: null },
    fechaAnulacion:  { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Purchase', purchaseSchema);
