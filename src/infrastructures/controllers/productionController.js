// ─────────────────────────────────────────────────────────────────────────────
// src/infrastructure/controllers/productionController.js
// ─────────────────────────────────────────────────────────────────────────────

const ProductionRepository            = require("../repositorie/ProductionRepository");
const ProductionOrderDetailRepository = require("../repositorie/ProductionOrderDetailRepository");
const ThirdPartyAssignmentRepository  = require("../repositorie/ThirdPartyAssignmentRepository");
const ProductRepository               = require("../repositorie/ProductRepository");

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
const productRepo    = new ProductRepository();

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

/**
 * Al pasar una orden a "Enviado", se suman las cantidades de cada detalle
 * (agrupadas por id_producto) al stock del producto correspondiente
 * (los detalles guardan id_producto = referencia del producto, no el _id).
 */
const aplicarIngresoStockPorEnvio = async (idOrden) => {
  try {
    const detalles = await detailRepo.findAll({ id_orden: idOrden });
    if (!detalles?.length) return;

    // Agrupar cantidades por referencia de producto (puede haber varios colores)
    const cantidadPorReferencia = new Map();
    for (const d of detalles) {
      const ref = d.id_producto;
      if (!ref) continue;
      cantidadPorReferencia.set(ref, (cantidadPorReferencia.get(ref) || 0) + Number(d.cantidad || 0));
    }

    for (const [referencia, cantidad] of cantidadPorReferencia.entries()) {
      if (!cantidad) continue;
      const product = await productRepo.findByReference(referencia).catch(() => null);
      if (!product) {
        console.warn(`[ProductionController] No se encontró producto con referencia "${referencia}" para sumar stock`);
        continue;
      }
      const nuevoStock = Number(product.stock || 0) + cantidad;
      await productRepo.update(product.id, { stock: nuevoStock });
    }
  } catch (err) {
    console.error("[ProductionController] Error al actualizar stock por envío:", err);
  }
};

// ── Órdenes ───────────────────────────────────────────────────────────────────

const getOrders = async (req, res) => {
  try {
    const result = await prodRepo.findAll(req.query);
    // El repositorio devuelve { data: [...], total, page, limit, totalPages }
    const data = result?.data || [];
    const mappedOrders = Array.isArray(data) ? data.map((o) => o.toJSON?.() || o) : [];
    return ok(res, {
      data: mappedOrders,
      total: result?.total || mappedOrders.length,
      page: result?.page || 1,
      limit: result?.limit || 10,
      totalPages: result?.totalPages || 1,
    });
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

    const { estado, historial, motivo_anulacion, ...rest } = req.body;

    const ALLOWED_FIELDS = new Set([
      "cliente",
      "fecha_entrega",
      "id_usuario",
      "asignaciones",
      "tipo",
      "referencia",
      "producto",
      "techSpecification",
      "designImages",
      "finishedImages",
      "finishedImageUrl",
      "fromDamaged",
      "originalOrderNumber",
      "originalOrderStatus",
    ]);

    const safeChanges = {};
    for (const [key, value] of Object.entries(rest)) {
      if (ALLOWED_FIELDS.has(key) && value !== undefined) {
        safeChanges[key] = value;
      }
    }

    if (Object.prototype.hasOwnProperty.call(safeChanges, "cliente")) {
      const cliente = typeof safeChanges.cliente === "string" ? safeChanges.cliente.trim() : safeChanges.cliente;
      if (!cliente) return badRequest(res, "El cliente no puede estar vacío");
      safeChanges.cliente = cliente;
    }

    if (Object.prototype.hasOwnProperty.call(safeChanges, "fecha_entrega")) {
      const fecha = new Date(safeChanges.fecha_entrega);
      if (!safeChanges.fecha_entrega || Number.isNaN(fecha.getTime())) {
        return badRequest(res, "La fecha de entrega no es válida");
      }
      safeChanges.fecha_entrega = fecha;
    }

    const updated = await prodRepo.update(req.params.id, safeChanges);
    if (!updated) return serverError(res, "Error al actualizar la orden");
    return ok(res, updated.toJSON());
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return badRequest(res, err.message);
    }
    return handleError(res, err);
  }
};

// ── Anular orden ──────────────────────────────────────────────────────────────

const anularOrder = async (req, res) => {
  try {
    const { motivo, id_usuario: bodyUser, user: bodyUserName } = req.body;
    const id_usuario = bodyUser || req.user?.id || null;
    const user = bodyUserName || req.user?.nombre || req.user?.id || (typeof bodyUser === 'string' ? bodyUser : null);

    const useCase = new AnularProduction(prodRepo);
    const result  = await useCase.execute(req.params.id, motivo, id_usuario, user);
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
    const { estado, id_usuario: bodyUser, user: bodyUserName, force, ...rest } = req.body;
    const id_usuario = bodyUser || req.user?.id || null;
    const user = bodyUserName || req.user?.nombre || req.user?.id || (typeof bodyUser === 'string' ? bodyUser : null);
    console.log(`[ProductionController] cambiarEstado called id=${req.params.id} estado=${estado} id_usuario=${id_usuario} force=${!!force}`);
    console.log('[ProductionController] payload extra:', rest);

    // Si retrocedemos a un estado igual o anterior a "Compras", eliminamos las asignaciones de terceros de la orden
    const Production = require("../../domain/entities/Production");
    const targetIdx = Production.ESTADOS_VALIDOS.indexOf(estado);
    const comprasIdx = Production.ESTADOS_VALIDOS.indexOf("Compras");
    if (targetIdx !== -1 && targetIdx <= comprasIdx) {
      console.log(`[ProductionController] Retrocediendo al estado "${estado}". Eliminando asignaciones para orden ${req.params.id}`);
      await assignmentRepo.deleteByOrder(req.params.id);
    }

    const useCase = new CambiarEstadoProduction(prodRepo);
    const result  = await useCase.execute(req.params.id, estado, id_usuario, user, { force: !!force, extra: rest });
      console.log('[ProductionController] cambiarEstado result:', result && result.id ? result.id : result);

    // Al confirmar el envío, los productos fabricados ingresan al stock
    if (estado === "Enviado") {
      await aplicarIngresoStockPorEnvio(req.params.id);
    }

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

    // ✅ Si la orden ya está en etapa "Corte", asignar refCorte automáticamente
    // al nuevo detalle — mismo mecanismo que al avanzar el estado a Corte.
    if (!detail.refCorte) {
      const order = await prodRepo.findById(payload.id_orden).catch(() => null);
      if (order && order.estado === 'Corte') {
        try {
          const siguiente = (await detailRepo.countRefCorteByProducto(payload.id_producto)) + 1;
          const refCorte  = `${payload.id_producto}-${siguiente}`;
          await detailRepo.update(detail.id, { refCorte });
          const updated = await detailRepo.findById(detail.id);
          return created(res, updated);
        } catch (e) {
          console.warn('No se pudo asignar refCorte automáticamente:', e?.message);
        }
      }
    }

    return created(res, detail);
  } catch (err) {
    if (err.statusCode === 400)  return badRequest(res, err.message);
    if (err.statusCode === 404)  return notFound(res, err.message);
    if (err.statusCode === 422)  return badRequest(res, err.message);
    return handleError(res, err);
  }
};

// ── DELETE /produccion/detalle-orden/:id ──────────────────────────────────────
// Elimina un detalle de orden y registra la acción en el historial de la orden.
const deleteOrderDetail = async (req, res) => {
  try {
    const detail = await detailRepo.findById(req.params.id);
    if (!detail) return notFound(res, 'Detalle no encontrado');

    const deleted = await detailRepo.delete(req.params.id);
    if (!deleted) return notFound(res, 'No se pudo eliminar el detalle');

    // Registrar en el historial de la orden
    const userId   = req.user?.id || req.user?._id || null;
    const userName = req.user?.nombreCompleto || req.user?.nombre || req.user?.username || 'Sistema';
    await prodRepo.addHistoryEntry(detail.id_orden, {
      estado:     'Referencia eliminada',
      fecha:      new Date(),
      id_usuario: userId,
      user:       userName,
      motivo:     `Artículo ${detail.id_producto} (${detail.color || 'sin color'}, ${detail.cantidad} uds) eliminado`,
    }).catch(() => { /* no bloquear si el push falla */ });

    return ok(res, { deleted: true });
  } catch (err) {
    return handleError(res, err);
  }
};

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
  deleteOrderDetail,
  getAssignments,
  createAssignment,
  getCalendario,
  getAlertas,
};
