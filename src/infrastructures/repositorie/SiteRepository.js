// infrastructures/repositories/SiteRepository.js
// FIX #8: findByName ahora usa regex case-insensitive (igual que la API)
// Antes usaba match exacto → "Putonga" y "putonga" eran sedes distintas

const SiteModel = require('../db/SiteModel');
const Site      = require('../../domain/entities/site');

class SiteRepository {
    _toEntity(doc) {
        if (!doc) return null;
        const obj = doc.toObject ? doc.toObject() : doc;
        return new Site({ ...obj, id: obj._id.toString() });
    }

    /**
     * Devuelve sitios con filtros y paginación.
     *
     * Filtros soportados (query params):
     *   search   — busca en nombre, ciudad, barrio y direccion (regex case-insensitive)
     *   telefono — coincidencia exacta
     *   estado   — "true" | "false"
     *
     * Paginación:
     *   page    — número de página (default 1)
     *   limit   — registros por página (default 10, max 100)
     *   sortBy  — campo de ordenamiento (default "nombre")
     *   order   — "asc" | "desc" (default "asc")
     *
     * Respuesta:
     *   { data: Site[], total, page, limit, totalPages }
     */
    async findAll(filters = {}) {
        const {
            search,
            telefono,
            estado,
            page    = 1,
            limit   = 10,
            sortBy  = 'nombre',
            order   = 'asc',
        } = filters;

        const query = {};

        if (search) {
            const re = new RegExp(search, 'i');
            query.$or = [
                { nombre:    re },
                { ciudad:    re },
                { barrio:    re },
                { direccion: re },
            ];
        }

        if (telefono) query.telefono = telefono;
        if (estado !== undefined && estado !== '') {
            query.estado = estado === 'true' || estado === true;
        }

        const pageNum  = Math.max(1, parseInt(page)  || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const skip     = (pageNum - 1) * limitNum;
        const sortDir  = order === 'desc' ? -1 : 1;

        const [docs, total] = await Promise.all([
            SiteModel.find(query)
                .sort({ [sortBy]: sortDir })
                .skip(skip)
                .limit(limitNum),
            SiteModel.countDocuments(query),
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
        const doc = await SiteModel.findById(id).catch(() => null);
        return this._toEntity(doc);
    }

    // FIX #8: regex ^nombre$ con flag 'i' — case-insensitive, igual que la API
    async findByName(nombre) {
        const escaped = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const doc = await SiteModel.findOne({
            nombre: { $regex: new RegExp(`^${escaped}$`, 'i') },
        }).catch(() => null);
        return this._toEntity(doc);
    }

    async create(data) {
        const doc = await SiteModel.create(data);
        return this._toEntity(doc);
    }

    async update(id, changes) {
        const doc = await SiteModel
            .findByIdAndUpdate(id, changes, { new: true, runValidators: true })
            .catch(() => null);
        return this._toEntity(doc);
    }

    async toggleEstado(id) {
        const current = await SiteModel.findById(id).catch(() => null);
        if (!current) return null;
        const doc = await SiteModel.findByIdAndUpdate(
            id,
            { estado: !current.estado },
            { new: true },
        );
        return this._toEntity(doc);
    }

    async delete(id) {
        const result = await SiteModel.findByIdAndDelete(id).catch(() => null);
        return !!result;
    }
}

module.exports = SiteRepository;