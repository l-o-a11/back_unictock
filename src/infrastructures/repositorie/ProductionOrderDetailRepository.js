// infrastructures/repositorie/ProductionOrderDetailRepository.js
const ProductionOrderDetailModel = require('../db/ProductionOrderDetailModel');

class ProductionOrderDetailRepository {
  /**
   * Lista detalles con filtros opcionales.
   * Filtros soportados: id_orden
   */
  async findAll(filters = {}) {
    const query = {};
    if (filters.id_orden) query.id_orden = filters.id_orden;

    const docs = await ProductionOrderDetailModel.find(query).lean();
    return docs.map((d) => this._toPlain(d));
  }

  async findById(id) {
    const doc = await ProductionOrderDetailModel.findById(id).lean().catch(() => null);
    return this._toPlain(doc);
  }

  async create(data) {
    const doc = await ProductionOrderDetailModel.create(data);
    return this._toPlain(doc.toObject());
  }

  async update(id, changes) {
    const doc = await ProductionOrderDetailModel
      .findByIdAndUpdate(id, changes, { new: true })
      .lean()
      .catch(() => null);
    return this._toPlain(doc);
  }

  async delete(id) {
    const result = await ProductionOrderDetailModel.findByIdAndDelete(id).catch(() => null);
    return !!result;
  }

  /**
   * Cuenta cuántos detalles ya tienen refCorte asignado para un id_producto dado.
   * Usado para calcular el consecutivo al asignar refCorte automáticamente.
   */
  async countRefCorteByProducto(id_producto) {
    const regex = new RegExp(`^${id_producto}-\\d+$`);
    return ProductionOrderDetailModel.countDocuments({
      id_producto,
      refCorte: { $regex: regex },
    });
  }

  /** Convierte un documento plano de Mongoose en un objeto serializable */
  _toPlain(doc) {
    if (!doc) return null;
    return {
      id:          doc._id?.toString() || doc.id,
      id_orden:    doc.id_orden?.toString(),
      id_producto: doc.id_producto,
      cantidad:    doc.cantidad,
      color:       doc.color || null,
      estado:      doc.estado !== false,
      refCorte:    doc.refCorte || null,
      createdAt:   doc.createdAt,
      updatedAt:   doc.updatedAt,
      toJSON() { return { ...this }; },
    };
  }
}

module.exports = ProductionOrderDetailRepository;
