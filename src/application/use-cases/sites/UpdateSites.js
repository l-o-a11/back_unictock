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

    const { nombre, ciudad, barrio, direccion, telefono, estado } = data;

    // Validar unicidad de nombre si cambió
    if (nombre && nombre.trim() !== site.nombre) {
      const dup = await this.repo.findByName(nombre.trim());
      if (dup && dup.id !== id) {
        const err = new Error(`Ya existe una sede con el nombre "${nombre}"`);
        err.statusCode = 409;
        throw err;
      }
    }

    const changes = {};
    if (nombre    !== undefined) changes.nombre    = nombre.trim();
    if (ciudad    !== undefined) changes.ciudad    = ciudad.trim();
    if (barrio    !== undefined) changes.barrio    = barrio.trim();
    if (direccion !== undefined) changes.direccion = direccion.trim();
    if (telefono  !== undefined) changes.telefono  = String(telefono).trim();
    if (estado    !== undefined) changes.estado    = estado;

    return this.repo.update(id, changes);
  }
}

module.exports = UpdateSites;
