const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Owner ID is required!"],
        ref: 'User'
    },
    payee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    payment_method_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod'
    },
    visible_to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    description: {
        type: String,
        maxlength: [255, "Description should not exceed 255 characters"]
    },
    amount: {
        type: mongoose.Types.Decimal128,
        required: [true, "Amount is required!"]
    },
    currency: {
        type: String,
        maxlength: [3, "Currency code should be 3 characters long"]
    },
    category: {
        type: String,
        maxlength: [50, "Category should not exceed 50 characters"]
    },
    date: {
        type: Date,
        required: [true, "Date is required!"]
    },
    payee: {
        type: String,
        maxlength: [255, "Payee should not exceed 255 characters"]
    },
    notes: {
        type: String
    },
    receipt: {
        type: String
    },
    status: {
        type: String,
        maxlength: [50, "Status should not exceed 50 characters"]
    },
    tags: [{
        type: String
    }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Expense', ExpenseSchema);
