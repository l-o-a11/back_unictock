/**
 * roleRoutes.js
 *
 *  GET    /api/roles                  — Listar roles (search, estado, paginación)
 *  GET    /api/roles/catalogos        — Módulos y privilegios disponibles
 *  GET    /api/roles/:id              — Detalle de un rol
 *  POST   /api/roles                  — Crear rol
 *  PUT    /api/roles/:id              — Actualizar rol
 *  DELETE /api/roles/:id              — Eliminar rol
 *  PATCH  /api/roles/:id/toggle       — Activar / inactivar rol
 */

const { Router }     = require('express');
const ctrl           = require('../controllers/RoleController');
const { requireAuth } = require('../../interfaces/middlewares/authMiddleware');

const router = Router();
// router.use(requireAuth);   // descomentar cuando el auth esté listo en producción

// ⚠️ /catalogos DEBE ir antes de /:id para no ser capturado como param
router.get('/catalogos',        ctrl.getCatalogos);

router.get("/:id/users-count", ctrl.countUsersByRole);

router.get('/',                 ctrl.getRoles);
router.get('/:id',              ctrl.getRoleById);
router.post('/',                ctrl.createRole);
router.put('/:id',              ctrl.updateRole);
router.delete('/:id',           ctrl.deleteRole);
router.patch('/:id/toggle',     ctrl.toggleRole);

module.exports = router;
