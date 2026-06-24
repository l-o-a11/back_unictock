// application/use-cases/thirdParties/UpdateThirdParty.js

class UpdateThirdParty {
  constructor(repo) { this.repo = repo; }

  async execute(id, changes) {
    const tercero = await this.repo.findById(id);
    if (!tercero) {
      const err = new Error('Tercero no encontrado');
      err.statusCode = 404;
      throw err;
    }

    // Validar teléfono si viene en el update
    if (changes.telefono !== undefined) {
      if (!/^\d{7,15}$/.test(String(changes.telefono).replace(/\s/g, ''))) {
        const err = new Error('El teléfono debe contener entre 7 y 15 dígitos');
        err.statusCode = 400;
        throw err;
      }
    }

    // Si el NIT cambia, verificar que no esté en uso por otro documento
    if (changes.nit && changes.nit !== tercero.nit) {
      const exists = await this.repo.findByNit(changes.nit);
      if (exists && exists.id !== id) {
        const err = new Error(`El NIT '${changes.nit}' ya está en uso`);
        err.statusCode = 409;
        throw err;
      }
    }

    // Trim en campos de texto
    ['nombre_empresa', 'nombre_contacto', 'direccion'].forEach(k => {
      if (changes[k]) changes[k] = changes[k].trim();
    });

    return this.repo.update(id, changes);
  }
}

module.exports = UpdateThirdParty;
