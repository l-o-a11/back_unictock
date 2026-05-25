// infrastructures/repositorie/SupplyCategoryRepository.js

const SupplyCategoryModel = require('../db/SupplyCategoryModel');
const SupplyCategory      = require('../../domain/entities/SupplyCategory');

class SupplyCategoryRepository {
  _toEntity(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return new SupplyCategory({ ...obj, id: obj._id.toString() });
  }

  /**
   * Devuelve categorías con filtros y paginación.
   *
   * Filtros soportados:
   *   search — busca en nombre y descripcion (regex case-insensitive)
   *   estado — "true" | "false"
   *
   * Paginación: page, limit, sortBy, order
   * Respuesta: { data: SupplyCategory[], total, page, limit, totalPages }
   */
  async findAll(filters = {}) {
    const {
      search,
      estado,
      page   = 1,
      limit  = 50,   // categorías suelen ser pocas; default más alto
      sortBy = 'nombre',
      order  = 'asc',
    } = filters;

    const query = {};

    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [{ nombre: re }, { descripcion: re }];
    }

    if (estado !== undefined && estado !== '') {
      query.estado = estado === 'true' || estado === true;
    }

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip     = (pageNum - 1) * limitNum;
    const sortDir  = order === 'desc' ? -1 : 1;

    const [docs, total] = await Promise.all([
      SupplyCategoryModel.find(query)
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limitNum),
      SupplyCategoryModel.countDocuments(query),
    ]);

    return {
      data:       docs.map((d) => this._toEntity(d)),
      total,
      page:       pageNum,
      limit:      limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async findById(id) {
    const doc = await SupplyCategoryModel.findById(id).catch(() => null);
    return this._toEntity(doc);
  }

  // Case-insensitive — evita duplicados como "Textiles" y "textiles"
  async findByName(nombre) {
    const escaped = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const doc = await SupplyCategoryModel.findOne({
      nombre: { $regex: new RegExp(`^${escaped}$`, 'i') },
    }).catch(() => null);
    return this._toEntity(doc);
  }

  async create(data) {
    const doc = await SupplyCategoryModel.create(data);
    return this._toEntity(doc);
  }

  async update(id, changes) {
    const doc = await SupplyCategoryModel
      .findByIdAndUpdate(id, changes, { new: true, runValidators: true })
      .catch(() => null);
    return this._toEntity(doc);
  }

  /**
   * Activa o desactiva una categoría (soft toggle).
   */
  async toggleEstado(id) {
    const current = await SupplyCategoryModel.findById(id).catch(() => null);
    if (!current) return null;
    const doc = await SupplyCategoryModel.findByIdAndUpdate(
      id,
      { estado: !current.estado },
      { new: true },
    );
    return this._toEntity(doc);
  }

  async delete(id) {
    const result = await SupplyCategoryModel.findByIdAndDelete(id).catch(() => null);
    return !!result;
  }
}

module.exports = SupplyCategoryRepository;
