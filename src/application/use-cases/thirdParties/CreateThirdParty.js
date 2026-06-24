// application/use-cases/thirdParties/CreateThirdParty.js

class CreateThirdParty {
  constructor(repo) { this.repo = repo; }

  async execute(data) {
    const { nombre_empresa, nombre_contacto, direccion, telefono, nit } = data;

    // Campos obligatorios
    const missing = [];
    if (!nombre_empresa)  missing.push('nombre_empresa');
    if (!nombre_contacto) missing.push('nombre_contacto');
    if (!direccion)       missing.push('direccion');
    if (!telefono)        missing.push('telefono');

    if (missing.length) {
      const err = new Error(`Campos obligatorios faltantes: ${missing.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    // Validar teléfono: solo dígitos, 7-15 caracteres
    if (!/^\d{7,15}$/.test(String(telefono).replace(/\s/g, ''))) {
      const err = new Error('El teléfono debe contener entre 7 y 15 dígitos');
      err.statusCode = 400;
      throw err;
    }

    // NIT único si se provee
    if (nit) {
      const exists = await this.repo.findByNit(nit);
      if (exists) {
        const err = new Error(`El NIT '${nit}' ya está registrado`);
        err.statusCode = 409;
        throw err;
      }
    }

    return this.repo.create({
      nit:             nit   || null,
      nombre_empresa:  nombre_empresa.trim(),
      nombre_contacto: nombre_contacto.trim(),
      direccion:       direccion.trim(),
      telefono:        String(telefono).trim(),
      correo_empresa:  data.correo_empresa  || null,
      correo_contacto: data.correo_contacto || null,
      sitio_web:       data.sitio_web       || null,
      estado:          true,
    });
  }
}

module.exports = CreateThirdParty;
