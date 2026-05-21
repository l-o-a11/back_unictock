// application/use-cases/roles/CreateRoles.js

const { validatePermissions } = require('../../../shared/utils/rolePermissionValidator');

class CreateRoles {
  constructor(repo, moduleRepo, privilegeRepo) {
    this.repo          = repo;
    this.moduleRepo    = moduleRepo;
    this.privilegeRepo = privilegeRepo;
  }

  async execute(data) {
    const { nombre, descripcion, estado = true, permisos = [] } = data;

    if (!nombre?.trim()) {
      const err = new Error("El nombre del rol es obligatorio");
      err.statusCode = 400;
      throw err;
    }
    if (!descripcion?.trim()) {
      const err = new Error("La descripción del rol es obligatoria");
      err.statusCode = 400;
      throw err;
    }

    const existing = await this.repo.findByName(nombre.trim());
    if (existing) {
      const err = new Error(`Ya existe un rol con el nombre "${nombre}"`);
      err.statusCode = 409;
      throw err;
    }

    const permisosValidados = await validatePermissions(
      permisos,
      this.moduleRepo,
      this.privilegeRepo
    );

    return this.repo.create({
      nombre:      nombre.trim(),
      descripcion: descripcion.trim(),
      estado,
      permisos:    permisosValidados,
    });
  }
}

module.exports = CreateRoles;
