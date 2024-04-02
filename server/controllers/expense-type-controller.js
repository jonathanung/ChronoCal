const ExpenseType = require('../models/expense-type-model');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

class ExpenseTypeController {

    // Helper function to get user from token
    getUserFromToken = async (req) => {
        if (!req.cookies.usertoken) {
            throw new Error('Unauthorized');
        }
        const userData = jwt.decode(req.cookies.usertoken, { complete: true });
        const userID = userData.payload.id;
        return await User.findOne({ _id: userID }).sort({ createdAt: 1 });
    }

    // Create a new expense type
    createExpenseType = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const existingExpenseType = await ExpenseType.findOne({ owner_id: user._id, name: req.body.name });

            if (existingExpenseType) {
                return res.status(400).json({ message: "An expense type with this name already exists." });
            }

            const newExpenseType = new ExpenseType({ ...req.body, owner_id: user._id });
            await newExpenseType.save();

            // Add the new expense type to the user's array of expense types
            user.expense_types.push(newExpenseType._id);
            await user.save();

            res.status(201).json(newExpenseType);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all expense types
    getAllExpenseTypes = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const expenseTypes = await ExpenseType.find({ owner_id: user._id });
            res.status(200).json(expenseTypes);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get expense type by ID
    getExpenseTypeById = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const expenseType = await ExpenseType.findOne({ _id: req.params.id, owner_id: user._id });
            if (!expenseType) {
                return res.status(404).json({ message: "Expense type not found" });
            }
            res.status(200).json(expenseType);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update an expense type
    updateExpenseType = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const expenseType = await ExpenseType.findOneAndUpdate({ _id: req.params.id, owner_id: user._id }, req.body, { new: true });
            if (!expenseType) {
                return res.status(404).json({ message: "Expense type not found" });
            }
            res.status(200).json(expenseType);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete an expense type
    deleteExpenseType = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const expenseType = await ExpenseType.findOne({ _id: req.params.id, owner_id: user._id });

            if (!expenseType) {
                return res.status(404).json({ message: "Expense type not found" });
            }

            if (expenseType.name === "Personal") {
                return res.status(400).json({ message: "Cannot delete the 'Personal' expense type" });
            }

            await expenseType.remove();

            // Remove the deleted expense type from the user's array of expense types
            user.expense_types = user.expense_types.filter(et => et.toString() !== req.params.id);
            await user.save();

            res.status(200).json({ message: "Expense type successfully deleted" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new ExpenseTypeController();
