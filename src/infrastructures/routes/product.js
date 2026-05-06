/**
 * productRoutes.js
 *
 * Rutas para Productos
 *
 *  GET    /products                     — Listar productos (filtros + paginación)
 *  GET    /products/:id                 — Obtener producto
 *  POST   /products                     — Crear producto
 *  PUT    /products/:id                 — Actualizar producto
 *  DELETE /products/:id                 — Eliminar producto
 *
 *  PATCH  /products/:id/status          — Activar / desactivar producto
 *
 *  Fichas técnicas:
 *  GET    /products/:id/tecnicas
 *  GET    /products/:id/tecnicas/:techSpecId
 *  POST   /products/:id/tecnicas
 *  PUT    /products/:id/tecnicas/:techSpecId
 *  DELETE /products/:id/tecnicas/:techSpecId
 *
 *  Materiales:
 *  GET    /products/:id/tecnicas/:techSpecId/materiales
 *  GET    /products/:id/tecnicas/:techSpecId/materiales/:materialTechSpecId
 *  POST   /products/:id/tecnicas/:techSpecId/materiales
 *  PUT    /products/:id/tecnicas/:techSpecId/materiales/:materialTechSpecId
 *  DELETE /products/:id/tecnicas/:techSpecId/materiales/:materialTechSpecId
 */

const { Router } = require("express");
const ctrl = require("../controllers/productController");
const { requireAuth } = require("../../interfaces/middlewares/authMiddleware");

const router = Router();

router.use(requireAuth);

// CRUD
router.get("/", ctrl.getProducts);
router.post("/", ctrl.createProduct);
router.get("/:id", ctrl.getProductById);
router.put("/:id", ctrl.updateProduct);
router.delete("/:id", ctrl.deleteProduct);

// ── FICHAS TÉCNICAS ─────────────────────────────
router.get("/:id/tecnicas", ctrl.getTechnicalSpecifications);
router.get("/:id/tecnicas/:techSpecId", ctrl.getTechnicalSpecificationById);
router.post("/:id/tecnicas", ctrl.createTechnicalSpecification);
router.put("/:id/tecnicas/:techSpecId", ctrl.updateTechnicalSpecification);
router.delete("/:id/tecnicas/:techSpecId", ctrl.deleteTechnicalSpecification);

// ── MATERIALES ───────────────────────────────────
router.get("/:id/tecnicas/:techSpecId/materiales", ctrl.getMaterialTechnicalSpecifications);
router.get("/:id/tecnicas/:techSpecId/materiales/:materialTechSpecId", ctrl.getMaterialTechnicalSpecificationById);
router.post("/:id/tecnicas/:techSpecId/materiales", ctrl.createMaterialTechnicalSpecification);
router.put("/:id/tecnicas/:techSpecId/materiales/:materialTechSpecId", ctrl.updateMaterialTechnicalSpecification);
router.delete("/:id/tecnicas/:techSpecId/materiales/:materialTechSpecId", ctrl.deleteMaterialTechnicalSpecification);

module.exports = router;