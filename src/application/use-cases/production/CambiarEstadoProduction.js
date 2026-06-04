// application/use-cases/production/CambiarEstadoProduction.js
const Production = require('../../../domain/entities/Production');

class CambiarEstadoProduction {
  constructor(productionRepository) {
    this.productionRepository = productionRepository;
  }

  async execute(id, nuevoEstado, id_usuario, user, options = {}) {
    if (!Production.ESTADOS_VALIDOS.includes(nuevoEstado)) {
      const err = new Error(
        `Estado inválido. Los estados permitidos son: ${Production.ESTADOS_VALIDOS.join(', ')}`,
      );
      err.statusCode = 400;
      throw err;
    }
    if (nuevoEstado === 'Anulada') {
      const err = new Error('Para anular una orden usa PATCH /produccion/ordenes/:id/anular');
      err.statusCode = 422;
      throw err;
    }

    const production = await this.productionRepository.findById(id);
    if (!production) {
      const err = new Error('Orden de producción no encontrada');
      err.statusCode = 404;
      throw err;
    }
    if (production.estaAnulada()) {
      const err = new Error('No se puede cambiar el estado de una orden anulada');
      err.statusCode = 422;
      throw err;
    }
    const force = options.force === true;
    if (!force) {
      const currentIdx = Production.ESTADOS_VALIDOS.indexOf(production.estado);
      const nextIdx = Production.ESTADOS_VALIDOS.indexOf(nuevoEstado);
      if (!(nextIdx > currentIdx)) {
        const err = new Error('No se puede retroceder el estado sin autorización');
        err.statusCode = 422;
        throw err;
      }
    }

    const updated = await this.productionRepository.cambiarEstado(id, nuevoEstado, id_usuario, user, options.extra || {});
    return updated.toJSON();
  }
}

module.exports = CambiarEstadoProduction;
