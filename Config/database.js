// Config/database.js
const mongoose = require('mongoose');
 
const connectDB = async () => {
  const uri    = process.env.MONGO_URI;
  const dbName = process.env.DATABASE_NAME || 'Unistock';
 
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
 
  await mongoose.connect(uri, { dbName });
  console.log(` MongoDB connected → ${dbName}`);
};
 
module.exports = connectDB;
 