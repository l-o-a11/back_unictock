// infrastructures/routes/supplyRoutes.js
/**
 * Rutas de Insumos
 *
 *  GET    /insumos                       — Lista con filtros + paginación
 *    ?search=     busca en nombre
 *    ?categoria=  ObjectId de categoría
 *    ?estado=     "true" | "false"
 *    ?page=       número de página (default 1)
 *    ?limit=      registros por página (default 10, max 100)
 *    ?sortBy=     campo (default "nombre")
 *    ?order=      "asc" | "desc"
 *
 *  GET    /insumos/catalogos/medidas     — Unidades de medida disponibles
 *  GET    /insumos/catalogos/propiedades — Propiedades adicionales disponibles
 *  GET    /insumos/:id                   — Detalle de un insumo
 *  POST   /insumos                       — Crear insumo
 *  PUT    /insumos/:id                   — Editar insumo
 *  DELETE /insumos/:id                   — Eliminar insumo
 *  PATCH  /insumos/:id/toggle            — Activar / Inactivar
 */

const { Router }      = require('express');
const ctrl            = require('../controllers/supplyController');
const { requireAuth } = require('../../interfaces/middlewares/authMiddleware');

const router = Router();

router.use(requireAuth);

// Catálogos — deben ir ANTES de /:id para evitar conflictos de ruta
router.get('/catalogos/medidas',      ctrl.getMedidas);
router.get('/catalogos/propiedades',  ctrl.getPropiedades);

// CRUD
router.get('/',              ctrl.getSupplies);
router.get('/:id',           ctrl.getSupplyById);
router.post('/',             ctrl.createSupply);
router.put('/:id',           ctrl.updateSupply);
router.delete('/:id',        ctrl.deleteSupply);
router.patch('/:id/toggle',  ctrl.toggleSupply);

module.exports = router;
