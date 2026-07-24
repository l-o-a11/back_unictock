// domain/entities/Production.js

const ESTADOS_VALIDOS = [
  'Diseño',
  'Ficha Técnica',
  'Corte',
  'Compras',
  'Producción',
  'Empaque',
  'Enviado',
  'Anulada',
];

class Production {
  constructor({
    id,
    numero_orden,
    fecha_creacion,
    fecha_entrega,
    cliente,
    id_usuario,
    estado          = 'Diseño',
    motivo_anulacion = null,
    historial       = [],
    createdAt,
    updatedAt,
    asignaciones = [],
    tipo = null,
    referencia = null,
    producto = null,
    techSpecification = null,
    finishedImages = [],
    finishedImageUrl = null,
    designImages = [],
    fromDamaged = false,
    originalOrderNumber = null,
    originalOrderStatus = null,
    // ✅ Asignación de empleado responsable por etapa (Corte, Compras, Recepción)
    // Forma: { [nombreEtapa]: { id_empleado, nombre_empleado, fecha } }
    empleadoAsignaciones = {},
  }) {
    this.id               = id;
    this.numero_orden     = numero_orden;
    this.fecha_creacion   = fecha_creacion;
    this.fecha_entrega    = fecha_entrega;
    this.cliente          = cliente;
    this.id_usuario       = id_usuario;
    this.estado           = estado;
    this.motivo_anulacion = motivo_anulacion;
    this.historial        = historial;
    this.createdAt        = createdAt;
    this.updatedAt        = updatedAt;
    this.asignaciones     = asignaciones;
    this.tipo             = tipo;
    this.referencia       = referencia;
    this.producto         = producto;
    this.techSpecification = techSpecification;
    this.finishedImages   = finishedImages;
    this.finishedImageUrl = finishedImageUrl;
    this.designImages     = designImages;
    this.fromDamaged      = fromDamaged;
    this.originalOrderNumber = originalOrderNumber;
    this.originalOrderStatus = originalOrderStatus;
    this.empleadoAsignaciones = empleadoAsignaciones || {};
  }

  estaAnulada() {
    return this.estado === 'Anulada';
  }

  /**
   * Verifica si el nuevo estado es un avance válido en el flujo.
   * No se puede retroceder (excepto admins vía endpoint específico).
   */
  puedeAvanzarA(nuevoEstado) {
    if (this.estaAnulada()) return false;
    const currentIdx = ESTADOS_VALIDOS.indexOf(this.estado);
    const nextIdx    = ESTADOS_VALIDOS.indexOf(nuevoEstado);
    return nextIdx > currentIdx;
  }

  toJSON() {
    return {
      id:               this.id,
      numero_orden:     this.numero_orden,
      fecha_creacion:   this.fecha_creacion,
      fecha_entrega:    this.fecha_entrega,
      cliente:          this.cliente,
      id_usuario:       this.id_usuario,
      estado:           this.estado,
      motivo_anulacion: this.motivo_anulacion,
      historial:        this.historial,
      createdAt:        this.createdAt,
      updatedAt:        this.updatedAt,
      asignaciones:     this.asignaciones,
      tipo:             this.tipo,
      referencia:       this.referencia,
      producto:         this.producto,
      techSpecification: this.techSpecification,
      finishedImages:   this.finishedImages,
      finishedImageUrl: this.finishedImageUrl,
      designImages:     this.designImages,
      fromDamaged:      this.fromDamaged,
      originalOrderNumber: this.originalOrderNumber,
      originalOrderStatus: this.originalOrderStatus,
      empleadoAsignaciones: this.empleadoAsignaciones,
    };
  }
}

Production.ESTADOS_VALIDOS = ESTADOS_VALIDOS;

module.exports = Production;