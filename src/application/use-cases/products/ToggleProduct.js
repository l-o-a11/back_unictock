// application/use-cases/products/ToggleProduct.js

class ToggleProduct {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(id) {
    const product = await this.repo.findById(id);

    if (!product) {
      const err = new Error("Producto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    const updated = await this.repo.toggleActivo(id);

    return updated.toJSON();
  }
}

module.exports = ToggleProduct;