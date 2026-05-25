
// application/use-cases/sites/GetSitesById.js

class GetSitesById {
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

    return site;
  }
}

module.exports = GetSitesById;
