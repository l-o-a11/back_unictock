// src/infrastructures/repositorie/MaterialTechnicalSpecificationsRepository.js
const mongoose = require('mongoose');
const MaterialTechnicalSpecificationsModel = require('../db/MaterialTechnicalSpecificationsModel');

class MaterialTechnicalSpecificationsRepository {
  _toPlain(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
      id: obj._id.toString(),
      id_materiales: obj.id_materiales?.toString(),
      id_insumo: obj.id_insumo?.toString(),
      id_ficha_tecnica: obj.id_ficha_tecnica?.toString(),
      id_medida: obj.id_medida?.toString(),
      cantidades: obj.cantidades,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }

  _buildQuery(filters = {}) {
    const query = {};
    const objectIdFields = [
      'id_materiales',
      'id_insumo',
      'id_ficha_tecnica',
      'id_medida',
    ];

    for (const field of objectIdFields) {
      if (filters[field] !== undefined) {
        if (!mongoose.isValidObjectId(filters[field])) return null;
        query[field] = filters[field];
      }
    }

    return query;
  }

  async findAll(filters = {}) {
    const query = this._buildQuery(filters);
    if (!query) return [];

    const docs = await MaterialTechnicalSpecificationsModel
      .find(query)
      .sort({ createdAt: -1 });

    return docs.map((d) => this._toPlain(d));
  }

  async findByTechnicalSheetId(id_ficha_tecnica) {
    if (!mongoose.isValidObjectId(id_ficha_tecnica)) return [];

    const docs = await MaterialTechnicalSpecificationsModel
      .find({ id_ficha_tecnica })
      .sort({ createdAt: -1 });

    return docs.map((d) => this._toPlain(d));
  }

  async findById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await MaterialTechnicalSpecificationsModel.findById(id).catch(() => null);
    return this._toPlain(doc);
  }

  async create(data) {
    const doc = await MaterialTechnicalSpecificationsModel.create(data);
    return this._toPlain(doc);
  }

  async update(id, changes) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await MaterialTechnicalSpecificationsModel
      .findByIdAndUpdate(id, changes, { new: true, runValidators: true })
      .catch(() => null);
    return this._toPlain(doc);
  }

  async delete(id) {
    if (!mongoose.isValidObjectId(id)) return false;
    const doc = await MaterialTechnicalSpecificationsModel.findByIdAndDelete(id).catch(() => null);
    return !!doc;
  }
}

module.exports = MaterialTechnicalSpecificationsRepository;
