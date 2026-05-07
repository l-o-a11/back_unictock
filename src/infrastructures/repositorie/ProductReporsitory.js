const ProductModel = require("../db/ProductModel");
const Product = require("../../domain/entities/Products");

class ProductRepository {
  _toEntity(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return new Product({ ...obj, id: obj._id.toString() });
  }

  /**
   * Devuelve productos con filtros y paginación.
   *
   * Filtros soportados (query params):
   *   search        — busca en nombre y referencia (regex case-insensitive)
   *   estado        — "true" | "false"
   *   id_categoria  — filtrar por categoría
   *
   * Paginación:
   *   page    — número de página (default 1)
   *   limit   — registros por página (default 10, max 100)
   *   sortBy  — campo de ordenamiento (default "nombre")
   *   order   — "asc" | "desc" (default "asc")
   *
   * Respuesta:
   *   { data: Product[], total, page, limit, totalPages }
   */
  async findAll(filters = {}) {
    const {
      search,
      estado,
      id_categoria,
      page = 1,
      limit = 10,
      sortBy = "nombre",
      order = "asc",
    } = filters;

    const query = {};

    if (search) {
      const re = new RegExp(search, "i");
      query.$or = [
        { nombre: re },
        { referencia: re },
      ];
    }

    if (id_categoria) {
      query.id_categoria = id_categoria;
    }

    if (estado !== undefined && estado !== "") {
      query.estado = estado === "true" || estado === true;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    const sortDir = order === "desc" ? -1 : 1;

    const [docs, total] = await Promise.all([
      ProductModel.find(query)
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limitNum),

      ProductModel.countDocuments(query),
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
    const doc = await ProductModel.findById(id).catch(() => null);
    return this._toEntity(doc);
  }

  async findByReference(referencia) {
    const doc = await ProductModel.findOne({ referencia });
    return this._toEntity(doc);
  }

  async findByName(nombre) {
    const doc = await ProductModel.findOne({ nombre });
    return this._toEntity(doc);
  }

  async create(data) {
    const doc = await ProductModel.create(data);
    return this._toEntity(doc);
  }

  async update(id, changes) {
    const doc = await ProductModel
      .findByIdAndUpdate(id, changes, {
        new: true,
        runValidators: true,
      })
      .catch(() => null);

    return this._toEntity(doc);
  }

  /**
   * Activa o desactiva un producto (soft toggle).
   */
  async toggleEstado(id) {
    const current = await ProductModel.findById(id).catch(() => null);
    if (!current) return null;

    const doc = await ProductModel.findByIdAndUpdate(
      id,
      { estado: !current.estado },
      { new: true },
    );

    return this._toEntity(doc);
  }

  async delete(id) {
    const result = await ProductModel.findByIdAndDelete(id).catch(() => null);
    return !!result;
  }

  /**
   * Verifica si existen productos asociados a una categoría
   * (para bloquear eliminación de categoría).
   */
  async findByCategoryId(categoryId) {
    const docs = await ProductModel.find({ id_categoria: categoryId });
    return docs.map((d) => this._toEntity(d));
  }
}

module.exports = ProductRepository;