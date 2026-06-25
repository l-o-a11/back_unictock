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
const ctrl = require("../controllers/productCategoryController");
const { requireAuth } = require("../../interfaces/middlewares/authMiddleware");

const router = Router();

// 🔥 DEBUG - Primer middleware
router.use((req, res, next) => {
  console.log('\n🔥 [ROUTE] Llamada a productCategoryRoutes');
  console.log('🔥 Método:', req.method);
  console.log('🔥 URL:', req.url);
  console.log('🔥 Body:', req.body);
  next();
});

router.use(requireAuth);

// CRUD
router.get("/", ctrl.getProductCategories);
router.get("/:id", ctrl.getProductCategoryById);
router.post("/", ctrl.createProductCategory);
router.put("/:id", ctrl.updateProductCategory);
router.delete("/:id", ctrl.deleteProductCategory);

module.exports = router;