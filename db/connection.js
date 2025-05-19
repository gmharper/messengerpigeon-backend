const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

const pgConfig = {};

if (ENV === "production") {
  pgConfig.connectionString = process.env.DATABASE_URL;
  pgConfig.max = 2;
}

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const db = new Pool(pgConfig);

module.exports = db;
