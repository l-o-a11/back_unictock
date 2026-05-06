// src/domain/entities/Product.js

class Product {
  constructor({
    id,
    name,
    description = '',
    price,
    stock = 0,
    category = 'General',
    active = true,
    createdAt,
    updatedAt
  } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.active = active;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
  }

  update(data) {
    const { name, description, price, stock, category, active } = data;
    if (name !== undefined) this.name = name;
    if (description !== undefined) this.description = description;
    if (price !== undefined) this.price = price;
    if (stock !== undefined) this.stock = stock;
    if (category !== undefined) this.category = category;
    if (active !== undefined) this.active = active;
    this.updatedAt = new Date();
  }
}

module.exports = Product;

