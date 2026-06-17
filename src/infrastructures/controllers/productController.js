// src/infrastructures/controllers/productController.js — UNIFICADO

const mongoose = require("mongoose");
const ProductRepository            = require("../repositorie/ProductRepository");
const TechnicalSheetRepository     = require("../repositorie/TechnicalSheetRepository");
const MaterialTechnicalSpecificationsRepository = require("../repositorie/MaterialTechnicalSpecificationsRepository");
const ProductCategoryRepository    = require("../repositorie/ProductCategoryRepository");

const GetProducts        = require("../../application/use-cases/products/GetProducts");
const GetProductById     = require("../../application/use-cases/products/GetProductById");
const CreateProduct      = require("../../application/use-cases/products/CreateProduct");
const UpdateProduct      = require("../../application/use-cases/products/UpdateProduct");
const DeleteProduct      = require("../../application/use-cases/products/DeleteProduct");
const ToggleProduct      = require("../../application/use-cases/products/ToggleProduct");
const GetTechnicalSheets   = require("../../application/use-cases/products/GetTechnicalSheets");
const CreateTechnicalSheet = require("../../application/use-cases/products/CreateTechnicalSheet");

const { ok, created, badRequest, notFound, unprocessable, serverError } =
  require("../../shared/utils/response");

const repo             = new ProductRepository();
const techRepo         = new TechnicalSheetRepository();
const materialTechRepo = new MaterialTechnicalSpecificationsRepository();
const categoryRepo     = new ProductCategoryRepository();

// ── Helpers ───────────────────────────────────────────────────
const resolveProduct = async (id) => {
  if (!id) return null;
  if (mongoose.isValidObjectId(id)) {
    const p = await repo.findById(id);
    if (p) return p;
  }
  if (typeof id === 'string' && id.trim()) {
    return repo.findByReference(id.trim());
  }
  return null;
};

const resolveProductId = async (id) => {
  const p = await resolveProduct(id);
  return p?.id ?? null;
};

// ── Productos ─────────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    return ok(res, await new GetProducts(repo).execute(req.query));
  } catch (err) {
    return serverError(res);
  }
};

const getProductById = async (req, res) => {
  try {
    return ok(res, await new GetProductById(repo).execute(req.params.id));
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res);
  }
};

const createProduct = async (req, res) => {
  try {
    return created(res, await new CreateProduct(repo, categoryRepo).execute(req.body));
  } catch (err) {
    console.error('[createProduct] ERROR:', err);
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 409) return conflict(res, err.message);
    return serverError(res, err.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    return ok(res, await new UpdateProduct(repo, categoryRepo).execute(req.params.id, req.body));
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    await new DeleteProduct(repo).execute(req.params.id);
    return ok(res, { message: "Producto eliminado exitosamente" });
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res);
  }
};

const toggleProductStatus = async (req, res) => {
  try {
    return ok(res, await new ToggleProduct(repo).execute(req.params.id));
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res);
  }
};

// ── Fichas técnicas ───────────────────────────────────────────
const getTechnicalSheets = async (req, res) => {
  try {
    const sheets = await new GetTechnicalSheets(techRepo).execute(req.params.id);
    return ok(res, sheets);
  } catch (err) {
    if (err.statusCode === 400) return badRequest(res, err.message);
    return serverError(res);
  }
};

const getTechnicalSheetById = async (req, res) => {
  try {
    const id = req.params.sheetId ?? req.params.techSpecId;
    const sheet = await techRepo.findById(id);
    if (!sheet) return notFound(res, "Ficha técnica no encontrada");
    return ok(res, sheet);
  } catch (err) {
    return serverError(res);
  }
};

const createTechnicalSheet = async (req, res) => {
  try {
    const productId = await resolveProductId(req.params.id);
    if (!productId) return notFound(res, "Producto no encontrado");
    const sheet = await new CreateTechnicalSheet(techRepo).execute(productId, req.body);
    return created(res, sheet);
  } catch (err) {
    if (err.statusCode === 400) return badRequest(res, err.message);
    return serverError(res);
  }
};

const updateTechnicalSheet = async (req, res) => {
  try {
    const id = req.params.sheetId ?? req.params.techSpecId;
    const sheet = await techRepo.update(id, req.body);
    if (!sheet) return notFound(res, "Ficha técnica no encontrada");
    return ok(res, sheet);
  } catch (err) {
    return serverError(res);
  }
};

const deleteTechnicalSheet = async (req, res) => {
  try {
    const id = req.params.sheetId ?? req.params.techSpecId;
    const deleted = await techRepo.delete(id);
    if (!deleted) return notFound(res, "Ficha técnica no encontrada");
    return ok(res, { message: "Ficha técnica eliminada exitosamente" });
  } catch (err) {
    return serverError(res);
  }
};

// ── Materiales ────────────────────────────────────────────────
const getMaterialTechnicalSpecifications = async (req, res) => {
  try {
    const productId = await resolveProductId(req.params.id);
    if (!productId) return notFound(res, "Producto no encontrado");
    return ok(res, await materialTechRepo.findAll({ id_producto: productId }));
  } catch (err) {
    return serverError(res);
  }
};

const getMaterialTechnicalSpecificationById = async (req, res) => {
  try {
    const material = await materialTechRepo.findById(req.params.materialId ?? req.params.materialTechSpecId);
    if (!material) return notFound(res, "Material no encontrado");
    return ok(res, material);
  } catch (err) {
    return serverError(res);
  }
};

const createMaterialTechnicalSpecification = async (req, res) => {
  try {
    const productId = await resolveProductId(req.params.id);
    if (!productId) return notFound(res, "Producto no encontrado");
    return created(res, await materialTechRepo.create({ ...req.body, id_producto: productId }));
  } catch (err) {
    return serverError(res);
  }
};

const updateMaterialTechnicalSpecification = async (req, res) => {
  try {
    const id = req.params.materialId ?? req.params.materialTechSpecId;
    return ok(res, await materialTechRepo.update(id, req.body));
  } catch (err) {
    return serverError(res);
  }
};

const deleteMaterialTechnicalSpecification = async (req, res) => {
  try {
    const id = req.params.materialId ?? req.params.materialTechSpecId;
    await materialTechRepo.delete(id);
    return ok(res, { message: "Material eliminado exitosamente" });
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
  getTechnicalSheets,
  getTechnicalSheetById,
  createTechnicalSheet,
  updateTechnicalSheet,
  deleteTechnicalSheet,
  getMaterialTechnicalSpecifications,
  getMaterialTechnicalSpecificationById,
  createMaterialTechnicalSpecification,
  updateMaterialTechnicalSpecification,
  deleteMaterialTechnicalSpecification,
};