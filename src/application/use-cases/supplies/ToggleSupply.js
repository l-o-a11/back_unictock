// application/use-cases/supplies/ToggleSupply.js

class ToggleSupply {
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

    const updated = await this.supplyRepository.toggleEstado(id);
    return updated.toJSON();
  }
}

module.exports = ToggleSupply;
