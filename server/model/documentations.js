const { MongoClient } = require("mongodb")

const connectionString = process.env.MONGO_URI

const documentationDB = async () => {
    try {
        const client = await MongoClient.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        return client.db('docms').collection('documentations')
    } catch (err) {
        console.error('Error connecting to MongoDB: ', err);
        setTimeout(documentationDB, 5000);
    }
}

module.exports = documentationDB