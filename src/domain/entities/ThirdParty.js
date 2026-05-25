// domain/entities/ThirdParty.js

class ThirdParty {
  constructor({
    id,
    codigo,
    nit            = null,
    nombre_empresa,
    nombre_contacto,
    direccion,
    telefono,
    correo_empresa  = null,
    correo_contacto = null,
    sitio_web       = null,
    estado          = true,
    producciones    = [],
    createdAt,
    updatedAt,
  }) {
    this.id              = id;
    this.codigo          = codigo;
    this.nit             = nit;
    this.nombre_empresa  = nombre_empresa;
    this.nombre_contacto = nombre_contacto;
    this.direccion       = direccion;
    this.telefono        = telefono;
    this.correo_empresa  = correo_empresa;
    this.correo_contacto = correo_contacto;
    this.sitio_web       = sitio_web;
    this.estado          = estado;
    this.producciones    = producciones;
    this.createdAt       = createdAt;
    this.updatedAt       = updatedAt;
  }

  estaActivo()  { return this.estado === true; }
  tieneOrden()  { return this.producciones.length > 0; }

  toJSON() {
    return {
      id:              this.id,
      codigo:          this.codigo,
      nit:             this.nit,
      nombre_empresa:  this.nombre_empresa,
      nombre_contacto: this.nombre_contacto,
      direccion:       this.direccion,
      telefono:        this.telefono,
      correo_empresa:  this.correo_empresa,
      correo_contacto: this.correo_contacto,
      sitio_web:       this.sitio_web,
      estado:          this.estado,
      producciones:    this.producciones,
      createdAt:       this.createdAt,
      updatedAt:       this.updatedAt,
    };
  }
}

module.exports = ThirdParty;
