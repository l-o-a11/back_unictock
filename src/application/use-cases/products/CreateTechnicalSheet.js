// src/application/use-cases/products/CreateTechnicalSheet.js
class CreateTechnicalSheet {
  constructor(technicalSheetRepository) {
    this.repo = technicalSheetRepository;
  }

  async execute(id_producto, data) {
    if (!id_producto) {
      const err = new Error('id_producto es requerido');
      err.statusCode = 400;
      throw err;
    }

    // Auto-incrementar versión si no se pasa
    const sheets = await this.repo.findByProductId(id_producto);
    const nextVersion = data.version ?? data.versiones ??
      (sheets.length > 0 ? Math.max(...sheets.map((s) => s.version ?? 1)) + 1 : 1);

    const responsable =
      data.responsable ??
      data.createdBy   ??
      data.client      ??
      'Sin responsable';

    return this.repo.create({
      id_producto,
      version:       nextVersion,
      responsable,
      createdBy:     data.createdBy     ?? responsable,
      fecha_inicio:  data.fecha_inicio  ?? data.date ?? new Date(),
      fecha_fin:     data.fecha_fin     ?? null,
      client:        data.client        ?? responsable,
      ref:           data.ref           ?? '',
      type:          data.type          ?? '',
      description:   data.description   ?? data.descripciones ?? data.descripcion ?? '',
      descripciones: data.descripciones ?? data.description   ?? data.descripcion ?? '',
      observations:  data.observations  ?? data.observaciones ?? '',
      image:         data.image         ?? null,
      fabrics:       data.fabrics       ?? [],
      cups:          data.cups          ?? [],
      closures:      data.closures      ?? [],
      accessories:   data.accessories   ?? [],
      measurements:  data.measurements  ?? [],
      activo:        data.activo        ?? true,
    });
  }
}

module.exports = CreateTechnicalSheet;