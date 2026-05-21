// infrastructures/routes/siteRoutes.js
//
//  GET    /sitios                  — Lista con filtros + paginación
//    ?search=     busca en nombre, ciudad, barrio y direccion
//    ?telefono=   coincidencia exacta de teléfono
//    ?estado=     "true" | "false"
//    ?page=       número de página (default 1)
//    ?limit=      registros por página (default 10, max 100)
//    ?sortBy=     campo (default "nombre")
//    ?order=      "asc" | "desc"
//
//  GET    /sitios/:id              — Detalle de un sitio
//  POST   /sitios                  — Crear sitio
//  PUT    /sitios/:id              — Editar sitio
//  DELETE /sitios/:id              — Eliminar
//  PATCH  /sitios/:id/toggle       — Activar / Inactivar

const { Router }      = require('express');
const ctrl            = require('../controllers/siteController');
const { requireAuth } = require('../../interfaces/middlewares/authMiddleware');

const router = Router();

// FIX #7: requireAuth estaba comentado → rutas completamente abiertas sin auth
router.use(requireAuth);

router.get('/',              ctrl.getSites);
router.get('/:id',           ctrl.getSiteById);
router.post('/',             ctrl.createSite);
router.put('/:id',           ctrl.updateSite);
router.delete('/:id',        ctrl.deleteSite);
router.patch('/:id/toggle',  ctrl.toggleSite);

module.exports = router;
