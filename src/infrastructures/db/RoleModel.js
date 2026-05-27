/**
 * RoleController.js
 *
 * Endpoints:
 *   GET    /api/roles                  — Listar (search, estado, paginación)
 *   GET    /api/roles/catalogos        — Módulos con sus privilegios (para el form)
 *   GET    /api/roles/:id              — Detalle de un rol
 *   POST   /api/roles                  — Crear rol
 *   PUT    /api/roles/:id              — Actualizar rol
 *   DELETE /api/roles/:id              — Eliminar (bloquea si tiene usuarios)
 *   PATCH  /api/roles/:id/toggle       — Activar / inactivar
 */


const ModuleRepository   = require('../repositorie/ModuleRepository');
const PrivilegeRepository = require('../repositorie/PrivilegeRepository');
// BUG 5 FIX: importar UserModel para countUsersByRole
const UserModel          = require('../db/UserModel');
const GetRoles           = require('../../application/use-cases/roles/GetRoles');
const GetRoleById        = require('../../application/use-cases/roles/GetRoleById');
const CreateRoles        = require('../../application/use-cases/roles/CreateRoles');
const UpdateRoles        = require('../../application/use-cases/roles/UpdateRoles');
const DeleteRoles        = require('../../application/use-cases/roles/DeleteRoles');
const ToggleRoles        = require('../../application/use-cases/roles/ToggleRoles');
const {
  ok, created, badRequest, notFound, conflict, unprocessable, serverError,
} = require('../../shared/utils/response');

const modRepo  = new ModuleRepository();
const privRepo = new PrivilegeRepository();

// ── GET /api/roles ────────────────────────────────────────────────────────────
const getRoles = async (req, res) => {
  try {
    return ok(res, await new GetRoles(repo).execute(req.query));
  } catch (err) {
    return serverError(res, err.message);
  }
};

// ── GET /api/roles/catalogos ──────────────────────────────────────────────────
// BUG 6 FIX: los privilegios son globales (crear/leer/actualizar/eliminar),
// no están ligados a un módulo específico. Se asignan todos a cada módulo.
const getCatalogos = async (req, res) => {
  try {
    const modulos     = await modRepo.findAll({ estado: true });
    const privilegios = await privRepo.findAll({ estado: true });

    const catalogo = modulos.map((m) => ({
      id:          m.id,
      nombre:      m.nombre,
      // Todos los privilegios aplican a todos los módulos
      privilegios: privilegios.map((p) => ({ id: p.id, nombre: p.nombre })),
    }));

    return ok(res, catalogo);
  } catch (err) {
    return serverError(res, err.message);
  }
};

// ── GET /api/roles/:id/users-count ────────────────────────────────────────────
// BUG 5 FIX: usar UserModel directamente en lugar de userRepo (no definido)
const countUsersByRole = async (req, res) => {
  try {
    const count = await UserModel.countDocuments({ rolId: req.params.id });
    return ok(res, { total: count });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// ── GET /api/roles/:id ────────────────────────────────────────────────────────
const getRoleById = async (req, res) => {
  try {
    return ok(res, await new GetRoleById(repo).execute(req.params.id));
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res, err.message);
  }
};

// ── POST /api/roles ───────────────────────────────────────────────────────────
const createRole = async (req, res) => {
  try {
    return created(res, await new CreateRoles(repo, modRepo, privRepo).execute(req.body));
  } catch (err) {
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 409) return conflict(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res, err.message);
  }
};

// ── PUT /api/roles/:id ────────────────────────────────────────────────────────
const updateRole = async (req, res) => {
  try {
    return ok(res, await new UpdateRoles(repo, modRepo, privRepo).execute(req.params.id, req.body));
  } catch (err) {
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 409) return conflict(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res, err.message);
  }
};

// ── DELETE /api/roles/:id ─────────────────────────────────────────────────────
const deleteRole = async (req, res) => {
  try {
    return ok(res, await new DeleteRoles(repo).execute(req.params.id));
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res, err.message);
  }
};

// ── PATCH /api/roles/:id/toggle ───────────────────────────────────────────────
const toggleRole = async (req, res) => {
  try {
    return ok(res, await new ToggleRoles(repo).execute(req.params.id));
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res, err.message);
  }
};

module.exports = {
  countUsersByRole,
  getRoles,
  getCatalogos,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  toggleRole,
};
