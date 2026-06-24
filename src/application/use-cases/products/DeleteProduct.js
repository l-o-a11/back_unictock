
// application/use-cases/products/DeleteProduct.js

class DeleteProduct {
  constructor(repo, technicalSheetRepo) {
    this.repo = repo;
    this.technicalSheetRepo = technicalSheetRepo;
  }

  async execute(id) {
    const product = await this.repo.findById(id);

    if (!product) {
      const err = new Error("Producto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    if (this.technicalSheetRepo) {
      const sheets = await this.technicalSheetRepo.findByProductId(id);
      if (sheets && sheets.length > 0) {
        const err = new Error(
          "No se puede eliminar porque tiene fichas técnicas asociadas"
        );
        err.statusCode = 422;
        throw err;
      }
    }

    return this.repo.delete(id);
  }
}

module.exports = DeleteProduct;
