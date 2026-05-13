/**
 * productCategoryRoutes.js
 *
 * Rutas para Categorías de Productos
 *
 *  GET    /product-categories        — Listar categorías
 *  GET    /product-categories/:id    — Obtener categoría
 *  POST   /product-categories        — Crear categoría
 *  PUT    /product-categories/:id    — Actualizar categoría
 *  DELETE /product-categories/:id    — Eliminar categoría
 */

const { Router } = require("express");
const ctrl = require("../controllers/productCategory");
const { requireAuth } = require("../../interfaces/middlewares/authMiddleware");

const router = Router();

router.use(requireAuth);

// CRUD
router.get("/", ctrl.getProductCategories);
router.get("/:id", ctrl.getProductCategoryById);
router.post("/", ctrl.createProductCategory);
router.put("/:id", ctrl.updateProductCategory);
router.delete("/:id", ctrl.deleteProductCategory);

module.exports = router;