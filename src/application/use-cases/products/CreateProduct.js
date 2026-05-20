// application/use-cases/products/CreateProduct.js

class CreateProduct {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(data) {
    const nombre = data.nombre ?? data.name;
    const referencia = data.referencia ?? data.reference;
    const precio = data.precio ?? data.price;
    const stock = data.stock;
    const id_categoria = data.id_categoria ?? data.id_categorias ?? data.categoryId;
    const imagenes_Url = data.imagenes_Url ?? data.imagenesUrl ?? [];

    if (!nombre || !referencia || precio === undefined || stock === undefined || !id_categoria) {
      const err = new Error('Campos obligatorios faltantes');
      err.statusCode = 400;
      throw err;
    }

    return this.repo.create({
      nombre,
      referencia,
      precio,
      stock,
      id_categoria,
      imagenes_Url,
      estado: true,
    });
  }
}

module.exports = CreateProduct;