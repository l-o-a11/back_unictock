// application/use-cases/supplyCategories/GetSupplyCategoryById.js

class GetSupplyCategoryById {
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
    return category.toJSON();
  }
}

module.exports = GetSupplyCategoryById;
