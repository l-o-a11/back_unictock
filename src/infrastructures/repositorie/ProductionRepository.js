// infrastructures/repositories/ProductionRepository.js
const ProductionOrderModel = require('../db/ProductionOrderModel');
const Production           = require('../../domain/entities/Production');

class ProductionRepository {
  _toEntity(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return new Production({
      ...obj,
      id:             obj._id.toString(),
      fecha_creacion: obj.fecha_creacion ?? obj.createdAt,  // timestamps usa createdAt
    });
  }

  /**
   * Lista órdenes con filtros y paginación.
   *
   * Filtros:
   *   search        — busca en cliente (regex)
   *   estado        — estado exacto del flujo
   *   id_usuario    — filtrar por usuario creador
   *   fecha_desde   — fecha_entrega >= valor (ISO yyyy-mm-dd)
   *   fecha_hasta   — fecha_entrega <= valor (ISO yyyy-mm-dd)
   *
   * Paginación:
   *   page, limit, sortBy, order
   */
  async findAll(filters = {}) {
    const {
      search,
      estado,
      id_usuario,
      fecha_desde,
      fecha_hasta,
      page   = 1,
      limit  = 10,
      sortBy = 'createdAt',
      order  = 'desc',
    } = filters;

    const query = {};

    if (search)     query.cliente    = new RegExp(search, 'i');
    if (estado)     query.estado     = estado;
    if (id_usuario) query.id_usuario = id_usuario;

    if (fecha_desde || fecha_hasta) {
      query.fecha_entrega = {};
      if (fecha_desde) query.fecha_entrega.$gte = new Date(fecha_desde);
      if (fecha_hasta) query.fecha_entrega.$lte = new Date(fecha_hasta);
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;
    const sortDir  = order === 'asc' ? 1 : -1;

    const [docs, total] = await Promise.all([
      ProductionOrderModel.find(query)
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limitNum),
      ProductionOrderModel.countDocuments(query),
    ]);

    return {
      data:       docs.map((d) => this._toEntity(d)),
      total,
      page:       pageNum,
      limit:      limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async findById(id) {
    const doc = await ProductionOrderModel.findById(id).catch(() => null);
    return this._toEntity(doc);
  }

  async create(data) {
    const doc = await ProductionOrderModel.create(data);
    return this._toEntity(doc);
  }

  async update(id, changes) {
    const doc = await ProductionOrderModel
      .findByIdAndUpdate(id, changes, { new: true, runValidators: true });
    return this._toEntity(doc);
  }

  async addHistoryEntry(id, entry) {
    const doc = await ProductionOrderModel
      .findByIdAndUpdate(
        id,
        { $push: { historial: entry } },
        { new: true, runValidators: true },
      )
      .catch(() => null);
    return this._toEntity(doc);
  }

  /**
   * Anula la orden: setea estado "Anulada", guarda motivo
   * y agrega entrada al historial.
   */
  async anular(id, motivo, id_usuario, user) {
    const entry = {
      estado: 'Anulada',
      fecha: new Date(),
      id_usuario: id_usuario || null,
      user: user || null,
      motivo: motivo || null,
    };
    const doc = await ProductionOrderModel.findByIdAndUpdate(
      id,
      { estado: 'Anulada', motivo_anulacion: motivo || null, $push: { historial: entry } },
      { new: true },
    ).catch(() => null);
    return this._toEntity(doc);
  }

  /**
   * Cambia el estado y registra el evento en el historial.
   */
  async cambiarEstado(id, nuevoEstado, id_usuario, user, extra = {}) {
    const entry = {
      estado: nuevoEstado,
      fecha: new Date(),
      id_usuario: id_usuario || null,
      user: user || null,
      motivo: null,
    };
    const updateDoc = { estado: nuevoEstado, ...extra, $push: { historial: entry } };
    const doc = await ProductionOrderModel.findByIdAndUpdate(
      id,
      updateDoc,
      { new: true, runValidators: true },
    ).catch(() => null);
    return this._toEntity(doc);
  }

  /**
   * Datos para el calendario: órdenes activas en un rango de fechas.
   * Devuelve solo los campos necesarios para renderizar eventos (sin paginación).
   *
   * @param {string} desde  — ISO yyyy-mm-dd
   * @param {string} hasta  — ISO yyyy-mm-dd
   */
  async findParaCalendario(desde, hasta) {
    const query = {
      estado: { $ne: 'Anulada' },
    };
    if (desde || hasta) {
      query.fecha_entrega = {};
      if (desde) query.fecha_entrega.$gte = new Date(desde);
      if (hasta) query.fecha_entrega.$lte = new Date(hasta);
    }

    const docs = await ProductionOrderModel
      .find(query, { numero_orden: 1, cliente: 1, estado: 1, fecha_entrega: 1, historial: 1 })
      .sort({ fecha_entrega: 1 })
      .lean();

    // Mapear a eventos de calendario
    return docs.map((d) => ({
      id:           d._id.toString(),
      numero_orden: d.numero_orden,
      cliente:      d.cliente,
      estado:       d.estado,
      fecha_entrega: d.fecha_entrega,
      // Último cambio de estado (para mostrar en el tooltip)
      ultimo_cambio: d.historial?.length
        ? d.historial[d.historial.length - 1]
        : null,
    }));
  }

  /**
   * Alertas: órdenes que requieren atención.
   * Retorna sin paginación porque siempre son pocos registros.
   */
  async findAlertas() {
    const hoy      = new Date();
    const en3dias  = new Date(hoy); en3dias.setDate(en3dias.getDate() + 3);
    const ayer     = new Date(hoy); ayer.setDate(ayer.getDate() - 1);

    const [vencidas, proximasVencer, enEsperaLarga] = await Promise.all([
      // Órdenes cuya fecha de entrega ya pasó y no están anuladas ni entregadas
      ProductionOrderModel.find({
        estado:        { $nin: ['Anulada'] },
        fecha_entrega: { $lt: hoy },
      }).sort({ fecha_entrega: 1 }).lean(),

      // Órdenes que vencen en los próximos 3 días
      ProductionOrderModel.find({
        estado:        { $nin: ['Anulada'] },
        fecha_entrega: { $gte: hoy, $lte: en3dias },
      }).sort({ fecha_entrega: 1 }).lean(),

      // Órdenes que llevan más de 7 días en el mismo estado sin avanzar
      ProductionOrderModel.find({
        estado: { $nin: ['Anulada'] },
      }).lean().then((docs) =>
        docs.filter((d) => {
          const historial = d.historial || [];
          if (!historial.length) return false;
          const ultimo = historial[historial.length - 1];
          const diasSinAvance = (hoy - new Date(ultimo.fecha)) / (1000 * 60 * 60 * 24);
          return diasSinAvance > 7;
        }),
      ),
    ]);

    const toResumen = (doc, tipo) => ({
      id:           doc._id.toString(),
      numero_orden: doc.numero_orden,
      cliente:      doc.cliente,
      estado:       doc.estado,
      fecha_entrega: doc.fecha_entrega,
      tipo_alerta:  tipo,
    });

    return {
      vencidas:        vencidas.map((d)        => toResumen(d, 'vencida')),
      proximas_vencer: proximasVencer.map((d)  => toResumen(d, 'proxima_vencer')),
      en_espera_larga: enEsperaLarga.map((d)   => toResumen(d, 'sin_avance_7d')),
      total_alertas:
        vencidas.length + proximasVencer.length + enEsperaLarga.length,
    };
  }
}

module.exports = ProductionRepository;
