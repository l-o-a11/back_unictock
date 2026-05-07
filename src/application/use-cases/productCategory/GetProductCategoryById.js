// application/use-cases/productCategory/GetProductCategoryById.js

class GetProductCategoryById {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(id) {
    const category = await this.repo.findById(id);

    if (!category) {
      const err = new Error("Categoría no encontrada");
      err.statusCode = 404;
      throw err;
    }

    return category;
  }
}

module.exports = GetProductCategoryById;