const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const {pool} = require('../db/db')

const checkEmailValidity = async (req, res) => {
  const client = await pool.connect();
    try {
      const {rows: user} = await client.query('SELECT * FROM users WHERE email = $1 LIMIT 1', 
          [req.body.email]);
      if (user.length !== 0) {
        return res.status(400).json({ status: "error", msg: "duplicate email" });
  }
      else res.status(200).json({status:'ok', msg: 'Email is valid, user can proceed to complete registration'})
} catch(error) {
  console.error(error);
  res.json({status: 'error', msg: 'Error retrieving emails'})
} finally {
  client.release()
}}


const register = async (req, res) => {
    const client = await pool.connect();
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    await client.query('INSERT INTO users (email, password, role, name, gender, description ) VALUES ($1, $2, $3, $4, $5, $6)', 
        [req.body.email, hash, req.body.role, req.body.name, req.body.gender, req.body.description] );
    res.status(200).json({ status: "ok", msg: "user created" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error registering" });
  } finally 
  {client.release();}
};

const login = async (req, res) => {
const client = await pool.connect();
  try {
    const {rows: user} = await client.query('SELECT * FROM users WHERE email = $1 LIMIT 1',[req.body.email]);
    console.log(JSON.stringify(user));
    if (user.length === 0) {
      return res.status(401).json({ status: "error", msg: "not registered" });
    }
    const result = await bcrypt.compare(req.body.password, user[0].password);
    if (!result) {
      console.log("email or password error");
      return res.status(401).json({ status: "error", msg: "login failed" });
    }
    const claims = {
      id: user[0].id,
      email: user[0].email,
      role: user[0].role,
    };
    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.status(200).json({ access, refresh });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "login failed" });
  } finally {
    client.release();
  }
};

const refresh = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);
    //Checks if access token (true)
    const claims = { id: decoded.id, email: decoded.email, role: decoded.role };
    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    res.json({ access });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "refresh error" });
  }
};

module.exports = {checkEmailValidity, register, login, refresh };
