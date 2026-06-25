// infrastructures/routes/productionRoutes.js
/**
 * Rutas de Producción
 *
 *  GET    /produccion/ordenes/estados         — Lista de estados válidos
 *  GET    /produccion/ordenes                 — Lista con filtros + paginación
 *  GET    /produccion/ordenes/:id             — Detalle de una orden + sus detalles
 *  POST   /produccion/ordenes                 — Crear orden (estado inicial: Diseño)
 *  PUT    /produccion/ordenes/:id             — Editar fecha_entrega y cliente
 *  PATCH  /produccion/ordenes/:id/estado      — Avanzar estado  { estado: "Corte" }
 *  PATCH  /produccion/ordenes/:id/anular      — Anular           { motivo: "..." }
 *
 *  GET    /produccion/detalle-orden           — Listar detalles (filtro: id_orden)
 *  POST   /produccion/detalle-orden           — Crear detalle de orden
 *
 *  GET    /produccion/asignaciones            — Listar asignaciones de terceros
 *  POST   /produccion/asignaciones            — Crear asignación
 *
 *  GET    /produccion/calendario              — Eventos para FullCalendar
 *  GET    /produccion/alertas                 — Órdenes vencidas, por vencer y sin avance
 */

const { Router }      = require('express');
const ctrl            = require('../controllers/productionController');
const { requireAuth } = require('../../interfaces/middlewares/authMiddleware');

const router = Router();
router.use(requireAuth); // asigna req.user (dev-user en dev, JWT en prod)

// Rutas fijas ANTES de /:id
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

// Detalles de orden
router.get('/detalle-orden',        ctrl.getOrderDetails);
router.post('/detalle-orden',       ctrl.createOrderDetail);
router.delete('/detalle-orden/:id', ctrl.deleteOrderDetail);

// Asignaciones de terceros
router.get('/asignaciones',         ctrl.getAssignments);
router.post('/asignaciones',        ctrl.createAssignment);

module.exports = router;
