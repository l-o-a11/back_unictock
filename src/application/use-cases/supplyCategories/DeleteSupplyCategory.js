// application/use-cases/supplyCategories/DeleteSupplyCategory.js

class DeleteSupplyCategory {
  constructor(supplyCategoryRepository, supplyRepository) {
    this.supplyCategoryRepository = supplyCategoryRepository;
    this.supplyRepository         = supplyRepository;
  }

  async execute(id) {
    const category = await this.supplyCategoryRepository.findById(id);
    if (!category) {
      const err = new Error('Categoría de insumo no encontrada');
      err.statusCode = 404;
      throw err;
    }

    // Bloquear si la categoría tiene insumos activos asignados
    const tieneInsumos = await this.supplyRepository.tieneInsumosPorCategoria(id);
    if (tieneInsumos) {
      const err = new Error(
        `"${category.nombre}" tiene insumos activos asociados y no puede ser eliminada. Inactívala en su lugar.`
      );
      err.statusCode = 422;
      throw err;
    }

    await this.supplyCategoryRepository.delete(id);
    return { deleted: true, id };
  }
}

module.exports = DeleteSupplyCategory;
