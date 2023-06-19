const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { validate } = require("../middleware/validation");
const { loginRules } = require ('../validators/authValidator');

router.post('/', loginRules, validate, authController.handleLogin);
router.get('/:token', authController.checkToken)

module.exports = router;