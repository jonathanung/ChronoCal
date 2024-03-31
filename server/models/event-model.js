const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    calendar_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Calendar ID is required!"],
        ref: 'Calendar'
    },
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
    all_day: {
        type: Boolean,
        required: [true, "All day status is required!"]
    },
    start: {
        type: Date,
        required: [true, "Start date and time are required!"]
    },
    end: {
        type: Date,
        required: [true, "End date and time are required!"]
    },
    duration: {
        type: String,
        required: false 
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    uid: {
        type: String,
        unique: true,
        required: [true, "UID is required!"]
    },
    event_class: {
        type: String,
        maxlength: [50, "Event class should not exceed 50 characters"]
    },
    description: {
        type: String
    },
    geo: { // Assuming 'geo' is a point with latitude and longitude
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // format will be [longitude, latitude]
            required: true
        }
    },
    last_modified: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        maxlength: [255, "Location should not exceed 255 characters"]
    },
    organizer: {
        type: String,
        maxlength: [255, "Organizer should not exceed 255 characters"]
    },
    atendees: [{
        type: String,
        required: [true, "Email is required!"],
        validate: {
            validator: val => /^([\w-]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email!"
        },
        lowercase: true
    }],
    priority: {
        type: Number
    },
    sequence: {
        type: Number
    },
    status: {
        type: String,
        maxlength: [50, "Status should not exceed 50 characters"]
    },
    summary: {
        type: String,
        maxlength: [255, "Summary should not exceed 255 characters"]
    },
    transparency: {
        type: String,
        maxlength: [255, "Transparency information should not exceed 255 characters"]
    },
    url: {
        type: String,
        maxlength: [255, "URL should not exceed 255 characters"]
    },
    rule: {
        type: String,
        maxlength: [255, "Rule should not exceed 255 characters"]
    },
    categories: {
        type: String,
        maxlength: [255, "Categories should not exceed 255 characters"]
    },
    comment: {
        type: String
    },
    contact: {
        type: String,
        maxlength: [255, "Contact should not exceed 255 characters"]
    },
    exdate: {
        type: [Date],
        required: false 
    },
    rstatus: {
        type: String,
        maxlength: [255, "Status of recurrence should not exceed 255 characters"]
    },
    related_to: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    resources: {
        type: String,
        maxlength: [255, "Resources should not exceed 255 characters"]
    },
    rdate: {
        type: [Date],
        required: false 
    },
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Event', EventSchema);
