// application/use-cases/productCategory/GetProductCategories.js

class GetProductCategories {
  constructor(repo) {
    this.repo = repo;
  }

  async execute() {
    return this.repo.findAll();
  }
}

module.exports = GetProductCategories;