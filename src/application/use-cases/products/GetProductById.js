// application/use-cases/products/GetProductById.js

class GetProductById {
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

    return product;
  }
}

module.exports = GetProductById;