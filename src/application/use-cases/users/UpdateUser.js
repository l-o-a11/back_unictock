// application/use-cases/users/UpdateUser.js
class UpdateUser {
    constructor(userRepository) { this.repo = userRepository; }

    async execute(id, data) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            const err = new Error('Usuario no encontrado');
            err.statusCode = 404;
            throw err;
        }

        const { tipoDocumento, numeroDocumento, nombreCompleto, correo, rolId, sedeId } = data;

        // Verificar unicidad de correo (excluyendo el propio)
        if (correo && correo !== existing.correo) {
            const byEmail = await this.repo.findByEmail(correo);
            if (byEmail && byEmail.id !== id) {
                const err = new Error('Ya existe otro usuario con ese correo');
                err.statusCode = 409;
                throw err;
            }
        }

        // Verificar unicidad de documento (excluyendo el propio)
        if (numeroDocumento && numeroDocumento !== existing.numeroDocumento) {
            const byDoc = await this.repo.findByDocument(numeroDocumento);
            if (byDoc && byDoc.id !== id) {
                const err = new Error('Ya existe otro usuario con ese número de documento');
                err.statusCode = 409;
                throw err;
            }
        }

        const changes = {};
        if (tipoDocumento) changes.tipoDocumento = tipoDocumento;
        if (numeroDocumento) changes.numeroDocumento = numeroDocumento;
        if (nombreCompleto) changes.nombreCompleto = nombreCompleto.trim();
        if (correo) changes.correo = correo;
        if (rolId) changes.rolId = rolId;
        if (sedeId) changes.sedeId = sedeId;

        const updated = await this.repo.update(id, changes);
        return updated.toPublic();
    }
}

module.exports = UpdateUser;