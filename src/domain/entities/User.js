// domain/entities/User.js
class User {
    constructor({
        id,
        tipoDocumento,
        numeroDocumento,
        nombreCompleto,
        correo,
        password,
        rolId,
        sedeId,
        estado = true,
    }) {
        this.id = id;
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.nombreCompleto = nombreCompleto;
        this.correo = correo;
        this.password = password;
        this.rolId = rolId;
        this.sedeId = sedeId;
        this.estado = estado;
    }

    // Retorna el usuario sin password (para respuestas al cliente)
    toPublic() {
        const { password, ...safe } = this;
        return safe;
    }

    // Regla de negocio: ¿es el único admin activo?
    isLastActiveAdmin(activeAdminCount) {
        return this.estado === true && activeAdminCount <= 1;
    }
}

module.exports = User;