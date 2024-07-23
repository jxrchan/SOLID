const express = require('express');
const { register, login, refresh } = require('../controllers/auth');
const {checkErrors} = require('../validators/checkErrors');
const { validateRegistrationData, validateLoginData, validateRefreshToken } = require('../validators/auth');
const router = express.Router();

router.put('/register', validateRegistrationData, checkErrors ,register);
router.post('/login', validateLoginData, checkErrors ,login);
router.post('/refresh', validateRefreshToken, checkErrors, refresh);


module.exports = router