const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  host: "localhost",
  port: 5432,
  database: process.env.DATABASE
});


module.exports = {
  pool,
  // query: (text, params) => pool.query(text, params),
};
