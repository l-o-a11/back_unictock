/**
 * migrateProductCategoryStock.js
 * Ejecutar UNA sola vez para sincronizar cantidad_productos
 * en cada categoría con la suma de stock de sus productos.
 * 
 * Uso: node migrateProductCategoryStock.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ProductModel         = require('./src/infrastructures/db/ProductModel');
const ProductCategoryModel = require('./src/infrastructures/db/ProductCategoryModel');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL);
  console.log('✅ Conectado a MongoDB');

  const products = await ProductModel.find({ estado: true });
  console.log(`📦 Productos activos: ${products.length}`);

  // Sumar stock por categoría
  const stockPorCategoria = {};
  for (const product of products) {
    const catId = product.id_categorias;
    if (!catId) continue;
    stockPorCategoria[catId] = (stockPorCategoria[catId] ?? 0) + Number(product.stock ?? 0);
  }

  // Actualizar cada categoría
  const allCategories = await ProductCategoryModel.find({});
  for (const cat of allCategories) {
    const catId = cat._id.toString();
    const totalStock = stockPorCategoria[catId] ?? 0;
    await ProductCategoryModel.findByIdAndUpdate(catId, {
      cantidad_productos: totalStock,
    });
    console.log(`✅ ${cat.nombre}: cantidad_productos = ${totalStock}`);
  }

  console.log('🎉 Migración completada');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});