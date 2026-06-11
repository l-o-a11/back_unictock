// application/use-cases/products/CreateProduct.js
class CreateProduct {
  constructor(repo, categoryRepo) {
    this.repo         = repo;
    this.categoryRepo = categoryRepo;
  }

  async execute(data) {
    const nombre       = data.nombre    ?? data.name;
    const referencia   = data.referencia ?? data.reference;
    const precio       = data.precio    ?? data.price;
    const stock        = data.stock;
    const id_categoria = data.id_categoria ?? data.id_categorias ?? data.categoryId;
    const imagenes_Url = data.imagenes_Url ?? data.imagenesUrl ?? [];

    if (!nombre || !referencia || precio === undefined || stock === undefined || !id_categoria) {
      const err = new Error('Campos obligatorios faltantes');
      err.statusCode = 400;
      throw err;
    }

    const product = await this.repo.create({
      nombre,
      referencia,
      precio,
      stock,
      id_categoria,
      imagenes_Url,
      estado: true,
    });

    // ✅ Sumar el stock del nuevo producto a cantidad_productos de la categoría
    if (this.categoryRepo && id_categoria) {
      try {
        const category = await this.categoryRepo.findById(id_categoria);
        if (category) {
          await this.categoryRepo.update(id_categoria, {
            cantidad_productos: (category.cantidad_productos ?? 0) + Number(stock),
          });
        }
      } catch {
        // No bloquear la creación si falla el update de categoría
      }
    }

    return product;
  }
}

module.exports = CreateProduct;