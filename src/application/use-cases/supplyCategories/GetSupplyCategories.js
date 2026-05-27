// application/use-cases/supplyCategories/GetSupplyCategories.js

class GetSupplyCategories {
  constructor(supplyCategoryRepository) {
    this.supplyCategoryRepository = supplyCategoryRepository;
  }

  /**
   * @param {Object} filters — Ver SupplyCategoryRepository.findAll para opciones
   * @returns {{ data, total, page, limit, totalPages }}
   */
  async execute(filters = {}) {
    const result = await this.supplyCategoryRepository.findAll(filters);
    return {
      ...result,
      data: result.data.map((c) => c.toJSON()),
    };
  }
}

module.exports = GetSupplyCategories;
