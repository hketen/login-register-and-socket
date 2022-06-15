/*
 * This file was created for sequelize migration
 */

const isProduction = require('../utils/is-production');

if (!process.env.DB_USERNAME) {
  require('dotenv').config();
}

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX),
    min: parseInt(process.env.DB_POOL_MIN),
    idle: parseInt(process.env.DB_POOL_IDLE),
  },
  logging: !isProduction,
};

module.exports = {
  development: dbConfig,
  production: dbConfig,
  getConfig: () => dbConfig,
};
