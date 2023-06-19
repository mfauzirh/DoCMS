const { body, param } = require('express-validator');
const { isObjectId } = require('./customValidator');

const createDocumentationRules = [
    body('title')
        .notEmpty().withMessage('title is required').bail()
        .isString().withMessage('title must be a string'),
    body('logo')
        .notEmpty().withMessage('logo is required').bail()
        .isString().withMessage('logo must be a string'),
    body('description')
        .notEmpty().withMessage('description is required').bail()
        .isString().withMessage('description must be a string'),
    body('githubLink')
        .notEmpty().withMessage('githubLink is required').bail()
        .isArray().withMessage('githubLink must be a array'),
    body('footer')
        .notEmpty().withMessage('footer is required').bail()
        .isString().withMessage('footer must be a string'),
    body('content')
        .notEmpty().withMessage('content is required').bail()
        .isArray().withMessage('content must be a array'),
];

const updateMetadataRules = [
    body('title')
        .notEmpty().withMessage('title is required').bail()
        .isString().withMessage('title must be a string'),
    body('logo')
        .notEmpty().withMessage('logo is required').bail()
        .isString().withMessage('logo must be a string'),
    body('githubLink')
        .notEmpty().withMessage('githubLink is required').bail()
        .isString().withMessage('githubLink must be a array'),
    body('footer')
        .notEmpty().withMessage('footer is required').bail()
        .isString().withMessage('footer must be a string'),
];

const updateDocumentationRules = [
    body('title')
        .notEmpty().withMessage('title is required').bail()
        .isString().withMessage('title must be a string'),
    body('logo')
        .notEmpty().withMessage('logo is required').bail()
        .isString().withMessage('logo must be a string'),
    body('description')
        .notEmpty().withMessage('description is required').bail()
        .isString().withMessage('description must be a string'),
    body('githubLink')
        .notEmpty().withMessage('githubLink is required').bail()
        .isArray().withMessage('githubLink must be a array'),
    body('footer')
        .notEmpty().withMessage('footer is required').bail()
        .isString().withMessage('footer must be a string'),
];

const deleteDocumentationRules = [
    param('id')
        .notEmpty().withMessage("id is required").bail()
        .isString().withMessage("id must be a string").bail()
        .custom(isObjectId).withMessage("id is invalid")
];

module.exports = { createDocumentationRules, updateMetadataRules, updateDocumentationRules, deleteDocumentationRules };