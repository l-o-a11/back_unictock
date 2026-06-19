// infrastructure/db/ProductModel.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // CATEGORIA
    // Acepta tanto ID numérico (1,2,3) como ObjectId de MongoDB
    // Guardado como String para flexibilidad
    id_categorias: { type: String, default: null },

    // IMÁGENES - COMPATIBILIDAD ANTERIOR
    // Array de URLs de imágenes (fallback para datos antiguos)
    imagenes_Url: { type: [String], default: [] },

    // IMÁGENES CON CLOUDINARY
    // Array detallado con URLs, public_id, metadatos
    allImages: [
      {
        src: String,        // URL pública de Cloudinary: "https://res.cloudinary.com/.../..."
        public_id: String,  // ID único en Cloudinary: "unistock/products/image-123"
        label: String,      // Descripción: "Imagen principal", "Imagen frontal", etc.
        filename: String,   // Nombre original: "producto.jpg"
        size: Number,       // Tamaño en bytes: 45234
        _id: false          // No crear _id para subdocumentos
      }
    ],

    // DATOS DEL PRODUCTO
    referencia: { 
      type: String, 
      required: true, 
      unique: true 
    },
    
    nombre: { 
      type: String, 
      required: true 
    },
    
    precio: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    
    stock: { 
      type: Number, 
      required: true, 
      min: 0 
    },

    // ESTADOS
    activo: { 
      type: Boolean, 
      default: true 
    },
    
    estado: { 
      type: Boolean, 
      default: true 
    },

    // FICHA TÉCNICA 
    // Si ya tienes esto en otro lado, ignora este campo
    ficha_tecnica: {
      cliente: String,
      fecha: Date,
      ref: String,
      tipo_prenda: String,
      descripcion: String,
      observaciones: String,
      elaborado_por: String,
      // Arrays de materiales
      telas: [
        {
          nombre: String,
          consumo: String,
          piezas: String,
          _id: false
        }
      ],
      // etc...
      _id: false
    }
  },
  { timestamps: true }
);

// ÍNDICES PARA BÚSQUEDA RÁPIDA
productSchema.index({ referencia: 1 });
productSchema.index({ nombre: 1 });
productSchema.index({ id_categorias: 1 });
productSchema.index({ activo: 1 });

module.exports = mongoose.model("Product", productSchema);