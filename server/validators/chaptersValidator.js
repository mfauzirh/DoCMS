const { body, param } = require('express-validator');
const { isObjectId } = require('./customValidator');

const getChapterByIdRules = [
  param('id')
      .notEmpty().withMessage("id is required").bail()
      .isString().withMessage("id must be a string").bail()
      .custom(isObjectId).withMessage("id is invalid")
];

const createChapterRules = [
  body('title')
    .notEmpty().withMessage('title is required').bail()
    .isString().withMessage('title must be a string'),
  body('version')
    .notEmpty().withMessage('version is required').bail()
    .isArray().withMessage('version must be an array').bail(),
];

const updateChapterRules = [
  body('id')
    .notEmpty().withMessage("id is required").bail()
    .isString().withMessage("id must be a string").bail()
    .custom(isObjectId).withMessage("id is invalid"),
  body('title')
    .notEmpty().withMessage('title is required').bail()
    .isString().withMessage('title must be a string')
];

const deleteChapterRules = [
  body('chapterId')
      .notEmpty().withMessage("chapterId is required").bail()
      .isString().withMessage("chapterId must be a string").bail()
      .custom(isObjectId).withMessage("chapterId is invalid"),
  body('content')
      .notEmpty().withMessage('content is required').bail()
      .isArray().withMessage('content must be a array'),
];

module.exports = { getChapterByIdRules, createChapterRules, updateChapterRules, deleteChapterRules };