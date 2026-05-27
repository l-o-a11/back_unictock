// application/use-cases/supplyCategories/UpdateSupplyCategory.js

class UpdateSupplyCategory {
  constructor(supplyCategoryRepository) {
    this.supplyCategoryRepository = supplyCategoryRepository;
  }

  async execute(id, data) {
    const existing = await this.supplyCategoryRepository.findById(id);
    if (!existing) {
      const err = new Error('Categoría de insumo no encontrada');
      err.statusCode = 404;
      throw err;
    }

    const { nombre, descripcion, estado } = data;

    // Unicidad de nombre si cambia
    if (nombre && nombre.trim().toLowerCase() !== existing.nombre.toLowerCase()) {
      const byName = await this.supplyCategoryRepository.findByName(nombre.trim());
      if (byName && byName.id !== id) {
        const err = new Error(`Ya existe otra categoría con el nombre "${nombre.trim()}"`);
        err.statusCode = 409;
        throw err;
      }
    }

    const changes = {};
    if (nombre      != null) changes.nombre      = nombre.trim();
    if (descripcion != null) changes.descripcion = String(descripcion).trim();
    if (estado      != null) changes.estado      = Boolean(estado);

    const updated = await this.supplyCategoryRepository.update(id, changes);
    return updated.toJSON();
  }
}

module.exports = UpdateSupplyCategory;
