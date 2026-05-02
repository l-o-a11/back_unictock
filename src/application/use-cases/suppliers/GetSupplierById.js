// application/use-cases/suppliers/GetSupplierById.js

class GetSupplierById {
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
    return supplier.toJSON();
  }
}

module.exports = GetSupplierById;
