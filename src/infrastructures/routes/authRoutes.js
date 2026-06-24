// infrastructures/routes/authRoutes.js
const { Router } = require('express');
const { login } = require('../controllers/userController');
const { validate, rules } = require('../../interfaces/middlewares/validationMiddleware');

const router = Router();

// POST /api/auth/login
router.post('/login', rules.login, validate, login);

module.exports = router;