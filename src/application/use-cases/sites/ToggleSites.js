// application/use-cases/sites/ToggleSites.js

class ToggleSites {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(id) {
    const site = await this.repo.findById(id);

    if (!site) {
      const err = new Error("Sitio no encontrado");
      err.statusCode = 404;
      throw err;
    }

    const updated = await this.repo.toggleEstado(id);

    return updated.toJSON();
  }
}

module.exports = ToggleSites;