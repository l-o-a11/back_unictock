// application/use-cases/thirdParties/GetThirdPartyById.js
class GetThirdPartyById {
  constructor(repo) { this.repo = repo; }
  async execute(id) {
    const tercero = await this.repo.findById(id);
    if (!tercero) {
      const err = new Error('Tercero no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return tercero;
  }
}
module.exports = GetThirdPartyById;
