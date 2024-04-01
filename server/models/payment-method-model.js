const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID is required!"],
        ref: 'User' // Assuming you have a User model
    },
    payment_type: {
        type: String,
        required: [true, "Payment type is required!"],
        maxlength: [50, "Payment type should not exceed 50 characters"]
    },
    is_credit: {
        type: Boolean,
        required: [true, "Credit indication is required!"]
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
