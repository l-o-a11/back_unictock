// domain/entities/Supply.js

class Supply {
  constructor({
    id,
    nombre,
    categoria,         // ObjectId ref a SupplyCategory
    stock     = 0,
    valor_medida,
    medida,
    imagenes_Url = [],
    estado    = true,
    propiedades = [],
    createdAt,
    updatedAt,
  }) {
    this.id           = id;
    this.nombre       = nombre;
    this.categoria    = categoria;
    this.stock        = stock;
    this.valor_medida = valor_medida;
    this.medida       = medida;
    this.imagenes_Url = imagenes_Url;
    this.estado       = estado;
    this.propiedades  = propiedades;
    this.createdAt    = createdAt;
    this.updatedAt    = updatedAt;
  }

  estaActivo() {
    return this.estado === true;
  }

  toJSON() {
    return {
      id:           this.id,
      nombre:       this.nombre,
      categoria:    this.categoria,
      stock:        this.stock,
      valor_medida: this.valor_medida,
      medida:       this.medida,
      imagenes_Url: this.imagenes_Url,
      estado:       this.estado,
      propiedades:  this.propiedades,
      createdAt:    this.createdAt,
      updatedAt:    this.updatedAt,
    };
  }
}

module.exports = Supply;
