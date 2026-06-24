// application/use-cases/roles/DeleteRoles.js

let UserModel;
try { UserModel = require('../../../infrastructures/db/UserModel'); } catch (_) {}

class DeleteRoles {
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

    // Bloquear eliminación si hay usuarios activos con este rol
    if (UserModel) {
      const count = await UserModel.countDocuments({ rolId: id, estado: true });
      if (count > 0) {
        const err = new Error(
          `No se puede eliminar: ${count} usuario(s) activo(s) tienen asignado este rol`
        );
        err.statusCode = 422;
        throw err;
      }
    }

    await this.repo.delete(id);
    return { deleted: true, id };
  }
}

module.exports = DeleteRoles;
