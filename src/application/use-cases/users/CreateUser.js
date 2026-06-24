// application/use-cases/users/CreateUser.js
const { hash } = require('../../../infrastructures/security/password_encrypter');

const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    return Array.from({ length: 10 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('');
};

class CreateUser {
    constructor(userRepository) {
        this.repo = userRepository;
    }

    async execute(data, createdBy) {
        const {
            tipoDocumento, numeroDocumento, nombreCompleto,
            correo, rolId, sedeId, rolNombre,
        } = data;

        // Un Administrador solo puede crear usuarios de su propia sede
        if (createdBy.rolNombre?.toLowerCase() === 'administrador' &&
            createdBy.sedeId?.toString() !== sedeId?.toString()) {
            const err = new Error('Solo puedes crear usuarios de tu sede');
            err.statusCode = 403;
            throw err;
        }

        if (await this.repo.findByEmail(correo)) {
            const err = new Error('Ya existe un usuario con ese correo');
            err.statusCode = 409;
            throw err;
        }

        if (await this.repo.findByDocument(numeroDocumento)) {
            const err = new Error('Ya existe un usuario con ese número de documento');
            err.statusCode = 409;
            throw err;
        }

        const plainPassword = generatePassword();
        const hashedPassword = await hash(plainPassword);

        const user = await this.repo.save({
            tipoDocumento,
            numeroDocumento,
            nombreCompleto: nombreCompleto.trim(),
            correo,
            password: hashedPassword,
            rolId,
            sedeId,
            rolNombre: rolNombre ?? null, // se guarda para no depender de joins
            estado: true,
        });

        // Aquí podrías enviar correo con la contraseña generada
        console.log(`[CreateUser] Contraseña para ${correo}: ${plainPassword}`);

        return user.toPublic();
    }
}

module.exports = CreateUser;