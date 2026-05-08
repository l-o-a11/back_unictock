// application/use-cases/sites/CreateSites.js

class CreateSites {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(data) {
    const {
      nombre, ciudad, barrio, direccion, telefono, estado = true 
    } = data;

    if (!nombre || !ciudad || !barrio || !direccion || !telefono ) {
      const err = new Error("Campos obligatorios faltantes");
      err.statusCode = 400;
      throw err;
    }

    return this.repo.create({
      nombre,
      ciudad,
      barrio,
      direccion,
      telefono,
      estado
    });
    
  }
}

module.exports = CreateSites;