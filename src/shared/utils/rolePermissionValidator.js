/**
 * rolePermissionValidator.js
 *
 * Valida y normaliza los permisos recibidos del frontend antes de guardarlos.
 *
 * El frontend envía (permisosFrontToBack):
 *   [{ modulo: "insumos", privilegios: ["crear", "leer"] }]
 *
 * Este validador devuelve el formato que espera el RoleModel del backend:
 *   [{ modulo: { nombre: "insumos" }, privilegios: [{ nombre: "crear" }, { nombre: "leer" }] }]
 *
 * Acepta módulo como:
 *   - string nombre:  "insumos"
 *   - string ObjectId: "6635abc..."  (se resuelve contra BD)
 *   - objeto { nombre } o { codigo }  (compatibilidad legacy)
 */

const normalize = (v) => String(v || "").trim().toLowerCase();

async function validatePermissions(permisos, moduleRepository, privilegeRepository) {
  if (!Array.isArray(permisos)) {
    const err = new Error("Los permisos deben ser un arreglo");
    err.statusCode = 422;
    throw err;
  }

  // Cargar catálogos una sola vez
  const [modulosDispo, privilegiosDispo] = await Promise.all([
    moduleRepository.findAll({ estado: true }),
    privilegeRepository.findAll({ estado: true }),
  ]);

  // Resuelve un valor de módulo (string nombre, ObjectId, u objeto) → doc del catálogo
  const resolveModulo = (value) => {
    if (!value) return null;
    if (typeof value === "object") {
      const key = normalize(value.nombre || value.codigo || "");
      return modulosDispo.find(
        (m) => normalize(m.nombre) === key ||
               m._id?.toString() === String(value._id || value.id || "")
      ) || null;
    }
    const key = normalize(value);
    return modulosDispo.find(
      (m) => normalize(m.nombre) === key || m._id?.toString() === value
    ) || null;
  };

  // Resuelve un valor de privilegio (string nombre, ObjectId, u objeto) → doc del catálogo
  const resolvePrivilegio = (value) => {
    if (!value) return null;
    if (typeof value === "object") {
      const key = normalize(value.nombre || "");
      return privilegiosDispo.find(
        (p) => normalize(p.nombre) === key ||
               p._id?.toString() === String(value._id || value.id || "")
      ) || null;
    }
    const key = normalize(value);
    return privilegiosDispo.find(
      (p) => normalize(p.nombre) === key || p._id?.toString() === value
    ) || null;
  };

  const seenModulos = new Set();
  const resultado   = [];

  for (let i = 0; i < permisos.length; i++) {
    const item = permisos[i];

    if (!item || typeof item !== "object" || Array.isArray(item)) {
      const err = new Error(`El permiso en posición ${i} debe ser un objeto { modulo, privilegios }`);
      err.statusCode = 422;
      throw err;
    }

    // ── Resolver módulo ───────────────────────────────────────────────────────
    const moduloDoc = resolveModulo(item.modulo);
    if (!moduloDoc) {
      const disponibles = modulosDispo.map((m) => m.nombre).join(", ");
      const err = new Error(
        `Módulo inválido en posición ${i}: "${JSON.stringify(item.modulo)}". Disponibles: ${disponibles}`
      );
      err.statusCode = 422;
      throw err;
    }

    const moduloKey = moduloDoc._id?.toString() || moduloDoc.id;
    if (seenModulos.has(moduloKey)) {
      const err = new Error(`El módulo "${moduloDoc.nombre}" está duplicado en los permisos`);
      err.statusCode = 422;
      throw err;
    }
    seenModulos.add(moduloKey);

    // ── Resolver privilegios ──────────────────────────────────────────────────
    const privInput = item.privilegios;
    if (!Array.isArray(privInput) || privInput.length === 0) {
      const err = new Error(`El módulo "${moduloDoc.nombre}" debe tener al menos un privilegio`);
      err.statusCode = 422;
      throw err;
    }

    const seenPriv            = new Set();
    const privilegiosResueltos = [];

    for (const privValue of privInput) {
      const privDoc = resolvePrivilegio(privValue);
      if (!privDoc) {
        const disponibles = privilegiosDispo.map((p) => p.nombre).join(", ");
        const err = new Error(
          `Privilegio inválido "${JSON.stringify(privValue)}" en módulo "${moduloDoc.nombre}". Disponibles: ${disponibles}`
        );
        err.statusCode = 422;
        throw err;
      }
      const key = normalize(privDoc.nombre);
      if (!seenPriv.has(key)) {
        seenPriv.add(key);
        // Formato que espera el RoleModel: { nombre: "crear" }
        privilegiosResueltos.push({ nombre: normalize(privDoc.nombre) });
      }
    }

    // ── Formato final compatible con el RoleModel del backend ─────────────────
    resultado.push({
      modulo:      { nombre: normalize(moduloDoc.nombre) },
      privilegios: privilegiosResueltos,
    });
  }

  return resultado;
}

module.exports = { validatePermissions };
