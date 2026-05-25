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

    // Usar == null cubre tanto null como undefined, y permite precio/stock = 0
    if (!nombre || !referencia || precio == null || stock == null || !id_categorias) {
      const missing = [];
      if (!nombre)       missing.push('nombre');
      if (!referencia)   missing.push('referencia');
      if (precio == null) missing.push('precio');
      if (stock == null)  missing.push('stock');
      if (!id_categorias) missing.push('id_categorias');
      const err = new Error(`Campos obligatorios faltantes: ${missing.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    return this.repo.create({
      nombre,
      referencia,
      precio:      Number(precio),
      stock:       Number(stock),
      id_categorias: String(id_categorias),
      imagenes_Url:  Array.isArray(imagenes_Url) ? imagenes_Url : [],
      activo: true,
    });
  }
}


module.exports = CreateProduct;


