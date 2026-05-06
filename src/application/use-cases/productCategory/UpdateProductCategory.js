// application/use-cases/productCategory/UpdateProductCategory.js

class UpdateProductCategory {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(id, data) {
    const category = await this.repo.findById(id);

    if (!category) {
      const err = new Error("Categoría no encontrada");
      err.statusCode = 404;
      throw err;
    }

    if (data.nombre && data.nombre !== category.nombre) {
      const exists = await this.repo.findByName(data.nombre);
      if (exists) {
        const err = new Error("Ya existe una categoría con ese nombre");
        err.statusCode = 409;
        throw err;
      }
    }

    return this.repo.update(id, data);
  }
}

module.exports = UpdateProductCategory;