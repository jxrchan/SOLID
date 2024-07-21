const express = require("express");
const router = express.Router();
const db = require("../db/db");
const {multerUpload, cloudinaryProcessImageAndUpload} = require('../middleware/imageUpload')

// getting test
router.get("", async (req, res, next) => {
  try {
    const samples = await db.query("SELECT * FROM sample");
    res.json(samples.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting data" });
  }
});

// seeding test
router.put("", async (req, res, next) => {
  try {
    await db.query(`
        INSERT INTO sample (name, address) 
        VALUES ('John', 'Lor 2 Toa Payoh'),
        ('Eric', 'Katong'),
        ('Mandy', 'Tiong Bahru')`);
    res.status(200).json({ status: "ok", msg: "seeded successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error seeding data" });
  }
});

router.post("/upload", multerUpload.single('image'), cloudinaryProcessImageAndUpload);

module.exports = router;
