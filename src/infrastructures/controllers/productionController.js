// infrastructures/controllers/productionController.js
const ProductionRepository        = require('../repositorie/ProductionRepository');
const GetProductions               = require('../../application/use-cases/production/GetProductions');
const GetProductionById            = require('../../application/use-cases/production/GetProductionById');
const CreateProduction             = require('../../application/use-cases/production/CreateProduction');
const UpdateProduction             = require('../../application/use-cases/production/UpdateProduction');
const AnularProduction             = require('../../application/use-cases/production/AnularProduction');
const CambiarEstadoProduction      = require('../../application/use-cases/production/CambiarEstadoProduction');
const GetCalendarioProduction      = require('../../application/use-cases/production/GetCalendarioProduction');
const GetAlertasProduction         = require('../../application/use-cases/production/GetAlertasProduction');
const Production                   = require('../../domain/entities/Production');
const {
  ok, created, badRequest, notFound, unprocessable, unauthorized, serverError,
} = require('../../shared/utils/response');

const repo = new ProductionRepository();

// ── GET /produccion/ordenes ───────────────────────────────────────────────────
// ?search=  ?estado=  ?id_usuario=  ?fecha_desde=  ?fecha_hasta=
// ?page=    ?limit=   ?sortBy=      ?order=
const getOrders = async (req, res) => {
  try {
    const result = await new GetProductions(repo).execute(req.query);
    return ok(res, result);
  } catch (err) {
    return serverError(res);
  }
};

// ── GET /produccion/ordenes/estados ──────────────────────────────────────────
const getEstados = (_req, res) => ok(res, Production.ESTADOS_VALIDOS);

// ── GET /produccion/ordenes/:id ───────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const data = await new GetProductionById(repo).execute(req.params.id);
    // Incluir detalles vacíos para compatibilidad con el frontend
    // (el Backend no maneja detalles de línea todavía)
    return ok(res, { ...data, detalles: [] });
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res);
  }
};

// ── POST /produccion/ordenes ──────────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const id_usuario = req.user?.id;
    const data = await new CreateProduction(repo).execute(req.body, id_usuario);
    return created(res, data);
  } catch (err) {
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 401) return unauthorized(res, err.message);
    return serverError(res);
  }
};

// ── PUT /produccion/ordenes/:id ───────────────────────────────────────────────
const updateOrder = async (req, res) => {
  try {
    const data = await new UpdateProduction(repo).execute(req.params.id, req.body);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res);
  }
};

// ── PATCH /produccion/ordenes/:id/anular ─────────────────────────────────────
// Body: { motivo: "texto obligatorio" }
const anularOrder = async (req, res) => {
  try {
    const id_usuario = req.user?.id;
    const data = await new AnularProduction(repo).execute(req.params.id, req.body.motivo, id_usuario);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res);
  }
};

// ── PATCH /produccion/ordenes/:id/estado ─────────────────────────────────────
// Body: { estado: "Corte" }
const cambiarEstado = async (req, res) => {
  try {
    const id_usuario = req.user?.id;
    const data = await new CambiarEstadoProduction(repo).execute(req.params.id, req.body.estado, id_usuario);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res);
  }
};

// ── GET /produccion/calendario ────────────────────────────────────────────────
// ?desde=yyyy-mm-dd  ?hasta=yyyy-mm-dd  (ambos opcionales)
const getCalendario = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const eventos = await new GetCalendarioProduction(repo).execute(desde, hasta);
    return ok(res, eventos);
  } catch (err) {
    return serverError(res);
  }
};

// ── GET /produccion/alertas ───────────────────────────────────────────────────
const getAlertas = async (req, res) => {
  try {
    const data = await new GetAlertasProduction(repo).execute();
    return ok(res, data);
  } catch (err) {
    return serverError(res);
  }
};

module.exports = {
  getOrders,
  getEstados,
  getOrderById,
  createOrder,
  updateOrder,
  anularOrder,
  cambiarEstado,
  getCalendario,
  getAlertas,
};
