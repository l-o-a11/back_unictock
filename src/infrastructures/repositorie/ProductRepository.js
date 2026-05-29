// src/infrastructures/repositorie/ProductRepository.js
const ProductModel = require('../db/ProductModel');
const Product = require('../../domain/entities/Product'); // singular — era "Products" (plural), causaba crash

class ProductRepository {
  _toEntity(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return new Product({
      ...obj,
      id: obj._id.toString(),
      // Mantener el campo tal como está en el schema: `id_categorias`.
      id_categorias: obj.id_categorias?.toString?.() ?? obj.id_categorias,
    });
  }

  async findAll({ page = 1, limit = 10, search = '', estado, active, sortBy = 'createdAt', order = 'desc' } = {}) {
    const limitNum = Math.min(parseInt(limit) || 10, 100);
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

    // Soportar ambos filtros: `estado` o `active` (legacy)
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

  async findByReference(referencia) {
    const doc = await ProductModel.findOne({ referencia }).catch(() => null);
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
    return !!doc;
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
