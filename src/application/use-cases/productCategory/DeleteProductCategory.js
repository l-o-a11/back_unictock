// application/use-cases/productCategory/DeleteProductCategory.js

class DeleteProductCategory {
  constructor(categoryRepo, productRepo) {
    this.categoryRepo = categoryRepo;
    this.productRepo = productRepo;
  }

  async execute(id) {
    const category = await this.categoryRepo.findById(id);

    if (!category) {
      const err = new Error("Categoría no encontrada");
      err.statusCode = 404;
      throw err;
    }

    const products = await this.productRepo.findByCategoryId(id);

    if (products.length > 0) {
      const err = new Error(
        "No se puede eliminar porque tiene productos asociados"
      );
      err.statusCode = 422;
      throw err;
    }

    return this.categoryRepo.delete(id);
  }
}

module.exports = DeleteProductCategory;