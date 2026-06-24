
class ToggleThirdParty {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(id) {
    // Verificar existencia para manejar 404 consistente
    const tercero = await this.repo.findById(id);
    if (!tercero) {
      const err = new Error('Tercero no encontrado');
      err.statusCode = 404;
      throw err;
    }

    const updated = await this.repo.toggleEstado(id);
    return updated;
  }
}

module.exports = ToggleThirdParty;

