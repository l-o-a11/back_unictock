// domain/entities/Product.js

class Product {
  constructor({
    id,
    id_categorias,   // plural — alineado con el schema del modelo (era id_categoria singular)
    imagenes_Url = [],
    referencia,
    nombre,
    precio,
    stock,
    activo,
    estado = true,
    createdAt,
    updatedAt,
  }) {
    this.id           = id;
    this.id_categorias = id_categorias;
    this.imagenes_Url = imagenes_Url;
    this.referencia   = referencia;
    this.nombre       = nombre;
    this.precio       = precio;
    this.stock        = stock;
    this.activo       = activo;
    this.estado       = estado;
    this.createdAt    = createdAt;
    this.updatedAt    = updatedAt;
  }

  toggleEstado() {
    this.estado = !this.estado;
  }

  tieneStock() {
    return this.stock > 0;
  }

  toJSON() {
    return {
      id:            this.id,
      id_categorias: this.id_categorias,
      imagenes_Url:  this.imagenes_Url,
      referencia:    this.referencia,
      nombre:        this.nombre,
      precio:        this.precio,
      stock:         this.stock,
      activo:        this.activo,
      estado:        this.estado,
      createdAt:     this.createdAt,
      updatedAt:     this.updatedAt,
    };
  }
}

module.exports = Product;
