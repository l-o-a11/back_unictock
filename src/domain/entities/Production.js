// domain/entities/Production.js

const ESTADOS_VALIDOS = [
  'Diseño',
  'Ficha Técnica',
  'Corte',
  'Compras',
  'Producción',
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
    };
  }
}

Production.ESTADOS_VALIDOS = ESTADOS_VALIDOS;

module.exports = Production;
