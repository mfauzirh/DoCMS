const { MongoClient } = require("mongodb")

const connectionString = process.env.MONGO_URI

const sectionsDB = async () => {
    try {
        const client = await MongoClient.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        return client.db('cms_docs').collection('sections')
    } catch (err) {
        console.error('Error connecting to MongoDB: ', err);
        setTimeout(sectionsDB, 5000);
    }
}

module.exports = sectionsDB