// infrastructure/controllers/supplierController.js
const SupplierRepository = require('../repositories/SupplierRepository');
const GetSuppliers       = require('../../application/use-cases/suppliers/GetSuppliers');
const GetSupplierById    = require('../../application/use-cases/suppliers/GetSupplierById');
const CreateSupplier     = require('../../application/use-cases/suppliers/CreateSupplier');
const UpdateSupplier     = require('../../application/use-cases/suppliers/UpdateSupplier');
const DeleteSupplier     = require('../../application/use-cases/suppliers/DeleteSupplier');
const ToggleSupplier     = require('../../application/use-cases/suppliers/ToggleSupplier');
const {
  ok, created, badRequest, notFound, conflict, unprocessable, serverError,
} = require('../../shared/utils/response');

const repo = new SupplierRepository();

// ── GET /proveedores ──────────────────────────────────────────────────────────
// Query params: search, nit, activo, page, limit, sortBy, order
const getSuppliers = async (req, res) => {
  try {
    const result = await new GetSuppliers(repo).execute(req.query);
    return ok(res, result);
  } catch (err) {
    return serverError(res);
  }
};

// ── GET /proveedores/:id ──────────────────────────────────────────────────────
const getSupplierById = async (req, res) => {
  try {
    const data = await new GetSupplierById(repo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res);
  }
};

// ── POST /proveedores ─────────────────────────────────────────────────────────
const createSupplier = async (req, res) => {
  try {
    const data = await new CreateSupplier(repo).execute(req.body);
    return created(res, data);
  } catch (err) {
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 409) return conflict(res, err.message);
    return serverError(res);
  }
};

// ── PUT /proveedores/:id ──────────────────────────────────────────────────────
const updateSupplier = async (req, res) => {
  try {
    const data = await new UpdateSupplier(repo).execute(req.params.id, req.body);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 409) return conflict(res, err.message);
    return serverError(res);
  }
};

// ── DELETE /proveedores/:id ───────────────────────────────────────────────────
const deleteSupplier = async (req, res) => {
  try {
    const data = await new DeleteSupplier(repo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404)  return notFound(res, err.message);
    if (err.statusCode === 422)  return unprocessable(res, err.message);
    return serverError(res);
  }
};

// ── PATCH /proveedores/:id/toggle ─────────────────────────────────────────────
const toggleSupplier = async (req, res) => {
  try {
    const data = await new ToggleSupplier(repo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res);
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  toggleSupplier,
};
