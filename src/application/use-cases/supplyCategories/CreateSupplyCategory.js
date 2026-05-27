// application/use-cases/supplyCategories/CreateSupplyCategory.js

class CreateSupplyCategory {
  constructor(supplyCategoryRepository) {
    this.supplyCategoryRepository = supplyCategoryRepository;
  }

  async execute(data) {
    const { nombre, descripcion = '' } = data;

    if (!nombre || !String(nombre).trim()) {
      const err = new Error('El nombre de la categoría es obligatorio');
      err.statusCode = 400;
      throw err;
    }

    // Unicidad de nombre (case-insensitive, usa regex en el repo)
    const existing = await this.supplyCategoryRepository.findByName(nombre.trim());
    if (existing) {
      const err = new Error(`Ya existe una categoría con el nombre "${nombre.trim()}"`);
      err.statusCode = 409;
      throw err;
    }

    const category = await this.supplyCategoryRepository.create({
      nombre:      nombre.trim(),
      descripcion: descripcion ? String(descripcion).trim() : '',
      estado:      true,
    });

    return category.toJSON();
  }
}

module.exports = CreateSupplyCategory;
