const ObjectId = require('mongodb').ObjectId;

const isObjectId = (id) => ObjectId.isValid(id);

module.exports = {
    isObjectId
}