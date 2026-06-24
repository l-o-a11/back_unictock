// application/use-cases/users/LoginUser.js
const { compare } = require('../../../infrastructures/security/password_encrypter');
const { generateToken } = require('../../../infrastructures/security/token_generator');

class LoginUser {
    constructor(userRepository) {
        this.repo = userRepository;
    }

    async execute({ correo, password }) {
        const user = await this.repo.findByEmail(correo);

        if (!user || !user.estado) {
            const err = new Error('Credenciales inválidas');
            err.statusCode = 401;
            throw err;
        }

        const match = await compare(password, user.password);
        if (!match) {
            const err = new Error('Credenciales inválidas');
            err.statusCode = 401;
            throw err;
        }

        // rolNombre lo guardamos en el token cuando se crea el usuario.
        // Si no existe en el documento, queda null — se puede agregar después
        // cuando el módulo de roles de tus compañeras esté listo.
        const token = generateToken({
            id: user.id,
            correo: user.correo,
            rolId: user.rolId,
            sedeId: user.sedeId,
            rolNombre: user.rolNombre ?? null,
            nombreCompleto: user.nombreCompleto,
        });

        return { token, user: user.toPublic() };
    }
}

module.exports = LoginUser;