// application/use-cases/suppliers/ToggleSupplier.js

class ToggleSupplier {
  constructor(supplierRepository) {
    this.supplierRepository = supplierRepository;
  }

  async execute(id) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      const err = new Error('Proveedor no encontrado');
      err.statusCode = 404;
      throw err;
    }

    const updated = await this.supplierRepository.toggleActivo(id);
    return updated.toJSON();
  }
}

module.exports = ToggleSupplier;
