const User = require('../model/users');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    try {
        const Users = await User()
        const { email, firstname, lastname, username, password } = req.body;

        // check for duplicate usernames in the db
        const duplicate = await Users.find({ username: req.body.username }).toArray();
        if (typeof duplicate != 'undefined' && duplicate.length > 0) {
            return res.status(409).json({ 'message': 'Username is already taken.' }); //Conflict 
        }

        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await Users.insertOne({
            "email": email,
            "firstname": firstname,
            "lastname": lastname,
            "username": username,
            "password": hashedPwd
        });

        if(!result?.acknowledged) {
            return res.status(500).send({ message: "Failed to insert user into database" });
        }

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': "Failed to register new user" });
    }
}

module.exports = { handleNewUser };