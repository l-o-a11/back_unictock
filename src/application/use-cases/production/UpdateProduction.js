// application/use-cases/production/UpdateProduction.js

class UpdateProduction {
  constructor(productionRepository) {
    this.productionRepository = productionRepository;
  }

  async execute(id, data) {
    const existing = await this.productionRepository.findById(id);
    if (!existing) {
      const err = new Error('Orden de producción no encontrada');
      err.statusCode = 404;
      throw err;
    }
    if (existing.estaAnulada()) {
      const err = new Error('No se puede editar una orden anulada');
      err.statusCode = 422;
      throw err;
    }

    // Solo se permiten modificar datos de la orden, nunca el estado ni el historial
    const { estado, historial, motivo_anulacion, ...safeData } = data;

    const changes = {};
    if (safeData.fecha_entrega) changes.fecha_entrega = safeData.fecha_entrega;
    if (safeData.cliente)       changes.cliente       = safeData.cliente.trim();

    const updated = await this.productionRepository.update(id, changes);
    return updated.toJSON();
  }
}

module.exports = UpdateProduction;
