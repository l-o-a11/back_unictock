// infrastructures/routes/thirdPartyRoutes.js
/**
 * Rutas de Terceros
 *
 *  GET    /terceros                      — Listar con filtros + paginación
 *    ?search=        busca en nombre_empresa, nombre_contacto, nit, codigo
 *    ?estado=        "true" | "false"
 *    ?nit=           coincidencia exacta
 *    ?page=          default 1
 *    ?limit=         default 10  (max 100)
 *    ?sortBy=        default "nombre_empresa"
 *    ?order=         "asc" | "desc"
 *
 *  GET    /terceros/:id                  — Detalle de un tercero
 *  POST   /terceros                      — Crear tercero (código autogenerado)
 *  PUT    /terceros/:id                  — Editar tercero
 *  DELETE /terceros/:id                  — Eliminar (bloqueado si tiene producciones)
 *  PATCH  /terceros/:id/toggle           — Activar / Inactivar
 *  POST   /terceros/:id/producciones     — Vincular una orden de producción
 */

const { Router } = require('express');
const ctrl       = require('../controllers/thirdPartyController');

const router = Router();

// auth desactivado temporalmente para desarrollo — activar con:
// const { requireAuth } = require('../../interfaces/middlewares/authMiddleware');
// router.use(requireAuth);

router.get('/',                      ctrl.getThirdParties);
router.get('/:id',                   ctrl.getThirdPartyById);
router.post('/',                     ctrl.createThirdParty);
router.put('/:id',                   ctrl.updateThirdParty);
router.delete('/:id',                ctrl.deleteThirdParty);
router.patch('/:id/toggle',          ctrl.toggleThirdParty);
router.post('/:id/producciones',     ctrl.linkProduccion);

module.exports = router;
