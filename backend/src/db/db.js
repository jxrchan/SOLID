const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  host: "localhost",
  port: 5432,
  database: process.env.DATABASE
});

/* ------------ Testing Connection ------------- */
// const checkConnection = async () => {
//   try {
//     const res = await pool.query("SELECT NOW()");
//     console.log("Successfully connected to the database at:", res.rows[0].now);
//   } catch (err) {
//     console.error("Error connecting to the database:", err);
//   } finally {
//     await pool.end();
//   }
// };
// checkConnection(); 

module.exports = {
  pool
};
