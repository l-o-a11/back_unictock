// infrastructures/routes/suppliersRoutes.js
/**
 * Rutas de Proveedores
 *
 *  GET    /proveedores                  — Lista con filtros + paginación
 *    ?search=     busca en empresa, contacto, correo y nit
 *    ?nit=        coincidencia exacta de NIT
 *    ?activo=     "true" | "false"
 *    ?page=       número de página (default 1)
 *    ?limit=      registros por página (default 10, max 100)
 *    ?sortBy=     campo (default "nombre_de_empresa")
 *    ?order=      "asc" | "desc"
 *
 *  GET    /proveedores/:id              — Detalle de un proveedor
 *  POST   /proveedores                  — Crear proveedor
 *  PUT    /proveedores/:id              — Editar proveedor
 *  DELETE /proveedores/:id              — Eliminar (bloquea si tiene compras)
 *  PATCH  /proveedores/:id/toggle       — Activar / Inactivar
 */

const { Router }     = require('express');
const ctrl           = require('../controllers/supplierController');
const { requireAuth } = require('../../interfaces/middlewares/authMiddleware');

const router = Router();
//router.use(requireAuth);

router.get('/',                 ctrl.getSuppliers);
router.get('/:id/has-purchases', ctrl.checkSupplierHasPurchases); // debe ir antes de /:id
router.get('/:id',              ctrl.getSupplierById);
router.post('/',                ctrl.createSupplier);
router.put('/:id',              ctrl.updateSupplier);
router.delete('/:id',           ctrl.deleteSupplier);
router.patch('/:id/toggle',     ctrl.toggleSupplier);

module.exports = router;
