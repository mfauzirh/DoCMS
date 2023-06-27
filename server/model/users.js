const { MongoClient } = require("mongodb")

const connectionString = process.env.MONGO_URI

const usersDB = async () => {
    try {
        const client = await MongoClient.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        return client.db('docms').collection('users')
    } catch (err) {
        console.error('Error connecting to MongoDB: ', err);
        setTimeout(usersDB, 5000);
    }
}

module.exports = usersDB