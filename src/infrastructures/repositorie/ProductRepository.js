// src/infrastructures/repositorie/ProductRepository.js
const ProductModel = require('../db/ProductModel');
const Product = require('../../domain/entities/Product');

class ProductRepository {
  _toEntity(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return new Product({
      ...obj,
      id: obj._id.toString(),
      id_categoria: obj.id_categoria?.toString?.() ?? obj.id_categoria,
    });
  }

  async findAll({ page = 1, limit = 100, search = '', estado, active, sortBy = 'createdAt', order = 'desc' } = {}) {
    const limitNum = Math.min(parseInt(limit) || 100, 100);
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const skipNum = (pageNum - 1) * limitNum;
    const sortDir = order === 'asc' ? 1 : -1;

    const query = {};
    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { referencia: { $regex: search, $options: 'i' } },
      ];
    }

    const stateFilter = estado ?? active;
    if (stateFilter !== undefined) {
      query.estado = stateFilter === true || stateFilter === 'true';
    }

    const [docs, total] = await Promise.all([
      ProductModel.find(query)
        .sort({ [sortBy]: sortDir })
        .limit(limitNum)
        .skip(skipNum),
      ProductModel.countDocuments(query),
    ]);

    return {
      data: docs.map(this._toEntity.bind(this)),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async findById(id) {
    const doc = await ProductModel.findById(id).catch(() => null);
    return this._toEntity(doc);
  }

  async create(data) {
    const doc = await ProductModel.create(data);
    return this._toEntity(doc);
  }

  async update(id, changes) {
    const doc = await ProductModel
      .findByIdAndUpdate(id, changes, { new: true, runValidators: true })
      .catch(() => null);
    return this._toEntity(doc);
  }

  async delete(id) {
    const doc = await ProductModel.findByIdAndDelete(id).catch(() => null);
    return this._toEntity(doc);
  }

  async toggleEstado(id) {
    const product = await ProductModel.findById(id).catch(() => null);
    if (!product) return null;
    product.estado = !product.estado;
    await product.save();
    return this._toEntity(product);
  }
}

module.exports = ProductRepository;