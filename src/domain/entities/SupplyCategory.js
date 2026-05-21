// domain/entities/SupplyCategory.js

class SupplyCategory {
  constructor({
    id,
    nombre,
    descripcion = '',
    estado = true,
    createdAt,
    updatedAt,
  }) {
    this.id          = id;
    this.nombre      = nombre;
    this.descripcion = descripcion;
    this.estado      = estado;
    this.createdAt   = createdAt;
    this.updatedAt   = updatedAt;
  }

  estaActiva() {
    return this.estado === true;
  }

  toJSON() {
    return {
      id:          this.id,
      nombre:      this.nombre,
      descripcion: this.descripcion,
      estado:      this.estado,
      createdAt:   this.createdAt,
      updatedAt:   this.updatedAt,
    };
  }
}

module.exports = SupplyCategory;
