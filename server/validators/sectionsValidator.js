const { body, param } = require('express-validator');
const { isObjectId } = require('./customValidator');

const getSectionByIdRules = [
    param('id')
        .notEmpty().withMessage("id is required").bail()
        .isString().withMessage("id must be a string").bail()
        .custom(isObjectId).withMessage("id is invalid")
];

const createSectionRules = [
    body('title')
        .notEmpty().withMessage("title is required").bail()
        .isString().withMessage("title must be a string"),
    body('content')
        .notEmpty().withMessage("content is required").bail()
        .isString().withMessage("content must be a string"),
    body('alias')
        .optional()
        .notEmpty().withMessage("alias is required").bail()
        .isString().withMessage("alias must be a string")
];

const updateSectionRules = [
    body('id')
        .notEmpty().withMessage("id is required").bail()
        .isString().withMessage("id must be a string").bail()
        .custom(isObjectId).withMessage("id is invalid"),
    body('title')
        .notEmpty().withMessage("title is required").bail()
        .isString().withMessage("title must be a string"),
    body('content')
        .notEmpty().withMessage("content is required").bail()
        .isString().withMessage("content must be a string"),
    body('alias')
        .optional()
        .notEmpty().withMessage("alias is required").bail()
        .isString().withMessage("alias must be a string")
];

const deleteSectionRules = [
    param('id')
        .notEmpty().withMessage("id is required").bail()
        .isString().withMessage("id must be a string").bail()
        .custom(isObjectId).withMessage("id is invalid")
];

module.exports = {
    getSectionByIdRules,
    createSectionRules,
    updateSectionRules,
    deleteSectionRules
};