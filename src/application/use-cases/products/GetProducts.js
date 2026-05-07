
// application/use-cases/products/GetProducts.js

class GetProducts {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(query) {
    return this.repo.findAll(query);
  }
}

module.exports = GetProducts;
