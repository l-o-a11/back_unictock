// application/use-cases/production/AnularProduction.js

class AnularProduction {
  constructor(productionRepository) {
    this.productionRepository = productionRepository;
  }

  async execute(id, motivo, id_usuario) {
    const production = await this.productionRepository.findById(id);
    if (!production) {
      const err = new Error('Orden de producción no encontrada');
      err.statusCode = 404;
      throw err;
    }
    if (production.estaAnulada()) {
      const err = new Error('La orden ya se encuentra anulada');
      err.statusCode = 422;
      throw err;
    }
    if (!motivo || !motivo.trim()) {
      const err = new Error('El motivo de anulación es obligatorio');
      err.statusCode = 400;
      throw err;
    }

    const updated = await this.productionRepository.anular(id, motivo.trim(), id_usuario);
    return updated.toJSON();
  }
}

module.exports = AnularProduction;
