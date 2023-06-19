const documentationDB = require('../model/documentations')
const userCollection = require('../model/users');
const mongo = require('mongodb')
const bcrypt = require('bcrypt')

const getAllDocumentationContent = async (req, res) => {
    try {
        const Documentations = await documentationDB()
        const documentations = await Documentations.find({}).toArray()

        if (!documentations.length) {
            return res.status(200).json([]);
        }

        return res.status(200).send(documentations)
    } catch (e) {
        return res.status(500).json({ "message": "Failed to get documentations" });
    }
}

// Get all versions
const getAllVersions = async (req, res) => {
    try {
        const Documentations = await documentationDB()
        const documentations = await Documentations.find({}).project({"content.version": 1}).toArray()

        if (!documentations.length) {
            return res.status(200).json([]);
        }

        return res.status(200).send(documentations)
    } catch (error) {
        return res.status(500).json({ "message": "Failed to get all versions" });
    }
}

// Get all Metadatas
const getMetadata = async (req, res) => {
    try {
        const Documentations = await documentationDB()
        const User = await userCollection()

        let webMetadata = await Documentations.find({}).project({
            "title": 1,
            "logo": 1,
            "githubLink": 1,
            "footer": 1
        }).toArray()
        
        let userMetadata = await User.find({}).project({
            "username" : 1
        }).toArray()

        // If database is empty, returns 200 status code with empty array (Tester: Rafli)
        if (webMetadata.length === 0 || userMetadata.length === 0) {
            return res.status(200).send([]);
        }

        const metadata = {
            "title" : webMetadata[0].title,
            "logo": webMetadata[0].logo,
            "githubLink": webMetadata[0].githubLink,
            "footer": webMetadata[0].footer,
            "username" : userMetadata[0].username
        }

        return res.status(200).send(metadata)
    } catch (error) {
        return res.status(500).json({ "message": "Failed to get metadata" });
    }
}

const updateMetadata = async (req,res) => {
    try {
        const Documentations = await documentationDB()
        const User = await userCollection()
    
        // Get user data from the session
        const userDataSession = req.session?.user;
        if(!userDataSession) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        let metadata = {
            "title" : req.body.title,
            "logo" : req.body.logo,
            "githubLink" : req?.body?.githubLink,
            "footer" : req.body.footer,
            "updatedBy": userDataSession.username
        }
        
        const result = await Documentations.updateOne(
            {}, 
            { $set : metadata },
            { returnDocument: 'after' }
        )

        const updatedMetadata = result.value;
        
        return res.status(200).send({ message : "Metadata is successfully Updated!", data: updatedMetadata })
    } catch (err) {
        return res.status(500).json({ message: "Failed to update metadata" });
    }
}

// Create documentation info
const createNewDocumentation = async (req, res) => {
    try {
        const Documentations = await documentationDB()

        // Get user data from the session
        const userDataSession = req.session?.user;
        if(!userDataSession) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        // Documentations collection should be only 1 document at a time
        Documentations.countDocuments({}, function(err, count) {
            if(err) throw err;
            else if (count >= 1) {
                res.status(409).send({
                    message : "There's already another documentations. Documentation should be only one data/document" 
                })
            }
        })

        const documentation = {
            title : req.body.title,
            logo : req.body.logo,
            description : req.body.description,
            githubLink : req?.body?.githubLink,
            footer : req.body.footer,
            content : req.body.content,
            createdBy: userDataSession.username,
            createdAt : new Date(),
            updatedAt : new Date()
        }

        // insert documentation
        const insertedDocumentation = await Documentations.insertOne(documentation)

        return res.status(201).send({ message : "Documentation is successfully created!", data: documentation })
    } catch (err) {
        return res.status(500).json({ message: "Failed to create documentation" });
    }
}

// Edit documentation info
const updateDocumentation = async (req, res) => {
    try {
        const Documentations = await documentationDB()

        // Get user data from the session
        const userDataSession = req.session?.user;
        if(!userDataSession) {
            return res.status(401).send({ message: "Unauthorized" });
        }
    
        const documentation = {
            title : req.body.title,
            logo : req.body.logo,
            description : req.body.description,
            githubLink : req.body.githubLink,
            footer : req.body.footer,
            updatedAt : new Date(),
            updatedBy: userDataSession.username
        }

        const result = await Documentations.updateOne(
            {},
            { $set: documentation },
            { returnDocument: 'after' }
        );

        const updatedDocumentation = result.value;
        
        return res.status(200).send({ message : "Documentation is successfully Updated!", data: updatedDocumentation })
    } catch (err) {
        return res.status(500).json({ message: "Failed to update Documentation" });
    }
}

// Delete documentation info
const deleteDocumentation = async (req, res) => {
    try {
        const Documentations = await documentationDB()
        let documentationId = new mongo.ObjectId(req.params.id)

        // Delete chapter in chapter collections
        let result = await Documentations.findOneAndDelete(
            { _id: documentationId },
            { returnDocument: 'after' }
        )

        const deletedDocumentation = result.value;

        // Check if delete success for id
        if(!deletedDocumentation) {
            return res.status(404).json({ "message": `No documentations matches ID ${documentationId}.` });
        }
        
        return res.status(200).send({ message : "Documentation is successfully deleted!", data: deletedDocumentation });
    } catch (err) {
        return res.status(500).send({ message: "Failed to delete documentation" });
    }
}

module.exports = {
    getAllDocumentationContent,
    getAllVersions,
    createNewDocumentation,
    updateDocumentation,
    deleteDocumentation,
    getMetadata,
    updateMetadata,
}