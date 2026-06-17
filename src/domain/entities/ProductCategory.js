class ProductCategory {
  constructor({ 
    id,
    nombre,
    descripcion,
    cantidad_productos,
    productos_disponibles,
    estado,
    createdAt,
    updatedAt,
  }) {
    this.id                    = id;
    this.nombre                = nombre;
    this.descripcion           = descripcion          ?? "";
    this.cantidad_productos    = cantidad_productos    ?? 0;
    this.productos_disponibles = productos_disponibles ?? 0;
    this.estado                = estado               ?? true;
    this.createdAt             = createdAt;
    this.updatedAt             = updatedAt;
  }

  toJSON() {
    return {
      id:                    this.id,
      nombre:                this.nombre,
      descripcion:           this.descripcion,
      cantidad_productos:    this.cantidad_productos,
      productos_disponibles: this.productos_disponibles,
      estado:                this.estado,
      createdAt:             this.createdAt,
      updatedAt:             this.updatedAt,
    };
  }
}

module.exports = ProductCategory;