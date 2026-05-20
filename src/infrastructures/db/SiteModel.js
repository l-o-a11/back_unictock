// infrastructure/db/SiteModel.js
// telefono como String para ser consistente con la API y aceptar
// formatos colombianos (ej: "604-234-5678") sin pérdida de ceros iniciales.
//POR AHORA NUMBER

const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    nombre:    { type: String, required: true, unique: true, trim: true },
    ciudad:    { type: String, required: true, trim: true },
    barrio:    { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    telefono:  { type: Number, required: true, trim: true },
    estado:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

siteSchema.methods.toJSON = function () {
  return this.toObject();
};

module.exports = mongoose.model("Site", siteSchema);
