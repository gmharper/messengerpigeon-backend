const { Pool } = require("pg");

const ENV = "production"

const pgConfig = {};

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

if (ENV === "production") {
  pgConfig.connectionString = process.env.DATABASE_URL;
  pgConfig.max = 2;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const db = new Pool(pgConfig);

module.exports = db;
