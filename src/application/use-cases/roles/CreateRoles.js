// application/use-cases/roles/CreateRoles.js

class CreateRoles {
  constructor(repo, moduleRepo, privilegeRepo) {
    this.repo          = repo;
    this.moduleRepo    = moduleRepo;
    this.privilegeRepo = privilegeRepo;
  }

  async execute(data) {
    const { nombre, descripcion, estado = true, permisos = [] } = data;

    if (!nombre?.trim()) {
      const err = new Error('El nombre del rol es obligatorio');
      err.statusCode = 400; throw err;
    }
    if (!descripcion?.trim()) {
      const err = new Error('La descripción del rol es obligatoria');
      err.statusCode = 400; throw err;
    }

    const existing = await this.repo.findByName(nombre.trim());
    if (existing) {
      const err = new Error(`Ya existe un rol con el nombre "${nombre}"`);
      err.statusCode = 409; throw err;
    }

    return this.repo.create({
      nombre:      nombre.trim(),
      descripcion: descripcion.trim(),
      estado,
      permisos:    await this._validarPermisos(permisos),
    });
  }

  async _validarPermisos(permisos) {
    if (!Array.isArray(permisos)) return [];

    const modulosDisponibles     = await this.moduleRepo.findAll({ estado: true });
    const privilegiosDisponibles = await this.privilegeRepo.findAll({ estado: true });
    const normalize = (v) => String(v || '').trim().toLowerCase();
    const seenModulos = new Set();

    return permisos.map((p, i) => {
      if (!p || typeof p !== 'object') {
        const err = new Error(`Permiso en posición ${i} tiene formato inválido`);
        err.statusCode = 422; throw err;
      }

      // El front envía { modulo: 'insumos', privilegios: ['crear','leer'] }
      const moduloInput = typeof p.modulo === 'object' ? p.modulo.nombre : p.modulo;
      if (!moduloInput) {
        const err = new Error(`El permiso en posición ${i} debe incluir un módulo`);
        err.statusCode = 422; throw err;
      }

      const moduloEncontrado = modulosDisponibles.find(
        (m) => normalize(m.nombre) === normalize(moduloInput)
      );
      if (!moduloEncontrado) {
        const validos = modulosDisponibles.map((m) => m.nombre).join(', ');
        const err = new Error(`Módulo inválido: "${moduloInput}". Disponibles: ${validos}`);
        err.statusCode = 422; throw err;
      }

      if (seenModulos.has(moduloEncontrado.nombre)) {
        const err = new Error(`El módulo "${moduloEncontrado.nombre}" está repetido`);
        err.statusCode = 422; throw err;
      }
      seenModulos.add(moduloEncontrado.nombre);

      const privInput = Array.isArray(p.privilegios) ? p.privilegios : [];
      if (privInput.length === 0) {
        const err = new Error(`El módulo "${moduloEncontrado.nombre}" debe tener al menos un privilegio`);
        err.statusCode = 422; throw err;
      }

      const privilegiosNormalizados = privInput.map((priv) => {
        const nombre = typeof priv === 'object' ? priv.nombre : priv;
        const encontrado = privilegiosDisponibles.find(
          (pr) => normalize(pr.nombre) === normalize(nombre)
        );
        if (!encontrado) {
          const validos = privilegiosDisponibles.map((pr) => pr.nombre).join(', ');
          const err = new Error(`Privilegio inválido: "${nombre}". Disponibles: ${validos}`);
          err.statusCode = 422; throw err;
        }
        return { nombre: encontrado.nombre };
      });

      return {
        modulo:      { nombre: moduloEncontrado.nombre },
        privilegios: privilegiosNormalizados,
      };
    });
  }
}

module.exports = CreateRoles;
