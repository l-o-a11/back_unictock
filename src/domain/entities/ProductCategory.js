// domain/entities/ProductCategory.js

class ProductCategory {
  constructor({ 
    id, 
    nombre, 
    descripcion 
}) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
    };
  }
}

module.exports = ProductCategory;