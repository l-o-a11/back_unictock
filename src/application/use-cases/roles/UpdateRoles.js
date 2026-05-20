// application/use-cases/roles/UpdateRoles.js

class UpdateRoles {
  constructor(repo, moduleRepo, privilegeRepo) {
    this.repo          = repo;
    this.moduleRepo    = moduleRepo;
    this.privilegeRepo = privilegeRepo;
  }

  async execute(id, data) {
    const role = await this.repo.findById(id);
    if (!role) {
      const err = new Error('Rol no encontrado');
      err.statusCode = 404;
      throw err;
    }

    const changes = {};

    if (data.nombre !== undefined) {
      const trimmed = data.nombre.trim();
      if (!trimmed) {
        const err = new Error('El nombre no puede estar vacío');
        err.statusCode = 400;
        throw err;
      }
      // Verificar duplicado solo si cambió
      if (trimmed !== role.nombre) {
        const existing = await this.repo.findByName(trimmed);
        if (existing && existing.id !== id) {
          const err = new Error(`Ya existe un rol con el nombre "${trimmed}"`);
          err.statusCode = 409;
          throw err;
        }
      }
      changes.nombre = trimmed;
    }

    if (data.descripcion !== undefined) changes.descripcion = data.descripcion.trim();
    if (data.estado      !== undefined) changes.estado      = data.estado;

    if (data.permisos !== undefined) {
      changes.permisos = await this._validarPermisos(data.permisos);
    }

    return this.repo.update(id, changes);
  }

  async _validarPermisos(permisos) {
    // Reutilizar la misma lógica de CreateRoles
    const CreateRoles = require('./CreateRoles');
    const tmp = new CreateRoles(this.repo, this.moduleRepo, this.privilegeRepo);
    return tmp._validarPermisos(permisos);
  }
}

module.exports = UpdateRoles;
