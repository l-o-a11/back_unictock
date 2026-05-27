// infrastructures/db/SiteModel.js
// FIX #5 (BACKEND): eliminado trim:true del campo Number (era ignorado silenciosamente)
// FIX #5 (BACKEND): telefono cambiado a String — mismo tipo que API, sin pérdida de ceros
// FIX #6: modelo renombrado de "Site" a "Sede" para que ambos servicios
//         apunten a la misma colección MongoDB ("sedes")

const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    nombre:    { type: String, required: true, unique: true, trim: true },
    ciudad:    { type: String, required: true, trim: true },
    barrio:    { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    // FIX #5: era { type: Number, required: true, trim: true }
    // trim en Number es ignorado por Mongoose; Number descarta ceros iniciales
    telefono:  { type: String, required: true, trim: true },
    estado:    { type: Boolean, default: true },
  },
  { timestamps: true },
);

siteSchema.methods.toJSON = function () {
  return this.toObject();
};

module.exports = mongoose.model("site", siteSchema);
