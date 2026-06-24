// application/use-cases/users/GetUserById.js
class GetUserById {
    constructor(userRepository) { this.repo = userRepository; }

    async execute(id) {
        const user = await this.repo.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.statusCode = 404;
            throw err;
        }
        return user.toPublic();
    }
}

module.exports = GetUserById;