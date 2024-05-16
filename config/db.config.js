// const { Pool } = require('pg');
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  dialect: "mysql",
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};