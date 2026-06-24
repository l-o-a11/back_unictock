// interfaces/middlewares/validationMiddleware.js
const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Datos inválidos',
            detalles: errors.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
        });
    }
    next();
};

const rules = {
    login: [
        body('correo').isEmail().withMessage('Correo inválido').normalizeEmail(),
        body('password').notEmpty().withMessage('Contraseña requerida'),
    ],

    createUser: [
        body('tipoDocumento').isIn(['CC', 'TI']).withMessage('Debe ser CC o TI'),
        body('numeroDocumento')
            .notEmpty().withMessage('Obligatorio')
            .isNumeric().withMessage('Solo números')
            .isLength({ min: 5, max: 15 }).withMessage('Entre 5 y 15 dígitos'),
        body('nombreCompleto')
            .notEmpty().withMessage('Obligatorio')
            .isLength({ min: 3, max: 100 }).withMessage('Entre 3 y 100 caracteres')
            .trim(),
        body('correo').isEmail().withMessage('Correo inválido').normalizeEmail(),
        body('rolId').notEmpty().withMessage('Rol requerido').isMongoId().withMessage('rolId inválido'),
        body('sedeId').notEmpty().withMessage('Sede requerida').isMongoId().withMessage('sedeId inválido'),
        body('rolNombre').optional().isString().withMessage('rolNombre debe ser texto'),
    ],

    updateUser: [
        param('id').isMongoId().withMessage('ID inválido'),
        body('tipoDocumento').optional().isIn(['CC', 'TI']),
        body('numeroDocumento').optional().isNumeric().isLength({ min: 5, max: 15 }),
        body('nombreCompleto').optional().isLength({ min: 3, max: 100 }).trim(),
        body('correo').optional().isEmail().normalizeEmail(),
        body('rolId').optional().isMongoId().withMessage('rolId inválido'),
        body('sedeId').optional().isMongoId().withMessage('sedeId inválido'),
        body('rolNombre').optional().isString(),
    ],

    idParam: [
        param('id').isMongoId().withMessage('ID inválido'),
    ],

    listUsers: [
        query('rolId').optional().isMongoId(),
        query('sedeId').optional().isMongoId(),
        query('estado').optional().isIn(['true', 'false']),
        query('search').optional().isString(),
    ],
};

module.exports = { validate, rules };