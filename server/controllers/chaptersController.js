const chapterDB = require('../model/chapters')
const sectionsDB = require('../model/sections')
const documentationDB = require('../model/documentations')
const mongo = require('mongodb')

// Get all chapters info
const getAllChapters = async (req, res) => {
    try {
        const Chapters = await chapterDB()
        const chapters = await Chapters.find({}).toArray()

        if (!chapters.length) {
            return res.status(200).json([]);
        }

        return res.status(200).send(chapters)
    } catch (err) {
        return res.status(500).json({ "message": "Failed to get chapters" });
    }
}

// Get specified chapters info
const getChaptersById = async (req, res) => {
    try {
        const chapterId = req.params.id;
        const Chapters = await chaptersDB();

        // Convert chapter id to mongo object id
        let objectId = new mongo.ObjectId(chapterId);

        const chapters = await Chapters.find({_id : objectId}).toArray();

        // Check if any chapter found
        if(!chapters.length){
            return res.status(404).json({ "message": `No chapters matches ID ${chapterId}.` });
        }
        
        return res.status(200).send(chapters);
    } catch (err) {
        return res.status(500).json({ "message": "Failed to get chapter by id" });
    }
}

// Create chapters info
const createNewChapter = async (req, res) => {
    try {
        const Chapters = await chapterDB();
        const Documentation = await documentationDB();

        // Get user data from the session
        const userDataSession = req.session?.user;
        if(!userDataSession) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const chapter = {
            title: req.body.title,
            version: req.body.version,
            createdBy: userDataSession.username,
            createdAt: new Date(),
            updatedAt: new Date() 
        }

        // masukan chapter baru
        const insertedChapter = await Chapters.insertOne(chapter)

        // masukan chapter baru didalam dokumen
        const result = await Documentation.updateOne(
            { content: { $elemMatch: { "version": `${req.body.version[0]}` } } },
            { $push: { "content.$.chapter": { "_id": insertedChapter.insertedId, "title": `${req.body.title}`, "createdBy": userDataSession.username, "section": [] } } }
        )

        // cek ketika chapter baru dimasukan kedalam dokumen
        if ( result.modifiedCount == 0 ) {
            // Cancel inserting new sections
            await Chapters.deleteOne({ _id: insertedChapter.insertedId });
            return res.status(500).send({ message: "Chapter is not created in documentations database. Please check ID Documentation properly!" });
        }

        return res.status(201).send({ message : "Chapter is successfully created!", data: chapter })
    } catch (err) {
        return res.status(500).json({ message: "Failed to create chapter" });
    }
}

const updateChapter = async (req, res) => {
    try {
        let chapterId = new mongo.ObjectId(req.body.id)

        const Chapters = await chapterDB();
        const Documentation = await documentationDB();
    
        // Get user data from the session
        const userDataSession = req.session?.user;
        if(!userDataSession) {
            return res.status(401).send({ message: "Unauthorized" });
        }
    
        const chapter = {
            title: req.body.title,
            updatedAt: new Date(),
            updatedBy: userDataSession.username
        }

        // update section in section collections
        const result = await Chapters.findOneAndUpdate(
            { _id: chapterId },
            { $set: chapter },
            { returnDocument: 'after' }
        );

        const updatedChapter = result.value;

        // Check if update success for id
        if(!updatedChapter) {
            return res.status(404).json({ "message": `No chapters matches ID ${chapterId}.` });
        }
        
        // update judul chapter
        await Documentation.updateOne(
            { "content.chapter._id": chapterId },
            { $set: { "content.$[c].chapter.$[ch].title": `${chapter.title}`, "content.$[c].chapter.$[ch].updatedBy": userDataSession.username } },
            { arrayFilters: [ { "c.chapter._id": chapterId }, { "ch._id": chapterId } ] }
        )

        return res.status(200).send({ message : "Chapter is successfully Updated!", data: updatedChapter })
    } catch (err) {
        return res.status(500).json({ message: "Failed to update chapter" });
    }
}

const deleteChapter = async (req, res) => {
    try {
        let content = req.body.content;
        let chapterId = new mongo.ObjectId(req.body.chapterId)

        const section = []

        for (const ct of content) {
            // Cek jka chapter sudah ada
            if(!ct?.chapter) { break }

            const chapter = ct.chapter.find((c) => c._id == chapterId)

            if(!chapter?.section) { continue }

            const sectionId = chapter.section.map((sc) => new mongo.ObjectId(sc._id))

            section.push({version: ct.version, section: sectionId})
        }

        const Sections = await sectionsDB();
        const Chapter = await chapterDB();
        const Documentation = await documentationDB();

        // Delete chapter in chapter collections
        let result = await Chapter.findOneAndDelete(
            { _id: chapterId },
            { returnDocument: 'after' }
        )

        const deletedChapter = result.value;

        // Check if delete success for id
        if(!deletedChapter) {
            return res.status(404).json({ "message": `No chapters matches ID ${chapterId}.` });
        }

        // menghapus chapter di struktur dokumentasi
        result = await Documentation.updateOne(
            {},
            { $pull: { "content.$[].chapter": { _id: chapterId } } }
        )

        // Delete version from chapter in section
        for (const sc of section) {
            result = await Sections.updateMany(
                { _id: { $in: sc.section } },
                { $pull: { version: sc.version } }
            )
        }

        return res.status(200).send({ message : "Chapter is successfully deleted!", data: deletedChapter });
    } catch (err) {
        return res.status(500).send({ message: "Failed to delete chapter" });
    }
}

module.exports = {
    getAllChapters,
    getChaptersById,
    createNewChapter,
    updateChapter,
    deleteChapter
}