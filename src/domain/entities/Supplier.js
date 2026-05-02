// domain/entities/Supplier.js

class Supplier {
  constructor({
    id,
    nit,
    nombre_de_empresa,
    nombre_del_contacto,
    direccion,
    telefono,
    correo,
    sitio_web = null,
    activo = true,
    createdAt,
    updatedAt,
  }) {
    this.id                  = id;
    this.nit                 = nit;
    this.nombre_de_empresa   = nombre_de_empresa;
    this.nombre_del_contacto = nombre_del_contacto;
    this.direccion           = direccion;
    this.telefono            = telefono;
    this.correo              = correo;
    this.sitio_web           = sitio_web;
    this.activo              = activo;
    this.createdAt           = createdAt;
    this.updatedAt           = updatedAt;
  }

  estaActivo() {
    return this.activo === true;
  }

  toJSON() {
    return {
      id:                  this.id,
      nit:                 this.nit,
      nombre_de_empresa:   this.nombre_de_empresa,
      nombre_del_contacto: this.nombre_del_contacto,
      direccion:           this.direccion,
      telefono:            this.telefono,
      correo:              this.correo,
      sitio_web:           this.sitio_web,
      activo:              this.activo,
      createdAt:           this.createdAt,
      updatedAt:           this.updatedAt,
    };
  }
}

module.exports = Supplier;
