// infrastructures/controllers/siteController.js
const SiteRepository = require('../repositorie/SiteRepository');
const ProductionRepository = require('../repositorie/ProductionRepository');
const GetSites = require('../../application/use-cases/sites/GetSites');
const GetSiteById = require('../../application/use-cases/sites/GetSitesById');
const CreateSite = require('../../application/use-cases/sites/CreateSites');
const UpdateSite = require('../../application/use-cases/sites/UpdateSites');
const DeleteSite = require('../../application/use-cases/sites/DeleteSites');
const ToggleSite = require('../../application/use-cases/sites/ToggleSites');
const {
    ok, created, badRequest, notFound, conflict, unprocessable, serverError,
} = require('../../shared/utils/response');

const repo = new SiteRepository();
const productionRepo = new ProductionRepository();

const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return undefined;
};

// ── Normaliza el body aceptando camelCase (frontend) y snake_case (backend) ──
const normalizeBody = (body) => ({
    nombre: body.nombre,
    ciudad: body.ciudad,
    barrio: body.barrio,
    direccion: body.direccion,
    telefono: body.telefono,
    estado: body.estado !== undefined
        ? parseBoolean(body.estado)
        : body.active !== undefined
            ? parseBoolean(body.active)
            : body.activo !== undefined
                ? parseBoolean(body.activo)
                : undefined,
});

// ── GET /sitios ───────────────────────────────────────────────────────────────
// Query params: search, telefono, estado, page, limit, sortBy, order
const getSites = async (req, res) => {
    try {
        const result = await new GetSites(repo).execute(req.query);
        return ok(res, result);
    } catch (err) {
        return serverError(res);
    }
};

// ── GET /sitios/:id ───────────────────────────────────────────────────────────
const getSiteById = async (req, res) => {
    try {
        const data = await new GetSiteById(repo).execute(req.params.id);
        return ok(res, data);
    } catch (err) {
        if (err.statusCode === 404) return notFound(res, err.message);
        return serverError(res);
    }
};

// ── POST /sitios ──────────────────────────────────────────────────────────────
const createSite = async (req, res) => {
    try {
        const data = await new CreateSite(repo).execute(normalizeBody(req.body));
        return created(res, data);
    } catch (err) {
        if (err.statusCode === 400) return badRequest(res, err.message);
        if (err.statusCode === 409) return conflict(res, err.message);
        return serverError(res, err.message || err.toString());
    }
};

// ── PUT /sitios/:id ───────────────────────────────────────────────────────────
const updateSite = async (req, res) => {
    try {
        const data = await new UpdateSite(repo).execute(req.params.id, normalizeBody(req.body));
        return ok(res, data);
    } catch (err) {
        if (err.statusCode === 404) return notFound(res, err.message);
        if (err.statusCode === 409) return conflict(res, err.message);
        return serverError(res);
    }
};

// ── DELETE /sitios/:id ─────────────────────────────────────────────────────────
const deleteSite = async (req, res) => {
    try {
        const data = await new DeleteSite(repo, productionRepo).execute(req.params.id);
        return ok(res, data);
    } catch (err) {
        if (err.statusCode === 404) return notFound(res, err.message);
        if (err.statusCode === 422) return unprocessable(res, err.message);
        return serverError(res);
    }
};

// ── PATCH /sitios/:id/toggle ───────────────────────────────────────────────────
const toggleSite = async (req, res) => {
    try {
        const data = await new ToggleSite(repo).execute(req.params.id);
        return ok(res, data);
    } catch (err) {
        if (err.statusCode === 404) return notFound(res, err.message);
        return serverError(res);
    }
};

module.exports = {
    getSites,
    getSiteById,
    createSite,
    updateSite,
    deleteSite,
    toggleSite,
};