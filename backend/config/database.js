const { Sequelize } = require('sequelize');
const config = require('./config.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

if (!dbConfig) {
  throw new Error('Database configuration for environment "' + env + '" is not defined.');
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  dialectOptions: dbConfig.dialectOptions,
  define: dbConfig.define,
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('[VYBE] Database connection established successfully.');
  } catch (error) {
    console.error('[VYBE] Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectDatabase,
};
