// application/use-cases/roles/ToggleRoles.js

class ToggleRoles {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(id) {
    const role = await this.repo.findById(id);
    if (!role) {
      const err = new Error('Rol no encontrado');
      err.statusCode = 404;
      throw err;
    }

    const updated = await this.repo.toggleEstado(id);
    // Devolver como plain object — la entidad Role tiene toJSON()
    return typeof updated.toJSON === 'function' ? updated.toJSON() : updated;
  }
}

module.exports = ToggleRoles;
