// application/use-cases/products/CreateProduct.js

class CreateProduct {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(data) {
    const {
      nombre,
      referencia,
      precio,
      stock,
      id_categorias,
      imagenes_Url,
    } = data;

    if (!nombre || !referencia || !precio || !stock || !id_categorias) {
      const err = new Error("Campos obligatorios faltantes");
      err.statusCode = 400;
      throw err;
    }

    return this.repo.create({
      nombre,
      referencia,
      precio,
      stock,
      id_categorias,
      imagenes_Url,
      activo: true,
    });
  }
}


module.exports = CreateProduct;


