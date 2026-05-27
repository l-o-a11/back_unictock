// application/use-cases/supplyCategories/ToggleSupplyCategory.js

class ToggleSupplyCategory {
  constructor(supplyCategoryRepository) {
    this.supplyCategoryRepository = supplyCategoryRepository;
  }

  async execute(id) {
    const category = await this.supplyCategoryRepository.findById(id);
    if (!category) {
      const err = new Error('Categoría de insumo no encontrada');
      err.statusCode = 404;
      throw err;
    }

    const updated = await this.supplyCategoryRepository.toggleEstado(id);
    return updated.toJSON();
  }
}

module.exports = ToggleSupplyCategory;
