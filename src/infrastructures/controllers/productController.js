// src/infrastructures/controllers/productController.js

const ProductRepository        = require('../repositorie/ProductRepository');
const TechnicalSheetRepository = require('../repositorie/TechnicalSheetRepository');
const GetProducts              = require('../../application/use-cases/products/GetProducts');
const GetProductById           = require('../../application/use-cases/products/GetProductById');
const CreateProduct            = require('../../application/use-cases/products/CreateProduct');
const UpdateProduct            = require('../../application/use-cases/products/UpdateProduct');
const DeleteProduct            = require('../../application/use-cases/products/DeleteProduct');
const GetTechnicalSheets       = require('../../application/use-cases/products/GetTechnicalSheets');
const CreateTechnicalSheet     = require('../../application/use-cases/products/CreateTechnicalSheet');

const { ok, created, badRequest, notFound, serverError } = require('../../shared/utils/response');

const repo     = new ProductRepository();
const techRepo = new TechnicalSheetRepository();

const getProducts = async (req, res) => {
  try {
    const result = await new GetProducts(repo).execute(req.query);
    return require('../../shared/utils/response').ok(res, result);
  } catch (error) {
    return require('../../shared/utils/response').badRequest(res, error.message);
  }
};

const getProductById = async (req, res) => {
  try {
    const data = await new GetProductById(repo).execute(req.params.id);
    return require('../../shared/utils/response').ok(res, data);
  } catch (error) {
    return require('../../shared/utils/response').notFound(res, error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const data = await new CreateProduct(repo).execute(req.body);
    return require('../../shared/utils/response').created(res, data);
  } catch (error) {
    return require('../../shared/utils/response').badRequest(res, error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const data = await new UpdateProduct(repo).execute(req.params.id, req.body);
    return require('../../shared/utils/response').ok(res, data);
  } catch (error) {
    return require('../../shared/utils/response').badRequest(res, error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    await new DeleteProduct(repo).execute(req.params.id);
    return require('../../shared/utils/response').ok(res, { message: 'Producto eliminado' });
  } catch (error) {
    return require('../../shared/utils/response').notFound(res, error.message);
  }
};

// ── Fichas Técnicas ───────────────────────────────────────────────────────────

/**
 * GET /api/products/:id/technical-sheets
 * Lista todas las versiones de fichas técnicas de un producto.
 */
const getTechnicalSheets = async (req, res) => {
  try {
    const sheets = await new GetTechnicalSheets(techRepo).execute(req.params.id);
    return ok(res, sheets);
  } catch (error) {
    if (error.statusCode === 400) return badRequest(res, error.message);
    return serverError(res);
  }
};

/**
 * GET /api/products/:id/technical-sheets/:sheetId
 * Obtiene una ficha técnica específica por ID.
 */
const getTechnicalSheetById = async (req, res) => {
  try {
    const sheet = await techRepo.findById(req.params.sheetId);
    if (!sheet) return notFound(res, 'Ficha técnica no encontrada');
    return ok(res, sheet);
  } catch (error) {
    return serverError(res);
  }
};

/**
 * POST /api/products/:id/technical-sheets
 * Crea una nueva ficha técnica para el producto.
 */
const createTechnicalSheet = async (req, res) => {
  try {
    const sheet = await new CreateTechnicalSheet(techRepo).execute(req.params.id, req.body);
    return created(res, sheet);
  } catch (error) {
    if (error.statusCode === 400) return badRequest(res, error.message);
    return serverError(res);
  }
};

/**
 * PUT /api/products/:id/technical-sheets/:sheetId
 * Actualiza una ficha técnica.
 */
const updateTechnicalSheet = async (req, res) => {
  try {
    const sheet = await techRepo.update(req.params.sheetId, req.body);
    if (!sheet) return notFound(res, 'Ficha técnica no encontrada');
    return ok(res, sheet);
  } catch (error) {
    return serverError(res);
  }
};

/**
 * DELETE /api/products/:id/technical-sheets/:sheetId
 * Elimina una ficha técnica.
 */
const deleteTechnicalSheet = async (req, res) => {
  try {
    const deleted = await techRepo.delete(req.params.sheetId);
    if (!deleted) return notFound(res, 'Ficha técnica no encontrada');
    return ok(res, { message: 'Ficha técnica eliminada' });
  } catch (error) {
    return serverError(res);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTechnicalSheets,
  getTechnicalSheetById,
  createTechnicalSheet,
  updateTechnicalSheet,
  deleteTechnicalSheet,
};

