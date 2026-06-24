
// application/use-cases/roles/GetRoleById.js

class GetRoleById {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(id) {
    const role = await this.repo.findById(id);

    if (!role) {
      const err = new Error("Rol no encontrado");
      err.statusCode = 404;
      throw err;
    }

    return role;
  }
}

module.exports = GetRoleById;
