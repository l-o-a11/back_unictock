// application/use-cases/supplies/GetSupplyById.js

class GetSupplyById {
  constructor(supplyRepository) {
    this.supplyRepository = supplyRepository;
  }

  async execute(id) {
    const supply = await this.supplyRepository.findById(id);
    if (!supply) {
      const err = new Error('Insumo no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return supply.toJSON();
  }
}

module.exports = GetSupplyById;
