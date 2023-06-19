const express = require('express');
const router = express.Router();
const sectionsController = require('../../controllers/sectionsController');
const { verifyJWT } = require("../../middleware/verifyJWT");
const { validate } = require("../../middleware/validation");
const { 
    getSectionByIdRules,
    createSectionRules,
    updateSectionRules,
    deleteSectionRules
} = require("../../validators/sectionsValidator");

router.route('/')
    .get(sectionsController.getAllSections)
    .post(verifyJWT, createSectionRules, validate, sectionsController.createNewSection)
    .put(verifyJWT, updateSectionRules, validate, sectionsController.updateSection);

router.route('/:id')
    .get(getSectionByIdRules, validate, sectionsController.getSectionsById)
    .delete(verifyJWT, deleteSectionRules, validate, sectionsController.deleteSection);

module.exports = router;