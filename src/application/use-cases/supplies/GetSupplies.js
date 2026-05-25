// application/use-cases/supplies/GetSupplies.js

class GetSupplies {
  constructor(supplyRepository) {
    this.supplyRepository = supplyRepository;
  }

  /**
   * @param {Object} filters — Ver SupplyRepository.findAll para opciones completas
   * @returns {{ data, total, page, limit, totalPages }}
   */
  async execute(filters = {}) {
    const result = await this.supplyRepository.findAll(filters);
    return {
      ...result,
      data: result.data.map((s) => s.toJSON()),
    };
  }
}

module.exports = GetSupplies;
