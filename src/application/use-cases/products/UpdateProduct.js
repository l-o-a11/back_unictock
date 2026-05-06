// application/use-cases/products/UpdateProduct.js

class UpdateProduct {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(id, data) {
    const product = await this.repo.findById(id);

    if (!product) {
      const err = new Error("Producto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    return this.repo.update(id, data);
  }
}

module.exports = UpdateProduct;