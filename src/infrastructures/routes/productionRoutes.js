// infrastructures/routes/productionRoutes.js
/**
 * Rutas de Producción
 *
 *  GET    /produccion/ordenes/estados         — Lista de estados válidos del flujo
 *  GET    /produccion/ordenes                 — Lista con filtros + paginación
 *    ?search=       busca en cliente
 *    ?estado=       estado exacto del flujo
 *    ?id_usuario=   filtrar por creador
 *    ?fecha_desde=  fecha_entrega >= yyyy-mm-dd
 *    ?fecha_hasta=  fecha_entrega <= yyyy-mm-dd
 *    ?page=         (default 1)
 *    ?limit=        (default 10, max 100)
 *    ?sortBy=       (default "createdAt")
 *    ?order=        "asc" | "desc" (default "desc")
 *
 *  GET    /produccion/ordenes/:id             — Detalle de una orden
 *  POST   /produccion/ordenes                 — Crear orden (estado inicial: Diseño)
 *  PUT    /produccion/ordenes/:id             — Editar fecha_entrega y cliente
 *  PATCH  /produccion/ordenes/:id/estado      — Avanzar estado  { estado: "Corte" }
 *  PATCH  /produccion/ordenes/:id/anular      — Anular           { motivo: "..." }
 *
 *  GET    /produccion/calendario              — Eventos para FullCalendar
 *    ?desde=yyyy-mm-dd  (opcional)
 *    ?hasta=yyyy-mm-dd  (opcional)
 *
 *  GET    /produccion/alertas                 — Órdenes vencidas, por vencer y sin avance
 */

const { Router }      = require('express');
const ctrl            = require('../controllers/productionController');
const { requireAuth } = require('../../interfaces/middlewares/authMiddleware');

const router = Router();
router.use(requireAuth); // ✅ Necesario: asigna req.user (dev-user en dev, JWT en prod)

// Rutas fijas primero (antes de /:id)
router.get('/ordenes/estados',      ctrl.getEstados);
router.get('/calendario',           ctrl.getCalendario);
router.get('/alertas',              ctrl.getAlertas);

// CRUD órdenes
router.get('/ordenes',              ctrl.getOrders);
router.get('/ordenes/:id',          ctrl.getOrderById);
router.post('/ordenes',             ctrl.createOrder);
router.put('/ordenes/:id',          ctrl.updateOrder);

// Transiciones de estado
router.patch('/ordenes/:id/estado', ctrl.cambiarEstado);
router.patch('/ordenes/:id/anular', ctrl.anularOrder);

module.exports = router;
