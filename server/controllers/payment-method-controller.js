const PaymentMethod = require('../models/payment-method-model');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

class PaymentMethodController {

    // Helper function to get user from token
    getUserFromToken = async (req) => {
        if (!req.cookies.usertoken) {
            throw new Error('Unauthorized');
        }
        const userData = jwt.decode(req.cookies.usertoken, { complete: true });
        const userID = userData.payload.id;
        return await User.findOne({ _id: userID }).sort({ createdAt: 1 });
    }

    // Create a new payment method
    createPaymentMethod = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const newPaymentMethod = new PaymentMethod({ ...req.body, user_id: user._id });
            await newPaymentMethod.save();
            res.status(201).json(newPaymentMethod);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get payment method by ID
    getPaymentMethodById = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const paymentMethod = await PaymentMethod.findOne({
                _id: req.params.id,
                user_id: user._id
            });
            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" });
            }
            res.status(200).json(paymentMethod);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update a payment method
    updatePaymentMethod = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const paymentMethod = await PaymentMethod.findOneAndUpdate({
                _id: req.params.id,
                user_id: user._id
            }, req.body, { new: true });
            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" });
            }
            res.status(200).json(paymentMethod);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a payment method
    deletePaymentMethod = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const paymentMethod = await PaymentMethod.findOneAndDelete({
                _id: req.params.id,
                user_id: user._id
            });
            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" });
            }
            res.status(200).json({ message: "Payment method successfully deleted" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new PaymentMethodController();
