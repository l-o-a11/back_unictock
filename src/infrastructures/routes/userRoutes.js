// infrastructures/routes/userRoutes.js
const { Router } = require('express');
const ctrl = require('../controllers/userController');
const { requireAuth, requireRole } = require('../../interfaces/middlewares/authMiddleware');
const { validate, rules } = require('../../interfaces/middlewares/validationMiddleware');

const router = Router();

// Todas las rutas de usuarios requieren autenticación
router.use(requireAuth);

// Catálogos (sin restricción de rol, solo autenticado)
router.get('/roles', ctrl.getRoles);
router.get('/sedes', ctrl.getSites);

// Solo Gerente y Administrador
router.get('/', rules.listUsers, validate, requireRole('Gerente', 'Administrador'), ctrl.getUsers);
router.get('/:id', rules.idParam, validate, requireRole('Gerente', 'Administrador'), ctrl.getUserById);

router.post('/',
    requireRole('Gerente', 'Administrador'),
    rules.createUser, validate,
    ctrl.createUser
);

router.put('/:id',
    requireRole('Gerente', 'Administrador'),
    rules.updateUser, validate,
    ctrl.updateUser
);

router.patch('/:id/status',
    requireRole('Gerente', 'Administrador'),
    rules.idParam, validate,
    ctrl.toggleStatus
);

router.delete('/:id',
    requireRole('Gerente', 'Administrador'),
    rules.idParam, validate,
    ctrl.deleteUser
);

module.exports = router;