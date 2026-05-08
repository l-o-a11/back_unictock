
// application/use-cases/sites/DeleteSites.js

class DeleteSites {
  constructor(repo, productionRepository = null) {
    this.repo = repo;
    this.productionRepository = productionRepository;
  }

  async execute(id) {
    const site = await this.repo.findById(id);

    if (!site) {
      const err = new Error("Sitio no encontrado");
      err.statusCode = 404;
      throw err;
    }

    if (this.productionRepository) {
      const productionCount = await this.productionRepository.countBySiteId(id);
      if (productionCount > 0) {
        const err = new Error(
          "No se puede eliminar el sitio porque está asociado a una producción"
        );
        err.statusCode = 422;
        throw err;
      }
    }

    return this.repo.delete(id);
  }
}

module.exports = DeleteSites;
