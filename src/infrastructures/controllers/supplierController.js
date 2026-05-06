// infrastructures/controllers/supplierController.js
const SupplierRepository = require('../repositorie/SupplierRepository');
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

// ── Normaliza el body aceptando camelCase (frontend) y snake_case (backend) ──
// El frontend envía: nombreEmpresa, correoEmpresa, nombreContacto, sitioWeb
// El use-case espera: nombre_de_empresa, correo, nombre_del_contacto, sitio_web
const normalizeBody = (body) => ({
  nit:                 body.nit,
  nombre_de_empresa:   body.nombre_de_empresa   ?? body.nombreEmpresa,
  nombre_del_contacto: body.nombre_del_contacto ?? body.nombreContacto,
  direccion:           body.direccion,
  telefono:            body.telefono,
  correo:              body.correo               ?? body.correoEmpresa,
  sitio_web:           body.sitio_web            ?? body.sitioWeb      ?? null,
  activo:              body.activo,
});

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
    console.log('POST /proveedores body:', JSON.stringify(req.body, null, 2));
    const data = await new CreateSupplier(repo).execute(normalizeBody(req.body));
    console.log('Supplier created:', data);
    return created(res, data);
  } catch (err) {
    console.error('CreateSupplier error:', err);
    console.error('Stack:', err.stack);
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 409) return conflict(res, err.message);
    return serverError(res, err.message || err.toString());
  }
};

// ── PUT /proveedores/:id ──────────────────────────────────────────────────────
const updateSupplier = async (req, res) => {
  try {
    const data = await new UpdateSupplier(repo).execute(req.params.id, normalizeBody(req.body));
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