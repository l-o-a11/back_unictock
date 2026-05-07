// ─────────────────────────────────────────────────────────────────────────────
// src/infrastructure/controllers/productionController.js
// ─────────────────────────────────────────────────────────────────────────────

const ProductionRepository            = require("../repositorie/ProductionRepository");
const ProductionOrderDetailRepository = require("../repositorie/ProductionOrderDetailRepository");
const ThirdPartyAssignmentRepository  = require("../repositorie/ThirdPartyAssignmentRepository");

const AnularProduction       = require("../../application/use-cases/production/AnularProduction");
const CambiarEstadoProduction = require("../../application/use-cases/production/CambiarEstadoProduction");
const CreateOrderDetail      = require("../../application/use-cases/production/CreateOrderDetail");
const GetOrderDetails        = require("../../application/use-cases/production/GetOrderDetails");

const Production = require("../../domain/entities/Production");
const GetCalendarioProduction = require("../../application/use-cases/production/GetCalendarioProduction");
const GetAlertasProduction    = require("../../application/use-cases/production/GetAlertasProduction");
const GetProductions          = require("../../application/use-cases/production/GetProductions");

const { ok, created, badRequest, notFound, serverError } = require("../../shared/utils/response");

const prodRepo       = new ProductionRepository();
const detailRepo     = new ProductionOrderDetailRepository();
const assignmentRepo = new ThirdPartyAssignmentRepository();

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Devuelve serverError con el mensaje real en desarrollo,
 * y genérico en producción.
 */
const handleError = (res, err) => {
  console.error("[ProductionController]", err);
  const msg = process.env.NODE_ENV !== "production" ? err.message : undefined;
  return serverError(res, msg);
};

// ── Órdenes ───────────────────────────────────────────────────────────────────

const getOrders = async (req, res) => {
  try {
    const orders = await prodRepo.findAll(req.query);
    return ok(res, orders.map((o) => o.toJSON()));
  } catch (err) {
    return handleError(res, err);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await prodRepo.findById(req.params.id);
    if (!order) return notFound(res, "Orden no encontrada");
    const details = await detailRepo.findAll({ id_orden: req.params.id });
    return ok(res, { ...order.toJSON(), detalles: details.map((d) => d.toJSON()) });
  } catch (err) {
    return handleError(res, err);
  }
};

const createOrder = async (req, res) => {
  try {
    const { fecha_entrega, cliente, id_usuario } = req.body;
    const userId = id_usuario || req.user?.id || "anonymous";

    if (!fecha_entrega || !cliente)
      return badRequest(res, "Los campos fecha_entrega y cliente son requeridos");

    const order = await prodRepo.create({
      fecha_entrega,
      cliente,
      id_usuario: userId,
      estado: "Diseño",
      historial: [{ estado: "Diseño", fecha: new Date(), id_usuario: userId, motivo: null }],
    });
    return created(res, order.toJSON());
  } catch (err) {
    return handleError(res, err);
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await prodRepo.findById(req.params.id);
    if (!order) return notFound(res, "Orden no encontrada");

    if (order.estaAnulada())
      return badRequest(res, "No se puede editar una orden anulada");

    const { estado, historial, motivo_anulacion, ...safeChanges } = req.body;
    const updated = await prodRepo.update(req.params.id, safeChanges);
    return ok(res, updated.toJSON());
  } catch (err) {
    return handleError(res, err);
  }
};

// ── Anular orden ──────────────────────────────────────────────────────────────

const anularOrder = async (req, res) => {
  try {
    const { motivo } = req.body;
    const id_usuario = req.user?.id || null;

    const useCase = new AnularProduction(prodRepo);
    const result  = await useCase.execute(req.params.id, motivo, id_usuario);
    return ok(res, result);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 400 || err.statusCode === 422) return badRequest(res, err.message);
    return handleError(res, err);
  }
};

// ── Cambiar estado ────────────────────────────────────────────────────────────

const cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const id_usuario = req.user?.id || null;

    const useCase = new CambiarEstadoProduction(prodRepo);
    const result  = await useCase.execute(req.params.id, estado, id_usuario);
    return ok(res, result);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 400 || err.statusCode === 422) return badRequest(res, err.message);
    return handleError(res, err);
  }
};

// ── Estados válidos ───────────────────────────────────────────────────────────

const getEstados = (_req, res) => {
  return ok(res, Production.ESTADOS_VALIDOS);
};

// ── Detalles de orden ─────────────────────────────────────────────────────────

const getOrderDetails = async (req, res) => {
  try {
    const useCase = new GetOrderDetails(detailRepo);
    return ok(res, await useCase.execute(req.query));
  } catch (err) {
    return handleError(res, err);
  }
};

const createOrderDetail = async (req, res) => {
  try {
    // Parsear cantidad a número por si llega como string desde el form
    const payload = {
      ...req.body,
      cantidad: req.body.cantidad !== undefined ? Number(req.body.cantidad) : undefined,
    };

    const useCase = new CreateOrderDetail(detailRepo, prodRepo);
    const detail  = await useCase.execute(payload);
    return created(res, detail);
  } catch (err) {
    if (err.statusCode === 400)  return badRequest(res, err.message);
    if (err.statusCode === 404)  return notFound(res, err.message);
    if (err.statusCode === 422)  return badRequest(res, err.message);
    return handleError(res, err);
  }
};

// ── Asignaciones ──────────────────────────────────────────────────────────────

const getAssignments = async (req, res) => {
  try {
    return ok(res, await assignmentRepo.findAll(req.query));
  } catch (err) {
    return handleError(res, err);
  }
};

const createAssignment = async (req, res) => {
  try {
    const { id_orden, id_tercero, cantidad } = req.body;
    if (!id_orden || !id_tercero || !cantidad)
      return badRequest(res, "Los campos id_orden, id_tercero y cantidad son requeridos");
    return created(res, await assignmentRepo.create({ id_orden, id_tercero, cantidad }));
  } catch (err) {
    return handleError(res, err);
  }
};


// ── Calendario ────────────────────────────────────────────────────────────────

const getCalendario = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetCalendarioProduction(prodRepo);
    const result  = await useCase.execute(desde, hasta);
    return ok(res, result);
  } catch (err) {
    return handleError(res, err);
  }
};

// ── Alertas ───────────────────────────────────────────────────────────────────

const getAlertas = async (req, res) => {
  try {
    const useCase = new GetAlertasProduction(prodRepo);
    const result  = await useCase.execute();
    return ok(res, result);
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  anularOrder,
  cambiarEstado,
  getEstados,
  getOrderDetails,
  createOrderDetail,
  getAssignments,
  createAssignment,
  getCalendario,
  getAlertas,
};
