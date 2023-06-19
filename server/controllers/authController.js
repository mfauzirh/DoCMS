const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    try {
        const Users = await User()
        const { username, password } = req.body;
        
        // Check if user with username exist
        let foundUser = await Users.find({ username: username }).toArray();
        if (!foundUser.length) {
            return res.status(401).send({ message: "Invalid username" });
        }

        // Compare password inputed with database
        const user = foundUser[0];
        const match = await bcrypt.compare(password, user.password);

        if(!match) {
            return res.status(401).send({ message: "Invalid password" });
        }

        // Set access token
        const accessToken = jwt.sign(
            { "username": user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );

        // Set refresh token
        const refreshToken = jwt.sign(
            { "username": user.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // update refresh token
        const result = await Users.updateOne(
            { _id: user._id },
            { $set: { refreshToken: refreshToken } }
        );

        if(result.modifiedCount === 0) {
            return res.status(500).send({ message: "Unable to update user data in database" });
        }

        // Remove password from user
        delete user.password;

        // Set user data in the session
        req.session.user = user;
        
        return res.json({ accessToken, user: user });
    } catch (error) {
        return res.status(500).send({ message: "Unable to login due server error" });
    }
}

const checkToken = async (req,res) => {
    try {
    const Users = await User()
    const token = req.params.token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let foundUser = await Users.find({ username: decoded.username }).toArray();
        if (!foundUser) return res.status(401).send("Username Tidak Ditemukan");
        const accessToken = jwt.sign(
            { "username": decoded.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
        res.status(200).send(accessToken)
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports = { handleLogin, checkToken };