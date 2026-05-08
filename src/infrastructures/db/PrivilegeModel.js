// infrastructure/db/PrivilegeModel.js

const mongoose = require("mongoose");

const privilegeSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            lowercase: true
        },
        modulo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true
        },
        estado: {
            type: Boolean,
            default: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Privilege", privilegeSchema);
