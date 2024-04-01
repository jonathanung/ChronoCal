const mongoose = require('mongoose');
const CSSColors = require('../bin/css-colors');

const colorValidator = {
    validator: function(value) {
        const hexRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
        return hexRegex.test(value) || Object.values(CSSColors).includes(value);
    },
    message: props => `${props.value} is not a supported color format!`
};

const StickyNoteSchema = new mongoose.Schema({
    sticky_board_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "StickyBoard ID is required!"],
        ref: 'Board' 
    },
    content: {
        type: String
    },
    position: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // format will be [x, y]
            required: true
        }
    },
    width: {
        type: mongoose.Types.Decimal128,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: props => `${props.value} is not a valid width! Width must be positive.`
        }
    },
    height: {
        type: mongoose.Types.Decimal128,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: props => `${props.value} is not a valid height! Height must be positive.`
        }
    },
    color: {
        type: String,
        required: [true, "Board color is required!"],
        validate: colorValidator
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


module.exports = mongoose.model('StickyNote', StickyNoteSchema);
