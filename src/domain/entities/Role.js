// domain/entities/Role.js

class Role {
  constructor({
    id,
    nombre,
    descripcion,
    estado = true,
    permisos = [],
    createdAt,
    updatedAt,
  }) {
    this.id                  = id;
    this.nombre              = nombre;
    this.descripcion         = descripcion;
    this.estado              = estado;
    this.permisos            = permisos;
    this.createdAt           = createdAt;
    this.updatedAt           = updatedAt;
  }

   /**
   * Alterna el estado del rol
   */
  toggleEstado() {
    this.estado = !this.estado;
  }

  toJSON() {
    return {
      id:                  this.id,
      nombre:              this.nombre,
      descripcion:         this.descripcion,
      estado:              this.estado,
      permisos:            this.permisos,
      createdAt:           this.createdAt,
      updatedAt:           this.updatedAt,
    };
  }
}

module.exports = Role;
