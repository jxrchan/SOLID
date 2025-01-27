require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const auth = require('./src/routers/auth')
const users = require("./src/routers/users");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

//Create Express App
const app = express();


//Middleware - runs first whenever any endpoint is called
app.use(cors());
app.use(helmet());
app.use(limiter);

//read JSON of your body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routing
app.use('/auth', auth);
app.use('/users', users);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
