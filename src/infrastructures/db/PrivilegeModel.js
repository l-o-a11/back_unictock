// infrastructure/db/PrivilegeModel.js

const mongoose = require("mongoose");

const privilegeSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, lowercase: true },
        modulo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module',
            required: true
        },
        estado: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Índice compuesto para evitar duplicados por (modulo, nombre)
privilegeSchema.index({ modulo: 1, nombre: 1 }, { unique: true });

module.exports = mongoose.model("Privilege", privilegeSchema);
