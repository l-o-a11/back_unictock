/**
 * productCategoryController.js
 *
 * Controlador para Categorías de Productos (Backend estilo use-cases).
 * Adaptado a la arquitectura de production/terceros.
 *
 * @author Unistock Team
 */

const ProductCategoryRepository = require("../repositories/ProductCategoryRepository");

// Use Cases
const GetProductCategories     = require("../../application/use-cases/productCategory/GetProductCategories");
const GetProductCategoryById   = require("../../application/use-cases/productCategory/GetProductCategoryById");
const CreateProductCategory    = require("../../application/use-cases/productCategory/CreateProductCategory");
const UpdateProductCategory    = require("../../application/use-cases/productCategory/UpdateProductCategory");
const DeleteProductCategory    = require("../../application/use-cases/productCategory/DeleteProductCategory");

// (Opcional para validación de eliminación)
const ProductRepository = require("../repositories/ProductRepository");

const {
  ok,
  created,
  badRequest,
  notFound,
  unprocessable,
  serverError,
} = require("../../shared/utils/response");

const repo = new ProductCategoryRepository();
const productRepo = new ProductRepository();

// ── GET /product-categories ─────────────────────────────────────────────
const getProductCategories = async (req, res) => {
  try {
    const result = await new GetProductCategories(repo).execute(req.query);
    return ok(res, result);
  } catch (err) {
    return serverError(res);
  }
};

// ── GET /product-categories/:id ─────────────────────────────────────────
const getProductCategoryById = async (req, res) => {
  try {
    const data = await new GetProductCategoryById(repo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res);
  }
};

// ── POST /product-categories ────────────────────────────────────────────
const createProductCategory = async (req, res) => {
  try {
    const data = await new CreateProductCategory(repo).execute(req.body);
    return created(res, data);
  } catch (err) {
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 409) return unprocessable(res, err.message);
    return serverError(res);
  }
};

// ── PUT /product-categories/:id ─────────────────────────────────────────
const updateProductCategory = async (req, res) => {
  try {
    const data = await new UpdateProductCategory(repo).execute(
      req.params.id,
      req.body
    );
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 409) return unprocessable(res, err.message);
    return serverError(res);
  }
};

// ── DELETE /product-categories/:id ──────────────────────────────────────
const deleteProductCategory = async (req, res) => {
  try {
    await new DeleteProductCategory(repo, productRepo).execute(req.params.id);
    return ok(res, {
      message: "Categoría de producto eliminada exitosamente",
    });
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res);
  }
};

module.exports = {
  getProductCategories,
  getProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
};