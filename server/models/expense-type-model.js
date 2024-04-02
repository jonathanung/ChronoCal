const mongoose = require('mongoose');

const ExpenseTypeSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Owner ID is required!"],
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, "Expense type name is required!"],
        maxlength: [50, "Expense type name should not exceed 50 characters"]
    },
    description: {
        type: String,
        maxlength: [255, "Description should not exceed 255 characters"]
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('ExpenseType', ExpenseTypeSchema);
