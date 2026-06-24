// application/use-cases/products/UpdateProduct.js
class UpdateProduct {
  constructor(repo, categoryRepo) {
    this.repo         = repo;
    this.categoryRepo = categoryRepo;
  }

  async execute(id, data) {
    const product = await this.repo.findById(id);
    if (!product) {
      const err = new Error("Producto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    const updated = await this.repo.update(id, data);

    // ✅ Actualizar cantidad_productos con la diferencia de stock
    const oldStock     = Number(product.stock ?? 0);
    const newStock     = Number(data.stock ?? data.cantidad ?? oldStock);
    const stockDiff    = newStock - oldStock;
    const id_categoria = product.id_categorias ?? product.id_categoria ?? product.categoryId;

    if (this.categoryRepo && id_categoria && stockDiff !== 0) {
      try {
        const category = await this.categoryRepo.findById(id_categoria);
        if (category) {
          await this.categoryRepo.update(id_categoria, {
            cantidad_productos: Math.max(0, (category.cantidad_productos ?? 0) + stockDiff),
          });
        }
      } catch {
        // No bloquear la actualización si falla el update de categoría
      }
    }

    return updated;
  }
}

module.exports = UpdateProduct;