/**
 * Config/seed.js
 *
 * Siembra los módulos y privilegios base al arrancar la app.
 * Solo inserta los que no existan — idempotente.
 */

const ModuleModel    = require('../src/infrastructures/db/ModuleModel');
const PrivilegeModel = require('../src/infrastructures/db/PrivilegeModel');

// Módulos del sistema (deben coincidir con las rutas del frontend)
const MODULES = [
  'usuarios',
  'roles',
  'insumos',
  'categorias de insumos',
  'compras',
  'produccion',
  'proveedores',
  'terceros',
  'empleados',
  'sedes',
  'productos',
  'categorias de productos',
  'dashboard'
];

// Privilegios base — se crean para CADA módulo
const PRIVILEGES = ['crear', 'leer', 'actualizar', 'eliminar'];

async function seed() {
  try {
    // 1. Crear módulos faltantes
    const moduleDocs = [];
    for (const nombre of MODULES) {
      let doc = await ModuleModel.findOne({ nombre });
      if (!doc) {
        doc = await ModuleModel.create({ nombre, estado: true });
        console.log(`[seed] Módulo creado: ${nombre}`);
      }
      moduleDocs.push(doc);
    }

    // 2. Crear privilegios faltantes por módulo
    for (const moduloDoc of moduleDocs) {
      for (const nombre of PRIVILEGES) {
        const exists = await PrivilegeModel.findOne({ nombre, modulo: moduloDoc._id });
        if (!exists) {
          await PrivilegeModel.create({ nombre, modulo: moduloDoc._id, estado: true });
          console.log(`[seed] Privilegio creado: ${nombre} → ${moduloDoc.nombre}`);
        }
      }
    }

    console.log('[seed] Catálogos verificados ✓');
  } catch (err) {
    console.error('[seed] Error:', err.message);
  }
}

module.exports = { seed };
