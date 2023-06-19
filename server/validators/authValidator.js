const { body } = require('express-validator');

const loginRules = [
    body('username')
        .notEmpty().withMessage("username is required").bail()
        .isString().withMessage("username must be a string").bail()
        .isLength({ min: 4 }).withMessage("password at least must be 4 character or longer"),
    body('password')
        .notEmpty().withMessage("password is required").bail()
        .isString().withMessage("password must be a string").bail()
        .isLength({ min: 8 }).withMessage("password at least must be 8 character or longer")
];

module.exports = {
    loginRules
};