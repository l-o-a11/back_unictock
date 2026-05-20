
// application/use-cases/roles/GetRoles.js

class GetRoles {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(query) {
    return this.repo.findAll(query);
  }
}

module.exports = GetRoles;
