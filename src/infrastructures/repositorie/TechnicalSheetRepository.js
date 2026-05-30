// src/infrastructures/repositorie/TechnicalSheetRepository.js
const mongoose             = require('mongoose');
const TechnicalSheetModel  = require('../db/TechnicalSheetModel');

class TechnicalSheetRepository {
  _toPlain(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
      id:           obj._id.toString(),
      id_producto:  obj.id_producto?.toString(),
      version:      obj.version ?? obj.versiones ?? 1,
      responsable:  obj.responsable ?? obj.client ?? obj.createdBy ?? null,
      fecha_inicio: obj.fecha_inicio ?? obj.date ?? null,
      fecha_fin:    obj.fecha_fin ?? null,
      descripciones: obj.descripciones ?? obj.descripcion ?? null,
      client:       obj.client ?? obj.responsable ?? obj.createdBy ?? "",
      ref:          obj.ref ?? obj.reference ?? "",
      type:         obj.type ?? obj.tipo ?? "",
      description:  obj.description ?? obj.descripcion ?? obj.descripciones ?? "",
      observations: obj.observations ?? obj.observaciones ?? "",
      createdBy:    obj.createdBy ?? obj.responsable ?? "",
      image:        obj.image ?? obj.imagen ?? null,
      fabrics:      obj.fabrics ?? [],
      cups:         obj.cups ?? [],
      closures:     obj.closures ?? [],
      accessories:  obj.accessories ?? [],
      measurements: obj.measurements ?? [],
      activo:       obj.activo,
      createdAt:    obj.createdAt,
      updatedAt:    obj.updatedAt,
    };
  }

  /** Devuelve todas las fichas técnicas de un producto.
   *  Retorna [] si el id_producto no es un ObjectId válido. */
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
    const doc = await TechnicalSheetModel.create(data);
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
