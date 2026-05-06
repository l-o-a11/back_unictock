// src/application/use-cases/products/GetProducts.js

class GetProducts {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(params = {}) {
    return await this.productRepository.findAll(params);
  }
}

module.exports = GetProducts;

