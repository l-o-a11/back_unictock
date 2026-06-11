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

// src/infrastructures/routes/productsRoutes.js
const { Router } = require('express');
const ctrl = require('../controllers/productController');
const { requireAuth } = require('../../interfaces/middlewares/authMiddleware');

const router = Router();
router.use(requireAuth);

// ── Productos ─────────────────────────────────────────────────
router.get('/',       ctrl.getProducts);
router.post('/',      ctrl.createProduct);
router.get('/:id',    ctrl.getProductById);
router.put('/:id',    ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);
router.patch('/:id/status', ctrl.toggleProductStatus);

// ── Fichas técnicas (/technical-sheets y /tecnicas) ───────────
router.get('/:id/technical-sheets',             ctrl.getTechnicalSheets);
router.get('/:id/technical-sheets/:sheetId',    ctrl.getTechnicalSheetById);
router.post('/:id/technical-sheets',            ctrl.createTechnicalSheet);
router.put('/:id/technical-sheets/:sheetId',    ctrl.updateTechnicalSheet);
router.delete('/:id/technical-sheets/:sheetId', ctrl.deleteTechnicalSheet);

router.get('/:id/tecnicas',                     ctrl.getTechnicalSheets);
router.get('/:id/tecnicas/:sheetId',            ctrl.getTechnicalSheetById);
router.post('/:id/tecnicas',                    ctrl.createTechnicalSheet);
router.put('/:id/tecnicas/:sheetId',            ctrl.updateTechnicalSheet);
router.delete('/:id/tecnicas/:sheetId',         ctrl.deleteTechnicalSheet);

// ── Materiales ────────────────────────────────────────────────
router.get('/:id/tecnicas/:techSpecId/materiales',                              ctrl.getMaterialTechnicalSpecifications);
router.get('/:id/tecnicas/:techSpecId/materiales/:materialTechSpecId',          ctrl.getMaterialTechnicalSpecificationById);
router.post('/:id/tecnicas/:techSpecId/materiales',                             ctrl.createMaterialTechnicalSpecification);
router.put('/:id/tecnicas/:techSpecId/materiales/:materialTechSpecId',          ctrl.updateMaterialTechnicalSpecification);
router.delete('/:id/tecnicas/:techSpecId/materiales/:materialTechSpecId',       ctrl.deleteMaterialTechnicalSpecification);

module.exports = router;

