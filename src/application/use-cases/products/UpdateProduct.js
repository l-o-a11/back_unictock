// src/application/use-cases/products/UpdateProduct.js

class UpdateProduct {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id, data) {
    const { name, description, price, stock, category, active } = data;
    
    if (price !== undefined && price < 0) {
      throw new Error('Precio no puede ser negativo');
    }

    if (stock !== undefined && stock < 0) {
      throw new Error('Stock no puede ser negativo');
    }

    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new Error('Producto no encontrado');
    }

    existing.update(data);
    
    return await this.productRepository.update(id, data);
  }
}

module.exports = UpdateProduct;

