// infrastructures/repositorie/ThirdPartyAssignmentRepository.js
//
// Repositorio simplificado de asignaciones de terceros.
// En el Backend (puerto 3020) no existe aún un modelo Mongoose para ThirdPartyAssignment,
// así que lo creamos aquí usando almacenamiento en memoria para no bloquear el arranque.
// Cuando se implemente el modelo, reemplazar las operaciones in-memory por las de Mongoose.

const assignments = []; // Almacén en memoria (temporal)
let nextId = 1;

class ThirdPartyAssignmentRepository {
  async findAll(filters = {}) {
    let result = [...assignments];
    if (filters.id_orden)   result = result.filter(a => a.id_orden   === filters.id_orden);
    if (filters.id_tercero) result = result.filter(a => a.id_tercero === filters.id_tercero);
    return result;
  }

  async findById(id) {
    return assignments.find(a => a.id === id) || null;
  }

  async create(data) {
    const entry = {
      id:          String(nextId++),
      id_orden:    data.id_orden,
      id_tercero:  data.id_tercero,
      cantidad:    data.cantidad,
      fecha:       new Date(),
      createdAt:   new Date(),
    };
    assignments.push(entry);
    return { ...entry, toJSON() { return { ...this }; } };
  }

  async update(id, changes) {
    const idx = assignments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    assignments[idx] = { ...assignments[idx], ...changes };
    const item = assignments[idx];
    return { ...item, toJSON() { return { ...this }; } };
  }

  async delete(id) {
    const idx = assignments.findIndex(a => a.id === id);
    if (idx === -1) return false;
    assignments.splice(idx, 1);
    return true;
  }
}

module.exports = ThirdPartyAssignmentRepository;
