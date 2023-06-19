const UserDB = require('../model/users');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const mongo = require('mongodb')

const getAllUsers = async (req, res) => {
    const Users = await UserDB();
    if (!Users) return res.status(204).json({ 'message': 'No users found' });
    res.status(200).send(await Users.find({}).toArray())
}

const getUserById = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Users ID required.' });

    const Users = await UserDB()
    let objectId = new mongo.ObjectId(req.params.id)

    if (!Users) {
        return res.status(204).json({ "message": `No users matches ID ${req.params.id}.` });
    }
    
    res.status(200).send(await Users.find({_id : objectId}).toArray())
}

const getUserByUsername = async (req, res) => {
    if (!req?.params?.username) return res.status(400).json({ 'message': 'Username required.' });

    const Users = await UserDB()

    if (!Users) {
        return res.status(204).json({ "message": `No users matches usernames ${req.params.username}.` });
    }
    
    res.status(200).send(await Users.find({username : req.params.username}).toArray())
}


//////////////////////////////////////////////////
////   UPDATE USER PROFILE WITH RESET PASSWORD
/////////////////////////////////////////////////
const updateUser = async (req,res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Users ID required.' });

    if(!req?.body?.email || !req?.body?.firstname || !req?.body?.lastname || !req?.body?.username) {
        return res.status(400).json({'message': 'Please fill all required field'});
    }

    let userId = new mongo.ObjectId(req.body.id)

    const Users = await UserDB()

    // Get user data from the session
    const userDataSession = req.session.user;

    // Check if old password is correct before updating new password
    let hashedPassword
    if(req.body.oldPassword && req.body.newPassword) {
        const user = await Users.find({_id : userId}).toArray()
        // console.log(user)
        const match = await bcrypt.compare(req.body.oldPassword, user[0].password);
        if(!match) res.status(401).send({ message : "Old Password is incorrect" })
        
        // New Password Config
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
    }
    
    // check for duplicate usernames in the db
    // only for if it is different from the current username
    if(req.body.username != userDataSession.username) {
        const duplicate = await Users.find({ username: req.body.username }).toArray();
        // console.log(duplicate.length);
        if (typeof duplicate != 'undefined' && duplicate.length > 0) return res.status(409).json({ message: 'Username is already taken.' }); //Conflict 
    }
    
    let userData = {
        "email" : req.body.email,
        "firstname" : req.body.firstname,
        "lastname" : req.body.lastname,
        "username" : req.body.username,
        "updatedBy": userDataSession.username,
        "profilePicture" : req.body.profilePicture
    }

    if(req.body.alias && req.body.alias.length != 0) userData.alias = req.body.alias;

    try {
        // update users in users collections
        await Users.updateOne(
            { _id: userId },
            { $set: userData }
        )
        
        if(req.body.oldPassword && req.body.newPassword) {
            // update password 
            await Users.updateOne(
                { _id: userId },
                { 
                    $set : {
                        "password" : hashedPassword
                    }
                }
            )
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
    res.status(201).send({ message : "Users Data Updated!" })
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'UserDB ID required' });

    const Users = await UserDB()
    let objectId = new mongo.ObjectId(req.body.id)

    const result = await Users.deleteOne({ _id: objectId });

    if(result.deletedCount != 0) 
        res.status(201).send({ message : "Users Data Deleted!" })
    else
        res.status(400).json({ message: `No users matches ID ${req.body.id}.` });
}

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUserById,
    getUserByUsername,
}