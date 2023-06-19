const express = require('express');
const router = express.Router();
const documentationsController = require('../../controllers/documentationsController')
const { verifyJWT } = require("../../middleware/verifyJWT")

// Validations Middleware
const { validate } = require("../../middleware/validation")

// Validators Rules
const { createDocumentationRules, updateMetadataRules, updateDocumentationRules, deleteDocumentationRules } = require("../../validators/documentationValidator")

router.route('/')
    .get(documentationsController.getAllDocumentationContent)
    .post(verifyJWT, createDocumentationRules, validate, documentationsController.createNewDocumentation)
    .put(verifyJWT, updateDocumentationRules, validate, documentationsController.updateDocumentation)

router.route('/:id')
    .delete(verifyJWT, deleteDocumentationRules, validate, documentationsController.deleteDocumentation);

router.route('/version')
    .get(documentationsController.getAllVersions);

router.route('/metadata')
    .get(documentationsController.getMetadata)
    .put(verifyJWT, updateMetadataRules, validate, documentationsController.updateMetadata)

module.exports = router;