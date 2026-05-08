// infrastructure/db/RoleModel.js

const mongoose = require("mongoose");

const permisoSchema = new mongoose.Schema(
    {
        modulo: {
            nombre: { type: String, required: true, trim: true },
        },
        privilegios: [
            {
               
                nombre: { type: String, required: true, trim: true }
            },
        ],
    },
    { _id: false }
);

const roleSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        descripcion: {
            type: String,
            required: true,
            trim: true
        },
        estado: {
            type: Boolean,
            default: true
        },
        permisos: {
            type: [permisoSchema],
            default: []
        },
    },
    { timestamps: true }
);

roleSchema.methods.toJSON = function () {
    const obj = this.toObject();
    return obj;
};

module.exports = mongoose.model("Role", roleSchema);
