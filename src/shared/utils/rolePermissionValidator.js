/**
 * rolePermissionValidator.js
 *
 * Valida y normaliza el array de permisos antes de guardar un rol.
 *
 * Formato que espera el frontend y que devuelve esta función:
 *   [
 *     {
 *       modulo: { codigo: "insumos", nombre: "Insumos", descripcion: "" },
 *       privilegios: [{ nombre: "crear" }, { nombre: "leer" }]
 *     },
 *     ...
 *   ]
 *
 * El frontend puede enviar el módulo como:
 *   - String con el nombre/codigo: "insumos"
 *   - ObjectId string: "6635abc..."
 *   - Objeto con { codigo } o { nombre }
 *
 * Los privilegios pueden enviarse como:
 *   - Array de strings: ["crear", "leer"]
 *   - Array de objetos: [{ nombre: "crear" }]
 *   - Array de ObjectId strings (se resuelven contra la BD)
 */

const normalize = (v) => String(v || '').trim().toLowerCase();

async function validatePermissions(permisos, moduleRepository, privilegeRepository) {
  if (!Array.isArray(permisos)) {
    const err = new Error('Los permisos deben ser un arreglo');
    err.statusCode = 422;
    throw err;
  }

  // Cargar catálogos una sola vez
  const [modulosDispo, privilegiosDispo] = await Promise.all([
    moduleRepository.findAll({ estado: true }),
    privilegeRepository.findAll({ estado: true }),
  ]);

  const resolveModulo = (value) => {
    if (!value) return null;
    // Si es objeto, usar codigo o nombre
    if (typeof value === 'object') {
      const key = normalize(value.codigo || value.nombre || value._id || '');
      return (
        modulosDispo.find(
          (m) => normalize(m.nombre) === key || m._id?.toString() === String(value._id || ''),
        ) || null
      );
    }
    const key = normalize(value);
    return (
      modulosDispo.find(
        (m) => normalize(m.nombre) === key || m._id?.toString() === String(value),
      ) || null
    );
  };

  const resolvePrivilegio = (value) => {
    if (!value) return null;
    if (typeof value === 'object') {
      const key = normalize(value.nombre || '');
      return (
        privilegiosDispo.find(
          (p) => normalize(p.nombre) === key || p._id?.toString() === String(value._id || ''),
        ) || null
      );
    }
    const key = normalize(value);
    return (
      privilegiosDispo.find(
        (p) => normalize(p.nombre) === key || p._id?.toString() === String(value),
      ) || null
    );
  };

  const seenModulos = new Set();
  const resultado = [];

  for (let i = 0; i < permisos.length; i++) {
    const item = permisos[i];

    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      const err = new Error(`El permiso en posición ${i} debe ser un objeto { modulo, privilegios }`);
      err.statusCode = 422;
      throw err;
    }

    // ── Resolver módulo ───────────────────────────────────────────
    const moduloDoc = resolveModulo(item.modulo);
    if (!moduloDoc) {
      const nombres = modulosDispo.map((m) => m.nombre).join(', ');
      const err = new Error(
        `Módulo inválido en posición ${i}: "${JSON.stringify(item.modulo)}". Módulos disponibles: ${nombres}`,
      );
      err.statusCode = 422;
      throw err;
    }

    const moduloId = moduloDoc._id?.toString() || moduloDoc.id?.toString();
    if (seenModulos.has(moduloId)) {
      const err = new Error(`El módulo "${moduloDoc.nombre}" está duplicado en los permisos`);
      err.statusCode = 422;
      throw err;
    }
    seenModulos.add(moduloId);

    // ── Resolver privilegios ──────────────────────────────────────
    const privInput = item.privilegios;
    if (!Array.isArray(privInput) || privInput.length === 0) {
      const err = new Error(
        `El módulo "${moduloDoc.nombre}" debe tener al menos un privilegio`,
      );
      err.statusCode = 422;
      throw err;
    }

    const privilegiosResueltos = [];
    const seenPriv = new Set();

    for (const privValue of privInput) {
      const privDoc = resolvePrivilegio(privValue);
      if (!privDoc) {
        const nombres = privilegiosDispo.map((p) => p.nombre).join(', ');
        const err = new Error(
          `Privilegio inválido "${JSON.stringify(privValue)}" en módulo "${moduloDoc.nombre}". Privilegios disponibles: ${nombres}`,
        );
        err.statusCode = 422;
        throw err;
      }
      const key = normalize(privDoc.nombre);
      if (!seenPriv.has(key)) {
        seenPriv.add(key);
        privilegiosResueltos.push({ nombre: normalize(privDoc.nombre) });
      }
    }

    // ── Construir permiso en el formato que espera el RoleModel ──
    resultado.push({
      modulo: {
        codigo:      normalize(moduloDoc.nombre),
        nombre:      moduloDoc.nombre.charAt(0).toUpperCase() + moduloDoc.nombre.slice(1),
        descripcion: moduloDoc.descripcion || '',
      },
      privilegios: privilegiosResueltos,
    });
  }

  return resultado;
}

module.exports = { validatePermissions };
