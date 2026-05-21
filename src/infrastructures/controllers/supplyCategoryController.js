// infrastructures/controllers/supplyCategoryController.js
// Recibe los requests HTTP, delega al use case correspondiente, responde.
// No contiene lógica de negocio — solo traduce HTTP ↔ use cases.

const SupplyCategoryRepository = require('../repositorie/SupplyCategoryRepository');
const SupplyRepository         = require('../repositorie/SupplyRepository');

const GetSupplyCategories    = require('../../application/use-cases/supplyCategories/GetSupplyCategories');
const GetSupplyCategoryById  = require('../../application/use-cases/supplyCategories/GetSupplyCategoryById');
const CreateSupplyCategory   = require('../../application/use-cases/supplyCategories/CreateSupplyCategory');
const UpdateSupplyCategory   = require('../../application/use-cases/supplyCategories/UpdateSupplyCategory');
const DeleteSupplyCategory   = require('../../application/use-cases/supplyCategories/DeleteSupplyCategory');
const ToggleSupplyCategory   = require('../../application/use-cases/supplyCategories/ToggleSupplyCategory');

const {
  ok, created, noContent, badRequest,
  notFound, conflict, unprocessable, serverError,
} = require('../../shared/utils/response');

const categoryRepo = new SupplyCategoryRepository();
const supplyRepo   = new SupplyRepository();

// ── GET /categorias-insumos ────────────────────────────────────────────────────
const getSupplyCategories = async (req, res) => {
  try {
    const result = await new GetSupplyCategories(categoryRepo).execute(req.query);
    return ok(res, result);
  } catch (err) {
    console.error('GetSupplyCategories error:', err);
    return serverError(res, err.message);
  }
};

// ── GET /categorias-insumos/:id ────────────────────────────────────────────────
const getSupplyCategoryById = async (req, res) => {
  try {
    const data = await new GetSupplyCategoryById(categoryRepo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    console.error('GetSupplyCategoryById error:', err);
    return serverError(res, err.message);
  }
};

// ── POST /categorias-insumos ───────────────────────────────────────────────────
const createSupplyCategory = async (req, res) => {
  try {
    const data = await new CreateSupplyCategory(categoryRepo).execute(req.body);
    return created(res, data);
  } catch (err) {
    console.error('CreateSupplyCategory error:', err.message);
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 409) return conflict(res, err.message);
    return serverError(res, err.message);
  }
};

// ── PUT /categorias-insumos/:id ────────────────────────────────────────────────
const updateSupplyCategory = async (req, res) => {
  try {
    const data = await new UpdateSupplyCategory(categoryRepo).execute(req.params.id, req.body);
    return ok(res, data);
  } catch (err) {
    console.error('UpdateSupplyCategory error:', err.message);
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 409) return conflict(res, err.message);
    return serverError(res, err.message);
  }
};

// ── DELETE /categorias-insumos/:id ─────────────────────────────────────────────
const deleteSupplyCategory = async (req, res) => {
  try {
    const data = await new DeleteSupplyCategory(categoryRepo, supplyRepo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    console.error('DeleteSupplyCategory error:', err.message);
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res, err.message);
  }
};

// ── PATCH /categorias-insumos/:id/toggle ──────────────────────────────────────
const toggleSupplyCategory = async (req, res) => {
  try {
    const data = await new ToggleSupplyCategory(categoryRepo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    console.error('ToggleSupplyCategory error:', err.message);
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res, err.message);
  }
};

module.exports = {
  getSupplyCategories,
  getSupplyCategoryById,
  createSupplyCategory,
  updateSupplyCategory,
  deleteSupplyCategory,
  toggleSupplyCategory,
};
