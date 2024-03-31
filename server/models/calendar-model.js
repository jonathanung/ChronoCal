const mongoose = require('mongoose');
const CSSColors = require('../enums/css-colors');
const TimezoneEnum = require('timezone-enum');

const CalendarSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Owner ID is required!"],
        ref: "User"
    },
    name: {
        type: String,
        required: [true, "Calendar name is required!"],
        maxlength: [25, "Name should not exceed 25 characters"]
    },
    description: {
        type: String,
        maxlength: [50, "Description should not exceed 50 characters"]
    },
    timezone: {
        type: String,
        enum: Object.values(TimezoneEnum),
        required: [true, "Timezone is required!"]
    },
    visible_to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    modifiable_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    color: {
        type: String,
        required: [true, "Board color is required!"],
        validate: colorValidator
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const colorValidator = {
    validator: function(value) {
        const hexRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
        return hexRegex.test(value) || Object.values(CSSColors).includes(value);
    },
    message: props => `${props.value} is not a supported color format!`
};

module.exports = mongoose.model('Calendar', CalendarSchema);
