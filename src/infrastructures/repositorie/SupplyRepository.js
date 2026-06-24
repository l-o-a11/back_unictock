// infrastructures/repositorie/SupplyRepository.js

const SupplyModel = require('../db/SupplyModel');
const Supply      = require('../../domain/entities/Supply');

class SupplyRepository {
  _toEntity(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return new Supply({
      ...obj,
      id:        obj._id.toString(),
      categoria: obj.categoria?.toString ? obj.categoria.toString() : obj.categoria,
    });
  }

  /**
   * Devuelve insumos con filtros y paginación.
   *
   * Filtros soportados (query params):
   *   search    — busca en nombre (regex case-insensitive)
   *   categoria — ObjectId de categoría (coincidencia exacta)
   *   estado    — "true" | "false"
   *
   * Paginación:
   *   page    — número de página (default 1)
   *   limit   — registros por página (default 10, max 100)
   *   sortBy  — campo (default "nombre")
   *   order   — "asc" | "desc" (default "asc")
   *
   * Respuesta:
   *   { data: Supply[], total, page, limit, totalPages }
   */
  async findAll(filters = {}) {
    const {
      search,
      categoria,
      estado,
      page   = 1,
      limit  = 10,
      sortBy = 'nombre',
      order  = 'asc',
    } = filters;

    const query = {};

    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [{ nombre: re }];
    }

    if (categoria) query.categoria = categoria;

    if (estado !== undefined && estado !== '') {
      query.estado = estado === 'true' || estado === true;
    }

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip     = (pageNum - 1) * limitNum;
    const sortDir  = order === 'desc' ? -1 : 1;

    const [docs, total] = await Promise.all([
      SupplyModel.find(query)
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limitNum)
        .populate('categoria', 'nombre descripcion'),
      SupplyModel.countDocuments(query),
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
    const doc = await SupplyModel.findById(id)
      .populate('categoria', 'nombre descripcion')
      .catch(() => null);
    return this._toEntity(doc);
  }

  // Case-insensitive — evita duplicados como "Hilo" y "hilo"
  async findByName(nombre) {
    const escaped = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const doc = await SupplyModel.findOne({
      nombre: { $regex: new RegExp(`^${escaped}$`, 'i') },
    }).catch(() => null);
    return this._toEntity(doc);
  }

  async create(data) {
    const doc = await SupplyModel.create(data);
    return this._toEntity(doc);
  }

  async update(id, changes) {
    const doc = await SupplyModel
      .findByIdAndUpdate(id, changes, { new: true, runValidators: true })
      .populate('categoria', 'nombre descripcion')
      .catch(() => null);
    return this._toEntity(doc);
  }

  /**
   * Activa o desactiva un insumo (soft toggle).
   */
  async toggleEstado(id) {
    const current = await SupplyModel.findById(id).catch(() => null);
    if (!current) return null;
    const doc = await SupplyModel.findByIdAndUpdate(
      id,
      { estado: !current.estado },
      { new: true },
    ).populate('categoria', 'nombre descripcion');
    return this._toEntity(doc);
  }

  async delete(id) {
    const result = await SupplyModel.findByIdAndDelete(id).catch(() => null);
    return !!result;
  }

  /**
   * Verifica si existe algún insumo activo en la categoría dada.
   * Usado por DeleteSupplyCategory para bloquear la eliminación.
   */
  async tieneInsumosPorCategoria(categoriaId) {
    const count = await SupplyModel.countDocuments({ categoria: categoriaId, estado: true });
    return count > 0;
  }
}

module.exports = SupplyRepository;
