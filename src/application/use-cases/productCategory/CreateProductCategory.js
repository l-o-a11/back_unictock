// application/use-cases/productCategory/CreateProductCategory.js

class CreateProductCategory {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(data) {
    const { nombre, descripcion } = data;

    if (!nombre) {
      const err = new Error("El nombre es obligatorio");
      err.statusCode = 400;
      throw err;
    }

    const exists = await this.repo.findByName(nombre);
    if (exists) {
      const err = new Error("La categoría ya existe");
      err.statusCode = 409;
      throw err;
    }

    return this.repo.create({
      nombre: nombre.trim(),
      descripcion: descripcion || "",
    });
  }
}

module.exports = CreateProductCategory;