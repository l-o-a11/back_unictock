// application/use-cases/suppliers/UpdateSupplier.js

class UpdateSupplier {
  constructor(supplierRepository) {
    this.supplierRepository = supplierRepository;
  }

  async execute(id, data) {
    const existing = await this.supplierRepository.findById(id);
    if (!existing) {
      const err = new Error('Proveedor no encontrado');
      err.statusCode = 404;
      throw err;
    }

    const {
      nit,
      nombre_de_empresa,
      nombre_del_contacto,
      direccion,
      telefono,
      correo,
      sitio_web,
      activo,
    } = data;

    // Unicidad de NIT (excluye el actual)
    if (nit && nit.trim() !== String(existing.nit)) {
      const byNit = await this.supplierRepository.findByNit(nit.trim());
      if (byNit && byNit.id !== id) {
        const err = new Error('Ya existe otro proveedor con ese NIT');
        err.statusCode = 409;
        throw err;
      }
    }

    // Unicidad de correo (excluye el actual)
    if (correo && correo.trim().toLowerCase() !== existing.correo) {
      const byEmail = await this.supplierRepository.findByEmail(correo.trim());
      if (byEmail && byEmail.id !== id) {
        const err = new Error('Ya existe otro proveedor con ese correo electrónico');
        err.statusCode = 409;
        throw err;
      }
    }

    const changes = {};
    if (nit                 != null) changes.nit                 = nit.trim();
    if (nombre_de_empresa   != null) changes.nombre_de_empresa   = nombre_de_empresa.trim();
    if (nombre_del_contacto != null) changes.nombre_del_contacto = nombre_del_contacto.trim();
    if (direccion           != null) changes.direccion           = direccion.trim();
    if (telefono            != null) changes.telefono            = String(telefono).trim();
    if (correo              != null) changes.correo              = correo.trim().toLowerCase();
    if (sitio_web           != null) changes.sitio_web           = sitio_web.trim() || null;
    if (activo              != null) changes.activo              = Boolean(activo);

    const updated = await this.supplierRepository.update(id, changes);
    return updated.toJSON();
  }
}

module.exports = UpdateSupplier;
