// infrastructure/repositories/ProductCategoryRepository.js

const ProductCategoryModel = require("../db/ProductCategoryModel");
const ProductCategory = require("../../domain/entities/ProductCategory");

class ProductCategoryRepository {
  _toEntity(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return new ProductCategory({ ...obj, id: obj._id.toString() });
  }

  /**
   * Filtros:
   *  search → nombre / descripcion
   *
   * Paginación:
   *  page, limit, sortBy, order
   */
  async findAll(filters = {}) {
    const {
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "asc",
    } = filters;

    const query = {};

    if (search) {
      const re = new RegExp(search, "i");
      query.$or = [
        { nombre: re },
        { descripcion: re }, 
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    const sortDir = order === "desc" ? -1 : 1;

    const [docs, total] = await Promise.all([
      ProductCategoryModel.find(query)
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limitNum),

      ProductCategoryModel.countDocuments(query),
    ]);

    return {
      data: docs.map((d) => this._toEntity(d)),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async findById(id) {
    const doc = await ProductCategoryModel.findById(id).catch(() => null);
    return this._toEntity(doc);
  }

  async findByName(nombre) {
    const doc = await ProductCategoryModel.findOne({ nombre });
    return this._toEntity(doc);
  }

  async create(data) {
    const doc = await ProductCategoryModel.create(data);
    return this._toEntity(doc);
  }

  async update(id, changes) {
    const doc = await ProductCategoryModel
      .findByIdAndUpdate(id, changes, {
        new: true,
        runValidators: true,
      })
      .catch(() => null);

    return this._toEntity(doc);
  }

  async delete(id) {
    const result = await ProductCategoryModel
      .findByIdAndDelete(id)
      .catch(() => null);

    return !!result;
  }
}

module.exports = ProductCategoryRepository;