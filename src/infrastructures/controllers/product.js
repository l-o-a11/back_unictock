/**
 * productController.js
 *
 * Controlador para Productos (Backend estilo use-cases).
 * Incluye CRUD + toggle + fichas técnicas.
 */

const mongoose           = require("mongoose");
const ProductRepository = require("../repositories/ProductRepository");

// Use Cases
const GetProducts    = require("../../application/use-cases/products/GetProducts");
const GetProductById = require("../../application/use-cases/products/GetProductById");
const CreateProduct  = require("../../application/use-cases/products/CreateProduct");
const UpdateProduct  = require("../../application/use-cases/products/UpdateProduct");
const DeleteProduct  = require("../../application/use-cases/products/DeleteProduct");
const ToggleProduct  = require("../../application/use-cases/products/ToggleProduct");

// Repos fichas técnicas
const TechnicalSpecificationsRepository = require("../repositories/TechnicalSpecificationsRepository");
const MaterialTechnicalSpecificationsRepository = require("../repositories/MaterialTechnicalSpecificationsRepository");

const {
  ok,
  created,
  badRequest,
  notFound,
  unprocessable,
  serverError,
} = require("../../shared/utils/response");

const repo = new ProductRepository();
const techSpecRepo = new TechnicalSpecificationsRepository();
const materialTechSpecRepo = new MaterialTechnicalSpecificationsRepository();

const resolveProduct = async (productIdentifier) => {
  if (!productIdentifier) return null;
  if (mongoose.isValidObjectId(productIdentifier)) {
    const product = await repo.findById(productIdentifier);
    if (product) return product;
  }
  if (typeof productIdentifier === 'string' && productIdentifier.trim()) {
    const product = await repo.findByReference(productIdentifier.trim());
    if (product) return product;
  }
  return null;
};

const resolveProductId = async (productIdentifier) => {
  const product = await resolveProduct(productIdentifier);
  return product?.id ?? null;
};

// ── GET /products ─────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const result = await new GetProducts(repo).execute(req.query);
    return ok(res, result);
  } catch (err) {
    return serverError(res);
  }
};

// ── GET /products/:id ─────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const data = await new GetProductById(repo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res);
  }
};

// ── POST /products ────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const data = await new CreateProduct(repo).execute(req.body);
    return created(res, data);
  } catch (err) {
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 409) return unprocessable(res, err.message);
    return serverError(res);
  }
};

// ── PUT /products/:id ─────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const data = await new UpdateProduct(repo).execute(
      req.params.id,
      req.body
    );
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res);
  }
};

// ── DELETE /products/:id ──────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    await new DeleteProduct(repo).execute(req.params.id);
    return ok(res, {
      message: "Producto eliminado exitosamente",
    });
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res);
  }
};

// ── PATCH /products/:id/status ────────────────────────────────
const toggleProductStatus = async (req, res) => {
  try {
    const data = await new ToggleProduct(repo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res);
  }
};

// ================= FICHAS TÉCNICAS =================

// ── GET /products/:id/tecnicas ─────────────────────
const getTechnicalSpecifications = async (req, res) => {
  try {
    const productId = await resolveProductId(req.params.id);
    if (!productId) return notFound(res, "Producto no encontrado");

    const techSpecs = await techSpecRepo.findByProductId(productId);
    return ok(res, techSpecs);
  } catch (err) {
    return serverError(res);
  }
};

// ── GET /products/:id/tecnicas/:techSpecId ─────────
const getTechnicalSpecificationById = async (req, res) => {
  try {
    const techSpec = await techSpecRepo.findById(
      req.params.techSpecId
    );
    if (!techSpec)
      return notFound(res, "Ficha técnica no encontrada");

    return ok(res, techSpec);
  } catch (err) {
    return serverError(res);
  }
};

// ── POST /products/:id/tecnicas ────────────────────
const createTechnicalSpecification = async (req, res) => {
  try {
    const productId = await resolveProductId(req.params.id);
    if (!productId) return notFound(res, "Producto no encontrado");

    const techSpec = await techSpecRepo.create({
      ...req.body,
      id_producto: productId,
    });

    return created(res, techSpec);
  } catch (err) {
    return serverError(res);
  }
};

// ── PUT /products/:id/tecnicas/:techSpecId ─────────
const updateTechnicalSpecification = async (req, res) => {
  try {
    const updated = await techSpecRepo.update(
      req.params.techSpecId,
      req.body
    );

    return ok(res, updated);
  } catch (err) {
    return serverError(res);
  }
};

// ── DELETE /products/:id/tecnicas/:techSpecId ──────
const deleteTechnicalSpecification = async (req, res) => {
  try {
    await techSpecRepo.delete(req.params.techSpecId);

    return ok(res, {
      message: "Ficha técnica eliminada exitosamente",
    });
  } catch (err) {
    return serverError(res);
  }
};

// ================= MATERIALES =================

// ── GET /products/:id/tecnicas/:techSpecId/materiales ─────────
const getMaterialTechnicalSpecifications = async (req, res) => {
  try {
    const productId = await resolveProductId(req.params.id);
    if (!productId) return notFound(res, "Producto no encontrado");

    const materialTechSpecs = await materialTechSpecRepo.findAll({
      id_producto: productId,
    });

    return ok(res, materialTechSpecs);
  } catch (err) {
    return serverError(res);
  }
};

// ── GET /products/:id/tecnicas/:techSpecId/materiales/:id ─────
const getMaterialTechnicalSpecificationById = async (req, res) => {
  try {
    const materialTechSpec = await materialTechSpecRepo.findById(
      req.params.materialTechSpecId
    );

    if (!materialTechSpec)
      return notFound(
        res,
        "Especificación técnica del material no encontrada"
      );

    return ok(res, materialTechSpec);
  } catch (err) {
    return serverError(res);
  }
};

// ── POST /products/:id/tecnicas/:techSpecId/materiales ────────
const createMaterialTechnicalSpecification = async (req, res) => {
  try {
    const productId = await resolveProductId(req.params.id);
    if (!productId) return notFound(res, "Producto no encontrado");

    const materialTechSpec = await materialTechSpecRepo.create({
      ...req.body,
      id_producto: productId,
    });

    return created(res, materialTechSpec);
  } catch (err) {
    return serverError(res);
  }
};

// ── PUT /products/:id/tecnicas/:techSpecId/materiales/:id ─────
const updateMaterialTechnicalSpecification = async (req, res) => {
  try {
    const updated = await materialTechSpecRepo.update(
      req.params.materialTechSpecId,
      req.body
    );

    return ok(res, updated);
  } catch (err) {
    return serverError(res);
  }
};

// ── DELETE /products/:id/tecnicas/:techSpecId/materiales/:id ──
const deleteMaterialTechnicalSpecification = async (req, res) => {
  try {
    await materialTechSpecRepo.delete(
      req.params.materialTechSpecId
    );

    return ok(res, {
      message:
        "Material de la ficha técnica eliminado exitosamente",
    });
  } catch (err) {
    return serverError(res);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,

  getTechnicalSpecifications,
  getTechnicalSpecificationById,
  createTechnicalSpecification,
  updateTechnicalSpecification,
  deleteTechnicalSpecification,

  getMaterialTechnicalSpecifications,
  getMaterialTechnicalSpecificationById,
  createMaterialTechnicalSpecification,
  updateMaterialTechnicalSpecification,
  deleteMaterialTechnicalSpecification,
};