// src/application/use-cases/products/GetTechnicalSheets.js
class GetTechnicalSheets {
  constructor(technicalSheetRepository) {
    this.repo = technicalSheetRepository;
  }

  async execute(id_producto) {
    if (!id_producto) {
      const err = new Error('id_producto es requerido');
      err.statusCode = 400;
      throw err;
    }
    return this.repo.findByProductId(id_producto);
  }
}

module.exports = GetTechnicalSheets;
