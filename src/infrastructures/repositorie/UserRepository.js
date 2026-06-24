// infrastructures/repositorie/UserRepository.js
const UserModel = require('../db/UserModel');
const User = require('../../domain/entities/User');

class UserRepository {
    _toEntity(doc) {
        if (!doc) return null;
        const obj = doc.toObject ? doc.toObject() : doc;
        return new User({ ...obj, id: obj._id ? obj._id.toString() : obj.id });
    }

    async findAll(filters = {}) {
        const query = {};

        if (filters.search) {
            const re = new RegExp(filters.search, 'i');
            query.$or = [
                { nombreCompleto: re },
                { correo: re },
                { numeroDocumento: re },
            ];
        }
        if (filters.rolId) query.rolId = filters.rolId;
        if (filters.sedeId) query.sedeId = filters.sedeId;
        if (filters.estado !== undefined && filters.estado !== '')
            query.estado = filters.estado === 'true' || filters.estado === true;

        // populate solo si los modelos de tus compañeras existen con esos nombres
        // si no, quita el .populate() y solo quedará el ObjectId
        const docs = await UserModel.find(query);
        return docs.map((d) => this._toEntity(d));
    }

    async findById(id) {
        const doc = await UserModel.findById(id).catch(() => null);
        return this._toEntity(doc);
    }

    async findByEmail(correo) {
        const doc = await UserModel.findOne({ correo });
        return this._toEntity(doc);
    }

    async findByDocument(numeroDocumento) {
        const doc = await UserModel.findOne({ numeroDocumento });
        return this._toEntity(doc);
    }

    async countActiveAdmins() {
        // Sin modelo de Role, contamos todos los activos como fallback
        // Cuando tus compañeras terminen el RoleModel, puedes filtrar por rolId
        return UserModel.countDocuments({ estado: true });
    }

    async save(data) {
        const doc = await UserModel.create(data);
        return this._toEntity(doc);
    }

    async update(id, changes) {
        const doc = await UserModel
            .findByIdAndUpdate(id, changes, { new: true, runValidators: true })
            .catch(() => null);
        return this._toEntity(doc);
    }

    async delete(id) {
        const result = await UserModel.findByIdAndDelete(id).catch(() => null);
        return !!result;
    }
}

module.exports = UserRepository;