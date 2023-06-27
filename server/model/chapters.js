const { MongoClient } = require("mongodb")

const connectionString = process.env.MONGO_URI

const chaptersDB = async () => {
    try {
        const client = await MongoClient.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        return client.db('docms').collection('chapters')
    } catch (err) {
        console.error('Error connecting to MongoDB: ', err);
        setTimeout(chaptersDB, 5000);
    }
}

module.exports = chaptersDB