// src/infrastructures/repositorie/TechnicalSheetRepository.js
const mongoose            = require('mongoose');
const TechnicalSheetModel = require('../db/TechnicalSheetModel');

class TechnicalSheetRepository {
  _toPlain(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
      id:            obj._id.toString(),
      id_producto:   obj.id_producto?.toString(),
      version:       obj.version       ?? 1,
      responsable:   obj.responsable   ?? obj.createdBy ?? obj.client ?? null,
      fecha_inicio:  obj.fecha_inicio  ?? null,
      fecha_fin:     obj.fecha_fin     ?? null,
      client:        obj.client        ?? obj.responsable ?? obj.createdBy ?? "",
      ref:           obj.ref           ?? "",
      type:          obj.type          ?? "",
      description:   obj.description   ?? obj.descripciones ?? "",
      descripciones: obj.descripciones ?? obj.description   ?? "",
      observations:  obj.observations  ?? "",
      createdBy:     obj.createdBy     ?? obj.responsable   ?? "",
      image:         obj.image         ?? null,
      fabrics:       obj.fabrics       ?? [],
      cups:          obj.cups          ?? [],
      closures:      obj.closures      ?? [],
      accessories:   obj.accessories   ?? [],
      measurements:  obj.measurements  ?? [],
      activo:        obj.activo,
      createdAt:     obj.createdAt,
      updatedAt:     obj.updatedAt,
    };
  }

  async findByProductId(id_producto) {
    if (!mongoose.isValidObjectId(id_producto)) return [];
    const docs = await TechnicalSheetModel
      .find({ id_producto })
      .sort({ version: -1 });
    return docs.map((d) => this._toPlain(d));
  }

  async findById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await TechnicalSheetModel.findById(id).catch(() => null);
    return this._toPlain(doc);
  }

  async create(data) {
    const responsable =
      data.responsable ??
      data.createdBy   ??
      data.client      ??
      'Sin responsable';

    const payload = {
      id_producto:   data.id_producto  ?? data.productId,
      version:       data.version      ?? data.versiones ?? 1,
      responsable,
      createdBy:     data.createdBy    ?? responsable,
      fecha_inicio:  data.fecha_inicio ?? data.date      ?? new Date(),
      fecha_fin:     data.fecha_fin    ?? null,
      client:        data.client       ?? responsable,
      ref:           data.ref          ?? data.reference ?? '',
      type:          data.type         ?? '',
      description:   data.description  ?? data.descripciones ?? data.descripcion ?? '',
      descripciones: data.descripciones ?? data.description  ?? data.descripcion ?? '',
      observations:  data.observations ?? data.observaciones ?? '',
      image:         data.image        ?? null,
      fabrics:       data.fabrics      ?? [],
      cups:          data.cups         ?? [],
      closures:      data.closures     ?? [],
      accessories:   data.accessories  ?? [],
      measurements:  data.measurements ?? [],
      activo:        data.activo       ?? true,
    };

    const doc = await TechnicalSheetModel.create(payload);
    return this._toPlain(doc);
  }

  async update(id, changes) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await TechnicalSheetModel
      .findByIdAndUpdate(id, changes, { new: true, runValidators: true })
      .catch(() => null);
    return this._toPlain(doc);
  }

  async delete(id) {
    if (!mongoose.isValidObjectId(id)) return false;
    const doc = await TechnicalSheetModel.findByIdAndDelete(id).catch(() => null);
    return !!doc;
  }
}

module.exports = TechnicalSheetRepository;