// infrastructures/repositorie/ModuleRepository.js

const ModuleModel = require('../db/ModuleModel');

class ModuleRepository {
  _toPlain(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return { ...obj, id: obj._id.toString() };
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.estado !== undefined && filters.estado !== '')
      query.estado = filters.estado === 'true' || filters.estado === true;
    const docs = await ModuleModel.find(query).sort({ nombre: 1 });
    return docs.map((d) => this._toPlain(d));
  }

  async findById(id) {
    const doc = await ModuleModel.findById(id).catch(() => null);
    return this._toPlain(doc);
  }

  async findByNombre(nombre) {
    const doc = await ModuleModel.findOne({ nombre: nombre.trim().toLowerCase() }).catch(() => null);
    return this._toPlain(doc);
  }

  async create(data) {
    const doc = await ModuleModel.create({
      nombre: data.nombre.trim().toLowerCase(),
      estado: data.estado !== undefined ? data.estado : true,
    });
    return this._toPlain(doc);
  }

  async update(id, changes) {
    if (changes.nombre) changes.nombre = changes.nombre.trim().toLowerCase();
    const doc = await ModuleModel.findByIdAndUpdate(id, changes, { new: true, runValidators: true }).catch(() => null);
    return this._toPlain(doc);
  }

  async delete(id) {
    const result = await ModuleModel.findByIdAndDelete(id).catch(() => null);
    return !!result;
  }
}

module.exports = ModuleRepository;
