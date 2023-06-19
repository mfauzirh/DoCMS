const sectionsDB = require('../model/sections')
const documentationDB = require('../model/documentations')
const mongo = require('mongodb')

// Get all sections info
const getAllSections = async (req, res) => {
    try {
        const Sections = await sectionsDB();

        const sections = await Sections.find({}).toArray();

        // Check if any section found
        if (!sections.length) {
            return res.status(200).json([]);
        }

        return res.status(200).send(sections);
    } catch (error) {
        return res.status(500).json({ "message": "Failed to get sections" });
    }
}

// Get specified sections info
const getSectionsById = async (req, res) => {
    try {
        const sectionId = req.params.id;
        const Sections = await sectionsDB();

        // Convert section id to mongo object id
        let objectId = new mongo.ObjectId(sectionId);

        const sections = await Sections.find({_id : objectId}).toArray();

        // Check if any section found
        if(!sections.length){
            return res.status(404).json({ "message": `No sections matches ID ${sectionId}.` });
        }
        
        return res.status(200).send(sections);
    } catch (error) {
        return res.status(500).json({ "message": "Failed to get section" });
    }
}

// Create documentation info
const createNewSection = async (req, res) => {
    try {
        const Sections = await sectionsDB()

        // Get user data from the session
        const userDataSession = req.session?.user;
        if(!userDataSession) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const section = {
            title: req.body.title,
            content: req.body.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userDataSession.username,
            ...(req.body?.alias && { alias: req.body.alias })
        }
        
        const result = await Sections.insertOne(section)

        // check if insert success
        if(!result?.acknowledged) {
            return res.status(500).send({ message: "Failed to insert section into database" });
        }

        return res.status(201).send({ message : "Sections Data Created!", data: section })
    } catch (err) {
        return res.status(500).send({ message: "Failed to create section" })
    }
}

const updateSection = async (req, res) => {
    try {
        const Sections = await sectionsDB();
        const Documentation = await documentationDB();

        let sectionId = new mongo.ObjectId(req.body.id)  

        // Get user data from the session
        const userDataSession = req.session.user;
        if(!userDataSession) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const section = {
            title: req.body.title,
            content: req.body.content,
            updatedBy: userDataSession.username,
            updatedAt: new Date(),
            ...(req.body?.alias && { alias: req.body.alias })
        }

        // update section in section collections
        const result = await Sections.findOneAndUpdate(
            { _id: sectionId },
            { $set: section },
            { returnDocument: 'after' }
        );

        const updatedSection = result.value;

        // Check if update success for id
        if(!updatedSection) {
            return res.status(404).json({ "message": `No sections matches ID ${sectionId}.` });
        }

        await Documentation.updateOne(
            {},
            { $set: { "content.$[].chapter.$[].section.$[sc].title": section.title } },
            { arrayFilters: [ { "sc._id": sectionId } ] }
        );

        return res.status(200).send({ message : "Sections Data Updated!", data: updatedSection });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Failed to update section" });
    }
}

const deleteSection = async (req, res) => {
    try {
        const Sections = await sectionsDB()
        const Documentation = await documentationDB();

        let sectionId = new mongo.ObjectId(req.params.id)

        // Delete section in section collections
        const result = await Sections.findOneAndDelete(
            { _id: sectionId },
            { returnDocument: 'after' }
        )

        const deletedSection = result.value;

        // Check if delete success for id
        if(!deletedSection) {
            return res.status(404).json({ "message": `No sections matches ID ${sectionId}.` });
        }
        
        // Delete section from documentation content if exist
        await Documentation.updateOne(
            { 
                "content.chapter.section._id": sectionId 
            },
            { 
                $pull: { 
                    "content.$[].chapter.$[].section": { 
                        "_id": sectionId 
                    } 
                } 
            }
        );
        return res.status(200).send({ message : "Sections Data Deleted!", data: deletedSection });
    } catch (error) {
        return res.status(500).send({ message: "Failed to delete section" });
    }
}

module.exports = {
    getAllSections,
    getSectionsById,
    createNewSection,
    updateSection,
    deleteSection
}