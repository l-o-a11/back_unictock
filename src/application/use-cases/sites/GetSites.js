
// application/use-cases/sites/GetSites.js

class GetSites {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(query) {
    return this.repo.findAll(query);
  }
}

module.exports = GetSites;
