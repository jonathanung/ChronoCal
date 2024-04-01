const mongoose = require('mongoose');
const CSSColors = require('../enums/css-colors');

const colorValidator = {
    validator: function(value) {
        const hexRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
        return hexRegex.test(value) || Object.values(CSSColors).includes(value);
    },
    message: props => `${props.value} is not a supported color format!`
};

const StickyBoardSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Owner ID is required!"],
        ref: 'User'
    },
    visible_to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    modifiable_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    name: {
        type: String,
        required: [true, "StickyBoard name is required!"],
        maxlength: [255, "Name should not exceed 255 characters"]
    },
    description: {
        type: String
    },
    width: {
        type: mongoose.Types.Decimal128,
        default: 100.00,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: props => `${props.value} is not a valid width! Width must be positive.`
        }
    },
    height: {
        type: mongoose.Types.Decimal128,
        default: 100.00,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: props => `${props.value} is not a valid height! Height must be positive.`
        }
    },
    color: {
        type: String,
        required: [true, "StickyBoard color is required!"],
        validate: colorValidator
    },
    sticky_notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StickyNote'
    }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


module.exports = mongoose.model('StickyBoard', StickyBoardSchema);
