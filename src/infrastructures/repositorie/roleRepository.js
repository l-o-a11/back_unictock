// infrastructures/repositories/roleRepository.js

const RoleModel = require('../db/RoleModel');
const Role = require('../../domain/entities/Role');

class RoleRepository {
    _toEntity(doc) {
        if (!doc) return null;
        const obj = doc.toObject ? doc.toObject() : doc;
        return new Role({ ...obj, id: obj._id.toString() });
    }

    /**
     * Devuelve roles con filtros y paginación.
     *
     * Filtros soportados (query params):
     *   search  — busca en nombre y descripcion (regex case-insensitive)
     *   estado  — "true" | "false"
     *
     * Paginación:
     *   page    — número de página (default 1)
     *   limit   — registros por página (default 10, max 100)
     *   sortBy  — campo de ordenamiento (default "nombre")
     *   order   — "asc" | "desc" (default "asc")
     *
     * Respuesta:
     *   { data: Role[], total, page, limit, totalPages }
     */
    async findAll(filters = {}) {
        const {
            search,
            estado,
            page = 1,
            limit = 10,
            sortBy = 'nombre',
            order = 'asc',
        } = filters;

        const query = {};

        if (search) {
            const re = new RegExp(search, 'i');
            query.$or = [
                { nombre: re },
                { descripcion: re },
            ];
        }

        if (estado !== undefined && estado !== '') {
            query.estado = estado === 'true' || estado === true;
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;
        const sortDir = order === 'desc' ? -1 : 1;

        const [docs, total] = await Promise.all([
            RoleModel.find(query)
                .sort({ [sortBy]: sortDir })
                .skip(skip)
                .limit(limitNum),
            RoleModel.countDocuments(query),
        ]);

        return {
            data: docs.map((d) => this._toEntity(d)),
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }

    async findById(id) {
        const doc = await RoleModel.findById(id).catch(() => null);
        return this._toEntity(doc);
    }

    async findByName(nombre) {
        const doc = await RoleModel.findOne({ nombre }).catch(() => null);
        return this._toEntity(doc);
    }

    async create(data) {
        const doc = await RoleModel.create(data);
        return this._toEntity(doc);
    }

    async update(id, changes) {
        const doc = await RoleModel
            .findByIdAndUpdate(id, changes, { new: true, runValidators: true })
            .catch(() => null);
        return this._toEntity(doc);
    }

    /**
     * Activa o desactiva un rol (soft toggle).
     */
    async toggleEstado(id) {
        const current = await RoleModel.findById(id).catch(() => null);
        if (!current) return null;
        const doc = await RoleModel.findByIdAndUpdate(
            id,
            { estado: !current.estado },
            { new: true },
        );
        return this._toEntity(doc);
    }

    async delete(id) {
        const result = await RoleModel.findByIdAndDelete(id).catch(() => null);
        return !!result;
    }

    /**
     * Verifica si el rol tiene usuarios asociados (para bloquear eliminación).
     * Requiere el modelo de Usuarios inyectado externamente para evitar dependencias circulares.
     */
    async tieneUsuarios(id, UserModel) {
        if (!UserModel) return false;
        const count = await UserModel.countDocuments({ rol: id });
        return count > 0;
    }
}

module.exports = RoleRepository;
