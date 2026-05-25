// application/use-cases/thirdParties/DeleteThirdParty.js

class DeleteThirdParty {
  constructor(repo) { this.repo = repo; }

  async execute(id) {
    const tercero = await this.repo.findById(id);
    if (!tercero) {
      const err = new Error('Tercero no encontrado');
      err.statusCode = 404;
      throw err;
    }

    const tieneOrden = await this.repo.tieneProduccion(id);
    if (tieneOrden) {
      const err = new Error('No se puede eliminar: el tercero tiene órdenes de producción asignadas');
      err.statusCode = 422;
      throw err;
    }

    return this.repo.delete(id);
  }
}

module.exports = DeleteThirdParty;
