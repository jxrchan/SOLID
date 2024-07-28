const express = require('express');
const { register, login, refresh, checkEmailValidity } = require('../controllers/auth');
const {checkErrors} = require('../validators/checkErrors');
const { validateRegistrationData, validateLoginData, validateRefreshToken, validateEmailCheck } = require('../validators/auth');
const router = express.Router();

router.post('/email', validateEmailCheck, checkErrors, checkEmailValidity);
router.post('/register', validateRegistrationData, checkErrors ,register);
router.post('/login', validateLoginData, checkErrors ,login);
router.post('/refresh', validateRefreshToken, checkErrors, refresh);


module.exports = router