// application/use-cases/partiess/CreateParties.js

class CreateParties {
  constructor(partiesRepository) {
    this.partiesRepository = partiesRepository;
  }

  async execute(data) {
    const { codigo,
      nombre_de_empresa,
      nit,
      direccion,
      contacto_principal,
      telefono,
      correo,
      activo
    } = data;

    // Validación de campos requeridos
    if (!nit || !nombre_de_empresa || !contacto_principal || !direccion || !telefono || !correo) {
      const err = new Error('Los campos nit, nombre_de_empresa, contacto_principal, direccion, telefono y correo son obligatorios');
      err.statusCode = 400;
      throw err;
    }

    // Unicidad NIT
    const byNit = await this.partiesRepository.findByNit(nit.trim());
    if (byNit) {
      const err = new Error('Ya existe un terceros registrado con ese NIT');
      err.statusCode = 409;
      throw err;
    }

    // Unicidad correo
    const byEmail = await this.partiesRepository.findByEmail(correo.trim());
    if (byEmail) {
      const err = new Error('Ya existe un terceros registrado con ese correo electrónico');
      err.statusCode = 409;
      throw err;
    }

    const parties = await this.partiesRepository.create({
      codigo:              codigo.trim(),
      nombre_de_empresa:   nombre_de_empresa.trim(),
      nit:              nit.trim(),
      direccion:           direccion.trim(),
      contacto_principal: contacto_principal.trim(),
      telefono:            String(telefono).trim(),
      correo:              correo.trim().toLowerCase(),
      activo:              true,
    });

    return parties.toJSON();
  }
}

module.exports = CreateParties;
