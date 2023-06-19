const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

const { validate } = require("../middleware/validation");
const { registerRules } = require ('../validators/registerValidator');

router.post('/', registerRules, validate, registerController.handleNewUser);

module.exports = router;