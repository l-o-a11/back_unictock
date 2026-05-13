// src/application/use-cases/products/CreateTechnicalSheet.js
class CreateTechnicalSheet {
  constructor(technicalSheetRepository) {
    this.repo = technicalSheetRepository;
  }

  async execute(id_producto, data) {
    const { responsable, fecha_inicio, fecha_fin, version, descripcion } = data;

    if (!responsable || !fecha_inicio) {
      const err = new Error('Los campos responsable y fecha_inicio son obligatorios');
      err.statusCode = 400;
      throw err;
    }

    // Auto-incrementar versión si no se pasa
    const sheets = await this.repo.findByProductId(id_producto);
    const nextVersion = version ?? (sheets.length > 0 ? Math.max(...sheets.map((s) => s.version)) + 1 : 1);

    return this.repo.create({
      id_producto,
      version: nextVersion,
      responsable: responsable.trim(),
      fecha_inicio,
      fecha_fin: fecha_fin ?? null,
      descripcion: descripcion?.trim() ?? null,
      activo: true,
    });
  }
}

module.exports = CreateTechnicalSheet;
