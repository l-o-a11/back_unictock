// application/use-cases/users/DeleteUser.js
class DeleteUser {
    constructor(userRepository) { this.repo = userRepository; }

    async execute(id) {
        const user = await this.repo.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.statusCode = 404;
            throw err;
        }

        const activeAdmins = await this.repo.countActiveAdmins();
        if (user.isLastActiveAdmin(activeAdmins)) {
            const err = new Error('No se puede eliminar el único administrador activo');
            err.statusCode = 422;
            throw err;
        }

        await this.repo.delete(id);
        return true;
    }
}

module.exports = DeleteUser;