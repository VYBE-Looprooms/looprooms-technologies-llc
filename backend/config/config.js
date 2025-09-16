require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const defaultConfig = {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'vybe',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    dialect: 'postgres',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    },
    define: {
        underscored: true,
        freezeTableName: false,
        timestamps: true,
    },
};

module.exports = {
    development: {
        ...defaultConfig,
    },
    test: {
        ...defaultConfig,
        database: process.env.DB_NAME_TEST || 'vybe_test',
        logging: false,
    },
    production: {
        ...defaultConfig,
        logging: false,
    },
};