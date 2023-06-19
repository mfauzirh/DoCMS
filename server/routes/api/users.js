const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const { verifyJWT } = require("../../middleware/verifyJWT")

router.route('/')
    .get(usersController.getAllUsers)
    .put(verifyJWT, usersController.updateUser)
    .delete(verifyJWT, usersController.deleteUser);

router.route('/:id')
    .get(usersController.getUserById);

router.route('/username/:username')
    .get(usersController.getUserByUsername);

module.exports = router;