const { body } = require('express-validator');

const registerRules = [
    body('firstname')
        .notEmpty().withMessage("firstname is required").bail()
        .isString().withMessage("firstname must be a string").bail()
        .isLength({ min: 4 }).withMessage("firstname at least must be 4 character or longer"),
    body('lastname')
        .notEmpty().withMessage("lastname is required").bail()
        .isString().withMessage("lastname must be a string").bail()
        .isLength({ min: 4 }).withMessage("lastname at least must be 4 character or longer"),
    body('email')
        .notEmpty().withMessage("email is required").bail()
        .isString().withMessage("email must be a string").bail()
        .normalizeEmail().isEmail().withMessage("email is not valid"),
    body('username')
        .notEmpty().withMessage("username is required").bail()
        .isString().withMessage("username must be a string").bail()
        .isLength({ min: 4 }).withMessage("username at least must be 4 character or longer"),
    body('password')
        .notEmpty().withMessage("password is required").bail()
        .isString().withMessage("password must be a string").bail()
        .isLength({ min: 8 }).withMessage("password at least must be 8 character or longer"),
];

module.exports = { registerRules }