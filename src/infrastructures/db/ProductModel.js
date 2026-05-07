// infrastructure/db/ProductModel.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id_categoria: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory", required: true, },
    imagenes_Url: { type: [String], default: [], },
    referencia: { type: String, required: true, unique: true, },
    nombre: { type: String, required: true, unique: true, },
    precio: { type: Number, required: true, },
    stock: { type: Number, required: true, },
    estado: { type: Boolean, default: true,},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
