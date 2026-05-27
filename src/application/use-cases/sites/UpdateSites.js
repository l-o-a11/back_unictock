// application/use-cases/sites/UpdateSites.js

class UpdateSites {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(id, data) {
    const site = await this.repo.findById(id);

    if (!site) {
      const err = new Error("Sitio no encontrado");
      err.statusCode = 404;
      throw err;
    }

    return this.repo.update(id, data);
  }
}

module.exports = UpdateSites;
