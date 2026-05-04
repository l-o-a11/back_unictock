// infrastructures/repositories/SupplierRepository.js
const SupplierModel = require('../db/SupplierModel');
const Supplier      = require('../../domain/entities/Supplier');

class SupplierRepository {
  _toEntity(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return new Supplier({ ...obj, id: obj._id.toString() });
  }

  /**
   * Devuelve proveedores con filtros y paginación.
   *
   * Filtros soportados (query params):
   *   search  — busca en nombre_de_empresa, nombre_del_contacto y correo (regex case-insensitive)
   *   nit     — coincidencia exacta
   *   activo  — "true" | "false"
   *
   * Paginación:
   *   page    — número de página (default 1)
   *   limit   — registros por página (default 10, max 100)
   *   sortBy  — campo de ordenamiento (default "nombre_de_empresa")
   *   order   — "asc" | "desc" (default "asc")
   *
   * Respuesta:
   *   { data: Supplier[], total, page, limit, totalPages }
   */
  async findAll(filters = {}) {
    const {
      search,
      nit,
      activo,
      page    = 1,
      limit   = 10,
      sortBy  = 'nombre_de_empresa',
      order   = 'asc',
    } = filters;

    const query = {};

    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [
        { nombre_de_empresa:   re },
        { nombre_del_contacto: re },
        { correo:              re },
        { nit:                 re },
      ];
    }

    if (nit)    query.nit    = nit;
    if (activo !== undefined && activo !== '') {
      query.activo = activo === 'true' || activo === true;
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;
    const sortDir  = order === 'desc' ? -1 : 1;

    const [docs, total] = await Promise.all([
      SupplierModel.find(query)
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limitNum),
      SupplierModel.countDocuments(query),
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
    const doc = await SupplierModel.findById(id).catch(() => null);
    return this._toEntity(doc);
  }

  async findByNit(nit) {
    const doc = await SupplierModel.findOne({ nit });
    return this._toEntity(doc);
  }

  async findByEmail(correo) {
    const doc = await SupplierModel.findOne({ correo: correo.toLowerCase() });
    return this._toEntity(doc);
  }

  async create(data) {
    const doc = await SupplierModel.create(data);
    return this._toEntity(doc);
  }

  async update(id, changes) {
    const doc = await SupplierModel
      .findByIdAndUpdate(id, changes, { new: true, runValidators: true })
      .catch(() => null);
    return this._toEntity(doc);
  }

  /**
   * Activa o desactiva un proveedor (soft toggle).
   */
  async toggleActivo(id) {
    const current = await SupplierModel.findById(id).catch(() => null);
    if (!current) return null;
    const doc = await SupplierModel.findByIdAndUpdate(
      id,
      { activo: !current.activo },
      { new: true },
    );
    return this._toEntity(doc);
  }

  async delete(id) {
    const result = await SupplierModel.findByIdAndDelete(id).catch(() => null);
    return !!result;
  }

  /**
   * Verifica si el proveedor tiene compras asociadas (para bloquear eliminación).
   * Requiere el modelo de Compras inyectado externamente para evitar dependencias circulares.
   */
  async tieneCompras(id, PurchaseModel) {
    if (!PurchaseModel) return false;
    const count = await PurchaseModel.countDocuments({ id_proveedor: id });
    return count > 0;
  }
}

module.exports = SupplierRepository;
