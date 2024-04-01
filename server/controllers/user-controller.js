const User = require('../models/user-model');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const key = process.env.A_SECRET_KEY

class UserController {

    //Register a new user
    register = async (req, res) => {
        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase()
        }
        //Checking for duplicate email
        const dupe = await User.find({ email: req.body.email })
        if (dupe.length !== 0) {
            return res.json({ errors: { email: { message: "Email is already in use!" } } })
        }

        User.create(req.body)
            .then(user => {
                console.log(req.body)
                console.log("User created successfully")
                const userToken = jwt.sign({ id: user._id }, key);
                res.cookie("usertoken", userToken, key, { httpOnly: true })
                    .json({ user: user })
            })
            .catch(error => {
                res.json(error);
                console.log(error);
                console.log(req.body)
            })
    }

    //Login the user
    login = async (req, res) => {
        console.log(req.body)
        const user = await User.findOne({email: req.body.email.toLowerCase()});
        if (!user) {
            console.log("User not found")
            return res.sendStatus(400);
        }

        const correctPassword = await bcrypt.compare(req.body.password, user.password);
        if (!correctPassword) {
            console.log("Incorrect password")
            return res.sendStatus(400);
        }

        const userToken = jwt.sign({id: user._id}, key)

        res.cookie("usertoken", userToken, key, {httpOnly: true})
            .json({user: user})
    }

    //Logout the user by clearing the cookie
    logout = (req, res) => {
        res.clearCookie('usertoken');
        res.sendStatus(200);
    }

    //Get the user from the token
    getCurrent = async (req, res) => {
        try {
            if (!req.cookies.usertoken) {
                return res.status(401).json({ message: "No user token provided." });
            }

            const userData = jwt.verify(req.cookies.usertoken, key);
            const user = await User.findOne({ _id: userData.id });

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            res.json(user);
        } catch (error) {
            console.error("Error in getCurrent:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    //Get all users (FOR TESTING ONLY!!)
    getAll = (req, res) => {
        User.find()
            .then(users => res.json(users))
            .catch(error => res.json(error))
    }

    getDeselectedCalendars = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const deselectedCalendars = user.deselected_calendars;
            res.status(200).json(deselectedCalendars);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new UserController();