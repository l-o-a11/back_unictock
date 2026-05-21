// application/use-cases/supplies/DeleteSupply.js

class DeleteSupply {
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

    await this.supplyRepository.delete(id);
    return { deleted: true, id };
  }
}

module.exports = DeleteSupply;
