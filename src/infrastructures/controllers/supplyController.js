// infrastructures/controllers/supplyController.js
// Recibe los requests HTTP, delega al use case correspondiente, responde.
// No contiene lógica de negocio — solo traduce HTTP ↔ use cases.

const SupplyRepository         = require('../repositorie/SupplyRepository');
const SupplyCategoryRepository = require('../repositorie/SupplyCategoryRepository');

const GetSupplies     = require('../../application/use-cases/supplies/GetSupplies');
const GetSupplyById   = require('../../application/use-cases/supplies/GetSupplyById');
const CreateSupply    = require('../../application/use-cases/supplies/CreateSupply');
const UpdateSupply    = require('../../application/use-cases/supplies/UpdateSupply');
const DeleteSupply    = require('../../application/use-cases/supplies/DeleteSupply');
const ToggleSupply    = require('../../application/use-cases/supplies/ToggleSupply');

const {
  ok, created, noContent, badRequest,
  notFound, conflict, unprocessable, serverError,
} = require('../../shared/utils/response');

const supplyRepo   = new SupplyRepository();
const categoryRepo = new SupplyCategoryRepository();

// ── Catálogos estáticos ────────────────────────────────────────────────────────
// Devuelve las unidades de medida aceptadas por el sistema.
const MEDIDAS = [
  { valor: 'kg',  label: 'Kilogramo'       },
  { valor: 'g',   label: 'Gramo'           },
  { valor: 'mg',  label: 'Miligramo'       },
  { valor: 'l',   label: 'Litro'           },
  { valor: 'ml',  label: 'Mililitro'       },
  { valor: 'm',   label: 'Metro'           },
  { valor: 'cm',  label: 'Centímetro'      },
  { valor: 'mm',  label: 'Milímetro'       },
  { valor: 'm2',  label: 'Metro cuadrado'  },
  { valor: 'm3',  label: 'Metro cúbico'    },
  { valor: 'und', label: 'Unidad'          },
  { valor: 'par', label: 'Par'             },
  { valor: 'cja', label: 'Caja'            },
  { valor: 'rl',  label: 'Rollo'           },
  { valor: 'blt', label: 'Bulto'           },
];

// Devuelve las propiedades adicionales que un insumo puede tener.
const PROPIEDADES = [
  { clave: 'color',         label: 'Color'                  },
  { clave: 'material',      label: 'Material'               },
  { clave: 'marca',         label: 'Marca'                  },
  { clave: 'referencia',    label: 'Referencia'             },
  { clave: 'peso',          label: 'Peso'                   },
  { clave: 'dimensiones',   label: 'Dimensiones'            },
  { clave: 'proveedor',     label: 'Proveedor'              },
  { clave: 'lote',          label: 'Lote'                   },
  { clave: 'vencimiento',   label: 'Fecha de vencimiento'   },
  { clave: 'observaciones', label: 'Observaciones'          },
];

const getMedidas     = (req, res) => ok(res, MEDIDAS);
const getPropiedades = (req, res) => ok(res, PROPIEDADES);

// ── GET /insumos ───────────────────────────────────────────────────────────────
const getSupplies = async (req, res) => {
  try {
    const result = await new GetSupplies(supplyRepo).execute(req.query);
    return ok(res, result);
  } catch (err) {
    console.error('GetSupplies error:', err);
    return serverError(res, err.message);
  }
};

// ── GET /insumos/:id ───────────────────────────────────────────────────────────
const getSupplyById = async (req, res) => {
  try {
    const data = await new GetSupplyById(supplyRepo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    if (err.statusCode === 404) return notFound(res, err.message);
    console.error('GetSupplyById error:', err);
    return serverError(res, err.message);
  }
};

// ── POST /insumos ──────────────────────────────────────────────────────────────
const createSupply = async (req, res) => {
  try {
    const data = await new CreateSupply(supplyRepo, categoryRepo).execute(req.body);
    return created(res, data);
  } catch (err) {
    console.error('CreateSupply error:', err.message);
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 409) return conflict(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res, err.message);
  }
};

// ── PUT /insumos/:id ───────────────────────────────────────────────────────────
const updateSupply = async (req, res) => {
  try {
    const data = await new UpdateSupply(supplyRepo, categoryRepo).execute(req.params.id, req.body);
    return ok(res, data);
  } catch (err) {
    console.error('UpdateSupply error:', err.message);
    if (err.statusCode === 400) return badRequest(res, err.message);
    if (err.statusCode === 404) return notFound(res, err.message);
    if (err.statusCode === 409) return conflict(res, err.message);
    if (err.statusCode === 422) return unprocessable(res, err.message);
    return serverError(res, err.message);
  }
};

// ── DELETE /insumos/:id ────────────────────────────────────────────────────────
const deleteSupply = async (req, res) => {
  try {
    const data = await new DeleteSupply(supplyRepo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    console.error('DeleteSupply error:', err.message);
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res, err.message);
  }
};

// ── PATCH /insumos/:id/toggle ──────────────────────────────────────────────────
const toggleSupply = async (req, res) => {
  try {
    const data = await new ToggleSupply(supplyRepo).execute(req.params.id);
    return ok(res, data);
  } catch (err) {
    console.error('ToggleSupply error:', err.message);
    if (err.statusCode === 404) return notFound(res, err.message);
    return serverError(res, err.message);
  }
};

module.exports = {
  getMedidas,
  getPropiedades,
  getSupplies,
  getSupplyById,
  createSupply,
  updateSupply,
  deleteSupply,
  toggleSupply,
};
