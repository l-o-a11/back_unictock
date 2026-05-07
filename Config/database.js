// Config/database.js
const mongoose = require('mongoose');

const safeLogMongoHostnames = (mongoUri) => {
  if (!mongoUri || typeof mongoUri !== 'string') return [];

  try {
    // mongodb+srv://.../dbname or mongodb://...
    const withoutCreds = mongoUri.replace(/(mongodb\+srv?:\/\/)([^/@]+)@/i, '$1***:***@');

    // Try to extract host list between // and next /
    const m = mongoUri.match(/^[a-zA-Z0-9+.-]+:\/\/(?:[^/@]*@)?([^/]+)/);
    const hostPart = m?.[1] || '';
    const hostnames = hostPart
      .split(',')
      .map((h) => h.split(':')[0].trim())
      .filter(Boolean);

    return { hostnames, withoutCreds };
  } catch {
    return { hostnames: [], withoutCreds: '[unparsable uri]' };
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.DATABASE_NAME || 'Unistock';

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  const { hostnames } = safeLogMongoHostnames(uri);
  console.log(`[mongo] Connecting to dbName="${dbName}" hosts="${hostnames.join(', ') || 'unknown'}"`);

  // Keep config minimal but explicit; allow Atlas srv URIs.
  await mongoose.connect(uri, {
    dbName,
  });

  console.log(`MongoDB connected → ${dbName}`);
};

module.exports = connectDB;

 