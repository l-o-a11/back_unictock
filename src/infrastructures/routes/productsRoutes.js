// src/infrastructures/routes/productsRoutes.js
/**
 * Rutas de Productos
 *
 * GET    /api/products                              — Lista con filtros/paginación
 * POST   /api/products                              — Crear producto
 * GET    /api/products/:id                          — Detalle
 * PUT    /api/products/:id                          — Actualizar
 * DELETE /api/products/:id                          — Eliminar
 *
 * GET    /api/products/:id/technical-sheets         — Listar fichas técnicas del producto
 * GET    /api/products/:id/technical-sheets/:sheetId — Obtener ficha técnica por ID
 * POST   /api/products/:id/technical-sheets         — Crear ficha técnica
 * PUT    /api/products/:id/technical-sheets/:sheetId — Actualizar ficha técnica
 * DELETE /api/products/:id/technical-sheets/:sheetId — Eliminar ficha técnica
 */

const { Router } = require('express');
const ctrl = require('../controllers/productController');
// const { requireAuth } = require('../../interfaces/middlewares/authMiddleware'); // TODO: Descomentar después

const router = Router();
// router.use(requireAuth); // TODO: Descomentar para requerir JWT

// ── Productos ─────────────────────────────────────────────────────────────────
router.get('/',     ctrl.getProducts);
router.post('/',    ctrl.createProduct);
router.get('/:id',  ctrl.getProductById);
router.put('/:id',  ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);

// ── Fichas técnicas (deben ir ANTES del catch-all /:id) ───────────────────────
router.get('/:id/technical-sheets',              ctrl.getTechnicalSheets);
router.get('/:id/technical-sheets/:sheetId',     ctrl.getTechnicalSheetById);
router.post('/:id/technical-sheets',             ctrl.createTechnicalSheet);
router.put('/:id/technical-sheets/:sheetId',     ctrl.updateTechnicalSheet);
router.delete('/:id/technical-sheets/:sheetId',  ctrl.deleteTechnicalSheet);

module.exports = router;

