// infrastructures/routes/supplyCategoryRoutes.js
/**
 * Rutas de Categorías de Insumos
 *
 *  GET    /categorias-insumos            — Lista con filtros + paginación
 *    ?search=     busca en nombre y descripción
 *    ?estado=     "true" | "false"
 *    ?page=       número de página (default 1)
 *    ?limit=      registros por página (default 50, max 100)
 *    ?sortBy=     campo (default "nombre")
 *    ?order=      "asc" | "desc"
 *
 *  GET    /categorias-insumos/:id        — Detalle de una categoría
 *  POST   /categorias-insumos            — Crear categoría
 *  PUT    /categorias-insumos/:id        — Editar categoría
 *  DELETE /categorias-insumos/:id        — Eliminar (bloquea si tiene insumos activos)
 *  PATCH  /categorias-insumos/:id/toggle — Activar / Inactivar
 */

const { Router }      = require('express');
const ctrl            = require('../controllers/supplyCategoryController');
const { requireAuth } = require('../../interfaces/middlewares/authMiddleware');

const router = Router();

router.use(requireAuth);

router.get('/',              ctrl.getSupplyCategories);
router.get('/:id',           ctrl.getSupplyCategoryById);
router.post('/',             ctrl.createSupplyCategory);
router.put('/:id',           ctrl.updateSupplyCategory);
router.delete('/:id',        ctrl.deleteSupplyCategory);
router.patch('/:id/toggle',  ctrl.toggleSupplyCategory);

module.exports = router;
