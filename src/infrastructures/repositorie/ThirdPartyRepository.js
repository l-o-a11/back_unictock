// infrastructures/repositorie/ThirdPartyRepository.js

const ThirdPartyModel = require('../db/ThirdPartyModel');
const ThirdParty      = require('../../domain/entities/ThirdParty');

class ThirdPartyRepository {
  _toEntity(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return new ThirdParty({ ...obj, id: obj._id.toString() });
  }

  /** Genera el siguiente código correlativo TP-XXX */
  async _nextCodigo() {
    const last = await ThirdPartyModel
      .findOne({ codigo: /^TP-\d+$/ })
      .sort({ codigo: -1 })
      .select('codigo');
    if (!last) return 'TP-001';
    const n = parseInt(last.codigo.replace('TP-', ''), 10);
    return `TP-${String(n + 1).padStart(3, '0')}`;
  }

  /**
   * findAll — soporta filtros + paginación
   *  ?search   busca en nombre_empresa, nombre_contacto, nit
   *  ?estado   "true" | "false"
   *  ?nit      coincidencia exacta
   *  ?page     default 1
   *  ?limit    default 10  (max 100)
   *  ?sortBy   default "nombre_empresa"
   *  ?order    "asc" | "desc"
   */
  async findAll(filters = {}) {
    const {
      search,
      nit,
      estado,
      page   = 1,
      limit  = 10,
      sortBy = 'nombre_empresa',
      order  = 'asc',
    } = filters;

    const query = {};

    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [
        { nombre_empresa:  re },
        { nombre_contacto: re },
        { nit:             re },
        { codigo:          re },
      ];
    }
    if (nit)    query.nit    = nit;
    if (estado !== undefined && estado !== '')
      query.estado = estado === 'true' || estado === true;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;
    const sortDir  = order === 'desc' ? -1 : 1;

    const [docs, total] = await Promise.all([
      ThirdPartyModel.find(query)
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limitNum),
      ThirdPartyModel.countDocuments(query),
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
    const doc = await ThirdPartyModel.findById(id).catch(() => null);
    return this._toEntity(doc);
  }

  async findByNit(nit) {
    const doc = await ThirdPartyModel.findOne({ nit }).catch(() => null);
    return this._toEntity(doc);
  }

  async create(data) {
    const codigo = await this._nextCodigo();
    const doc    = await ThirdPartyModel.create({ ...data, codigo });
    return this._toEntity(doc);
  }

  async update(id, changes) {
    // Nunca permitir sobreescribir el código autogenerado
    const { codigo, ...safeChanges } = changes;
    const doc = await ThirdPartyModel
      .findByIdAndUpdate(id, safeChanges, { new: true, runValidators: true })
      .catch(() => null);
    return this._toEntity(doc);
  }

  /** Alterna estado activo/inactivo */
  async toggleEstado(id) {
    const current = await ThirdPartyModel.findById(id).catch(() => null);
    if (!current) return null;
    const doc = await ThirdPartyModel.findByIdAndUpdate(
      id,
      { estado: !current.estado },
      { new: true }
    );
    return this._toEntity(doc);
  }

  /** Vincula una orden de producción al tercero */
  async linkProduccion(id, { orden, fecha, produccionId }) {
    const doc = await ThirdPartyModel.findByIdAndUpdate(
      id,
      { $push: { producciones: { orden, fecha, produccionId } } },
      { new: true }
    ).catch(() => null);
    return this._toEntity(doc);
  }

  async delete(id) {
    const result = await ThirdPartyModel.findByIdAndDelete(id).catch(() => null);
    return !!result;
  }

  /** true si el tercero tiene ≥1 producción vinculada */
  async tieneProduccion(id) {
    const doc = await ThirdPartyModel.findById(id).select('producciones').catch(() => null);
    return doc ? doc.producciones.length > 0 : false;
  }
}

module.exports = ThirdPartyRepository;
