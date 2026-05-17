// application/use-cases/roles/CreateRoles.js

class CreateRoles {
  constructor(repo, moduleRepo, privilegeRepo) {
    this.repo = repo;
    this.moduleRepo = moduleRepo;
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
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      estado,
      permisos: await this._validarPermisos(permisos),
    });
  }

  async _validarPermisos(permisos) {
    if (!Array.isArray(permisos)) return [];

    const modulosDisponibles = await this.moduleRepo.findAll({ estado: true });
    const privilegiosDisponibles = await this.privilegeRepo.findAll({ estado: true });
    const normalize = (v) => String(v || '').trim().toLowerCase();
    const seenModulos = new Set();

    return permisos.map((p, i) => {
      if (!p || typeof p !== 'object') {
        const err = new Error(`Permiso en posición ${i} tiene formato inválido`);
        err.statusCode = 422; throw err;
      }

      // El front envía { modulo: { id: '...', nombre: 'insumos' }, privilegios: ['crear','leer'] }
      const moduloInput = typeof p.modulo === 'object' ? (p.modulo.id || p.modulo.nombre) : p.modulo;
      if (!moduloInput) {
        const err = new Error(`El permiso en posición ${i} debe incluir un módulo`);
        err.statusCode = 422; throw err;
      }

      const moduloEncontrado = modulosDisponibles.find((m) => {
        // Buscar por ID o por nombre
        return m.id === moduloInput || normalize(m.nombre) === normalize(moduloInput);
      });
      if (!moduloEncontrado) {
        const validos = modulosDisponibles.map((m) => m.nombre).join(', ');
        const err = new Error(`Módulo inválido: "${moduloInput}". Disponibles: ${validos}`);
        err.statusCode = 422; throw err;
      }

      if (seenModulos.has(moduloEncontrado.id)) {
        const err = new Error(`El módulo "${moduloEncontrado.nombre}" está repetido`);
        err.statusCode = 422; throw err;
      }
      seenModulos.add(moduloEncontrado.id);

      const privInput = Array.isArray(p.privilegios) ? p.privilegios : [];
      if (privInput.length === 0) {
        const err = new Error(`El módulo "${moduloEncontrado.nombre}" debe tener al menos un privilegio`);
        err.statusCode = 422; throw err;
      }

      // Filtrar privilegios disponibles para este módulo
      const privilegiosDelModulo = privilegiosDisponibles.filter(
        (pr) => pr.modulo?.id === moduloEncontrado.id ||
          pr.modulo?._id?.toString?.() === moduloEncontrado.id ||
          normalize(pr.modulo?.nombre) === normalize(moduloEncontrado.nombre)
      );

      const privilegiosNormalizados = privInput.map((priv) => {
        const privId = typeof priv === 'object' ? (priv.id || priv.nombre) : priv;
        const encontrado = privilegiosDelModulo.find(
          (pr) => pr.id === privId || normalize(pr.nombre) === normalize(privId)
        );
        if (!encontrado) {
          const validos = privilegiosDelModulo.map((pr) => pr.nombre).join(', ');
          const err = new Error(`Privilegio inválido: "${privId}" para módulo "${moduloEncontrado.nombre}". Disponibles: ${validos}`);
          err.statusCode = 422; throw err;
        }
        return { nombre: encontrado.nombre };
      });

      return {
        modulo: { nombre: moduloEncontrado.nombre },
        privilegios: privilegiosNormalizados,
      };
    });
  }
}

module.exports = CreateRoles;
