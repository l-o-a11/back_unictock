// application/use-cases/production/CreateProduction.js

class CreateProduction {
  constructor(productionRepository) {
    this.productionRepository = productionRepository;
  }

  async execute(data, id_usuario) {
    const { fecha_entrega, cliente } = data;

    if (!fecha_entrega || !cliente) {
      const err = new Error('Los campos fecha_entrega y cliente son obligatorios');
      err.statusCode = 400;
      throw err;
    }

    if (!id_usuario) {
      const err = new Error('Se requiere autenticación para crear una orden');
      err.statusCode = 401;
      throw err;
    }

    const production = await this.productionRepository.create({
      fecha_entrega,
      cliente:    cliente.trim(),
      id_usuario,
      estado:     'Diseño',
      historial:  [{ estado: 'Diseño', fecha: new Date(), id_usuario, motivo: null }],
    });

    return production.toJSON();
  }
}

module.exports = CreateProduction;
