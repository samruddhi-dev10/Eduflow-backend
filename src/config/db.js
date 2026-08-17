require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;
let isConnected = false;

const dialect = (process.env.DB_DIALECT || 'sqlite').toLowerCase();

const storage = process.env.DB_STORAGE || './eduflow.sqlite';

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  });
} else if (dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storage,
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'eduflow',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || (dialect === 'mysql' ? 3306 : 5432),
      dialect: dialect,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

/**
 * Connect to SQL database and synchronize models
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    isConnected = true;
    console.log(`✅ SQL Database Connected (${sequelize.getDialect().toUpperCase()})`);
    console.log(`🗄️  Using DB: ${sequelize.getDialect().toUpperCase()} @ ${process.env.DB_HOST || 'localhost'}:${sequelize.config.port}/${process.env.DB_NAME || 'eduflow'}`);

    // Synchronize models with DB schema
    try {
      await sequelize.sync();
      console.log('✅ SQL Models Synchronized');
    } catch (syncError) {
      console.warn(`⚠️  SQL Schema Sync Warning: ${syncError.message}`);
    }
    return true;
  } catch (error) {
    console.error(`❌ SQL Connection Error: ${error.message}`);
    console.warn('⚠️  Falling back to In-Memory store for this session.');
    isConnected = false;
    return false;
  }
};

/**
 * Check if Database is connected
 */
const isDBConnected = () => isConnected;

module.exports = { sequelize, connectDB, isDBConnected };
