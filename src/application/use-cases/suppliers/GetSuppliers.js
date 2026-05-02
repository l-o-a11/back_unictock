// application/use-cases/suppliers/GetSuppliers.js

class GetSuppliers {
  constructor(supplierRepository) {
    this.supplierRepository = supplierRepository;
  }

  /**
   * @param {Object} filters - Ver SupplierRepository.findAll para opciones completas
   * @returns {{ data, total, page, limit, totalPages }}
   */
  async execute(filters = {}) {
    const result = await this.supplierRepository.findAll(filters);
    return {
      ...result,
      data: result.data.map((s) => s.toJSON()),
    };
  }
}

module.exports = GetSuppliers;
