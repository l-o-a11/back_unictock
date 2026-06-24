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
    if (filters.modulo !== undefined && filters.modulo !== '')
      query.modulo = filters.modulo;
    const docs = await PrivilegeModel.find(query).populate('modulo', 'nombre').sort({ nombre: 1 });
    return docs.map((d) => this._toPlain(d));
  }

  async findById(id) {
    const doc = await PrivilegeModel.findById(id).populate('modulo', 'nombre').catch(() => null);
    return this._toPlain(doc);
  }

  async findByNombre(nombre, moduloId = null) {
    const query = { nombre: nombre.trim().toLowerCase() };
    if (moduloId) query.modulo = moduloId;
    const doc = await PrivilegeModel.findOne(query).populate('modulo', 'nombre').catch(() => null);
    return this._toPlain(doc);
  }

  async create(data) {
    const doc = await PrivilegeModel.create({
      nombre: data.nombre.trim().toLowerCase(),
      modulo: data.modulo,
      estado: data.estado !== undefined ? data.estado : true,
    });
    return this._toPlain(await doc.populate('modulo', 'nombre'));
  }

  async update(id, changes) {
    if (changes.nombre) changes.nombre = changes.nombre.trim().toLowerCase();
    const doc = await PrivilegeModel.findByIdAndUpdate(id, changes, { new: true, runValidators: true }).populate('modulo', 'nombre').catch(() => null);
    return this._toPlain(doc);
  }

  async delete(id) {
    const result = await PrivilegeModel.findByIdAndDelete(id).catch(() => null);
    return !!result;
  }
}

module.exports = PrivilegeRepository;
