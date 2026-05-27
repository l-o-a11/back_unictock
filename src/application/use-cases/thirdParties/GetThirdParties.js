// application/use-cases/thirdParties/GetThirdParties.js
class GetThirdParties {
  constructor(repo) { this.repo = repo; }
  async execute(filters = {}) {
    return this.repo.findAll(filters);
  }
}
module.exports = GetThirdParties;
