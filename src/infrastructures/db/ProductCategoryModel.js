// infrastructure/db/ProductCategoryModel.js

const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    // Se eliminó el campo id_categoria auto-referencial (required: true)
    // que causaba ValidationError en todo intento de crear categorías.
    nombre:                { type: String, required: true, unique: true },
    descripcion:           { type: String, default: "" },   // sin tilde en la ó
    cantidad_productos:    { type: Number, default: 0 },
    productos_disponibles: { type: Number, default: 0 },
    estado:                { type: Boolean, default: true },
  },
  { timestamps: true }
);

productCategorySchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("ProductCategory", productCategorySchema);
