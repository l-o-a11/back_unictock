class Product {
  constructor({
    id,
    id_categoria,
    imagenes_Url = [],
    referencia,
    nombre,
    precio,
    stock,
    estado = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.id_categoria = id_categoria;
    this.imagenes_Url = imagenes_Url;
    this.referencia = referencia;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.estado = estado;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Alterna el estado del producto
   */
  toggleEstado() {
    this.estado = !this.estado;
  }

  /**
   * Valida si el producto tiene stock disponible
   */
  tieneStock() {
    return this.stock > 0;
  }

  /**
   * Representación pública (por si luego quieres ocultar cosas)
   */
  toJSON() {
    return {
      id: this.id,
      id_categoria: this.id_categoria,
      imagenes_Url: this.imagenes_Url,
      referencia: this.referencia,
      nombre: this.nombre,
      precio: this.precio,
      stock: this.stock,
      estado: this.estado,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Product;
