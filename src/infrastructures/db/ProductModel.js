// infrastructure/db/ProductModel.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // id_categorias: acepta tanto el ID numérico enviado por el frontend (1,2,3)
    // como un ObjectId de MongoDB. Guardado como String para flexibilidad.
    id_categorias: { type: String, default: null },
    imagenes_Url:  { type: [String], default: [] },
    referencia:    { type: String, required: true, unique: true },
    nombre:        { type: String, required: true },
    precio:        { type: Number, required: true, min: 0 },
    stock:         { type: Number, required: true, min: 0 },
    activo:        { type: Boolean, default: true },
    estado:        { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
