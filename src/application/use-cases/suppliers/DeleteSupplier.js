// application/use-cases/suppliers/DeleteSupplier.js

class DeleteSupplier {
  constructor(supplierRepository, PurchaseModel = null) {
    this.supplierRepository = supplierRepository;
    this.PurchaseModel      = PurchaseModel; // opcional: bloquea si hay compras
  }

  async execute(id) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      const err = new Error('Proveedor no encontrado');
      err.statusCode = 404;
      throw err;
    }

    // Bloquear eliminación si el proveedor tiene compras asociadas
    const tieneCompras = await this.supplierRepository.tieneCompras(id, this.PurchaseModel);
    if (tieneCompras) {
      const err = new Error(
        `"${supplier.nombre_de_empresa}" tiene compras asociadas y no puede ser eliminado. Inactívalo en su lugar.`,
      );
      err.statusCode = 422;
      throw err;
    }

    await this.supplierRepository.delete(id);
    return { deleted: true, id };
  }
}

module.exports = DeleteSupplier;
