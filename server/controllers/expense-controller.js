const Expense = require('../models/expense-model');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

class ExpenseController {

    // Helper function to get user from token
    getUserFromToken = async (req) => {
        if (!req.cookies.usertoken) {
            throw new Error('Unauthorized');
        }
        const userData = jwt.verify(req.cookies.usertoken, key);
        const userID = userData.payload.id;
        return await User.findOne({ _id: userID }).sort({ createdAt: 1 });
    }

    // Create a new expense
    createExpense = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const newExpense = new Expense({ ...req.body, owner_id: user._id });
            await newExpense.save();
            res.status(201).json(newExpense);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get expense by ID
    getExpenseById = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const expense = await Expense.findOne({
                _id: req.params.id,
                $or: [{ owner_id: user._id }, { visible_to: user._id }]
            });
            if (!expense) {
                return res.status(404).json({ message: "Expense not found or not accessible" });
            }
            res.status(200).json(expense);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update an expense
    updateExpense = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const expense = await Expense.findOneAndUpdate({
                _id: req.params.id,
                owner_id: user._id
            }, req.body, { new: true });
            if (!expense) {
                return res.status(404).json({ message: "Expense not found or not modifiable" });
            }
            res.status(200).json(expense);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete an expense
    deleteExpense = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const expense = await Expense.findOneAndDelete({
                _id: req.params.id,
                owner_id: user._id
            });
            if (!expense) {
                return res.status(404).json({ message: "Expense not found or not deletable" });
            }
            res.status(200).json({ message: "Expense successfully deleted" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new ExpenseController();
