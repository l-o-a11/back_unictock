// infrastructures/repositorie/PrivilegeRepository.js

const PrivilegeModel = require('../db/PrivilegeModel');

class PrivilegeRepository {
  _toPlain(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return { ...obj, id: obj._id.toString() };
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.estado !== undefined && filters.estado !== '')
      query.estado = filters.estado === 'true' || filters.estado === true;
    if (filters.moduloId) query.modulo = filters.moduloId;

    // populate solo trae nombre (lo único que tiene el módulo)
    const docs = await PrivilegeModel.find(query)
      .populate('modulo', 'nombre')
      .sort({ nombre: 1 });
    return docs.map((d) => this._toPlain(d));
  }

  async findById(id) {
    const doc = await PrivilegeModel.findById(id)
      .populate('modulo', 'nombre')
      .catch(() => null);
    return this._toPlain(doc);
  }

  async findByNombreAndModulo(nombre, moduloId) {
    const doc = await PrivilegeModel.findOne({
      nombre: nombre.trim().toLowerCase(),
      modulo: moduloId,
    }).catch(() => null);
    return this._toPlain(doc);
  }
}

module.exports = PrivilegeRepository;
