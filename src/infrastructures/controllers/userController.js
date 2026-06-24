const UserRepository = require('../repositorie/UserRepository');
const LoginUser = require('../../application/use-cases/users/LoginUser');
const CreateUser = require('../../application/use-cases/users/CreateUser');
const GetUser = require('../../application/use-cases/users/GetUser');
const GetUserById = require('../../application/use-cases/users/GetUserById');
const UpdateUser = require('../../application/use-cases/users/UpdateUser');
const DeleteUser = require('../../application/use-cases/users/DeleteUser');

const {
    ok, created, noContent, notFound,
    conflict, forbidden, unprocessable, serverError,
} = require('../../shared/utils/response');

const repo = new UserRepository();

const login = async (req, res) => {
    try {
        const result = await new LoginUser(repo).execute(req.body);
        return ok(res, result);
    } catch (err) {
        if (err.statusCode === 401) return res.status(401).json({ success: false, error: err.message });
        if (err.statusCode === 403) return forbidden(res, err.message);
        return serverError(res, err.message);
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await new GetUser(repo).execute(req.query);
        return ok(res, users);
    } catch (err) {
        return serverError(res, err.message);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await new GetUserById(repo).execute(req.params.id);
        return ok(res, user);
    } catch (err) {
        if (err.statusCode === 404) return notFound(res, err.message);
        return serverError(res, err.message);
    }
};

const createUser = async (req, res) => {
    try {
        const user = await new CreateUser(repo).execute(req.body, req.user);
        return created(res, user);
    } catch (err) {
        if (err.statusCode === 409) return conflict(res, err.message);
        if (err.statusCode === 403) return forbidden(res, err.message);
        return serverError(res, err.message);
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await new UpdateUser(repo).execute(req.params.id, req.body);
        return ok(res, user);
    } catch (err) {
        if (err.statusCode === 404) return notFound(res, err.message);
        if (err.statusCode === 409) return conflict(res, err.message);
        return serverError(res, err.message);
    }
};

const toggleStatus = async (req, res) => {
    try {
        const user = await repo.findById(req.params.id);
        if (!user) return notFound(res, 'Usuario no encontrado');

        const activeAdmins = await repo.countActiveAdmins();
        if (!req.body.estado && user.isLastActiveAdmin(activeAdmins)) {
            return unprocessable(res, 'No se puede desactivar el único administrador activo');
        }

        const updated = await repo.update(req.params.id, { estado: !user.estado });
        return ok(res, updated.toPublic());
    } catch (err) {
        return serverError(res, err.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        await new DeleteUser(repo).execute(req.params.id);
        return noContent(res);
    } catch (err) {
        if (err.statusCode === 404) return notFound(res, err.message);
        if (err.statusCode === 422) return unprocessable(res, err.message);
        return serverError(res, err.message);
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await repo.findAllRoles();
        return ok(res, roles);
    } catch (err) {
        return serverError(res, err.message);
    }
};

const getSites = async (req, res) => {
    try {
        const sites = await repo.findAllSites();
        return ok(res, sites);
    } catch (err) {
        return serverError(res, err.message);
    }
};

module.exports = {
    login, getUsers, getUserById, createUser,
    updateUser, toggleStatus, deleteUser,
    getRoles, getSites,
};