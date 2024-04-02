const User = require('../models/user-model');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const key = process.env.A_SECRET_KEY

const Calendar = require('../models/calendar-model');
const ExpenseType = require('../models/expense-type-model');

class UserController {
    //Register a new user
    register = async (req, res) => {
        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase();
        }
        //Checking for duplicate email
        const dupe = await User.find({ email: req.body.email });
        if (dupe.length !== 0) {
            return res.json({ errors: { email: { message: "Email is already in use!" } } });
        }

        try {
            const user = await User.create(req.body);

            // Create a new "Personal" calendar for the user
            const personalCalendar = new Calendar({
                owner_id: user._id,
                name: "Personal",
            });
            await personalCalendar.save();

            // Create a new "Personal" expense type for the user
            const personalExpenseType = new ExpenseType({
                owner_id: user._id,
                name: "Personal",
            });
            await personalExpenseType.save();

            const userToken = jwt.sign({ id: user._id }, key);
            res.cookie("usertoken", userToken, key, { httpOnly: true })
                .json({ user: user });
        } catch (error) {
            res.json(error);
            console.log(error);
        }
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

    // Change the user's password
    changePassword = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const { oldPassword, newPassword } = req.body;

            // Check if the old password is correct
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Old password is incorrect." });
            }

            // Hash the new password and update the user
            const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: "Password changed successfully." });
        } catch (error) {
            console.error("Error in changePassword:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    // Delete a user
    deleteUser = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);

            // Delete the user
            await User.findByIdAndDelete(user._id);

            // Clear the cookie
            res.clearCookie('usertoken');

            res.status(200).json({ message: "User deleted successfully." });
        } catch (error) {
            console.error("Error in deleteUser:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }


}

module.exports = new UserController();