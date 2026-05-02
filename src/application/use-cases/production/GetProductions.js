// application/use-cases/production/GetProductions.js

class GetProductions {
  constructor(productionRepository) {
    this.productionRepository = productionRepository;
  }

  /**
   * @param {Object} filters — search, estado, id_usuario, fecha_desde, fecha_hasta,
   *                           page, limit, sortBy, order
   */
  async execute(filters = {}) {
    const result = await this.productionRepository.findAll(filters);
    return {
      ...result,
      data: result.data.map((p) => p.toJSON()),
    };
  }
}

module.exports = GetProductions;
