// application/use-cases/suppliers/CreateSupplier.js

class CreateSupplier {
  constructor(supplierRepository) {
    this.supplierRepository = supplierRepository;
  }

  async execute(data) {
    const { nit,
      nombre_de_empresa,
      nombre_del_contacto,
      direccion,
      telefono,
      correo,
      sitio_web,
      activo
    } = data;

    // Validación de campos requeridos
    if (!nit || !nombre_de_empresa || !nombre_del_contacto || !direccion || !telefono || !correo) {
      const err = new Error('Los campos nit, nombre_de_empresa, nombre_del_contacto, direccion, telefono y correo son obligatorios');
      err.statusCode = 400;
      throw err;
    }

    // Unicidad NIT
    const byNit = await this.supplierRepository.findByNit(nit.trim());
    if (byNit) {
      const err = new Error('Ya existe un proveedor registrado con ese NIT');
      err.statusCode = 409;
      throw err;
    }

    // Unicidad correo
    const byEmail = await this.supplierRepository.findByEmail(correo.trim());
    if (byEmail) {
      const err = new Error('Ya existe un proveedor registrado con ese correo electrónico');
      err.statusCode = 409;
      throw err;
    }

    const supplier = await this.supplierRepository.create({
      nit:                 nit.trim(),
      nombre_de_empresa:   nombre_de_empresa.trim(),
      nombre_del_contacto: nombre_del_contacto.trim(),
      direccion:           direccion.trim(),
      telefono:            String(telefono).trim(),
      correo:              correo.trim().toLowerCase(),
      sitio_web:           sitio_web ? sitio_web.trim() : null,
      activo:              true,
    });

    return supplier.toJSON();
  }
}

module.exports = CreateSupplier;
