// src/application/use-cases/products/CreateProduct.js

class CreateProduct {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(data) {
    const { name, description, price, stock, category } = data;
    
    if (!name || !price) {
      throw new Error('Nombre y precio son requeridos');
    }

    if (price < 0) {
      throw new Error('Precio no puede ser negativo');
    }

    return await this.productRepository.create({
      name,
      description,
      price,
      stock: stock || 0,
      category: category || 'General'
    });
  }
}

module.exports = CreateProduct;

