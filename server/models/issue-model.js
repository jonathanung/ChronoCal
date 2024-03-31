const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxlength: [255, "Title cannot exceed 255 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Author is required"],
        ref: 'User' // Link to the User model
    },
    assignees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Link to the User model
    }],
    state: {
        type: String,
        enum: ['opened', 'closed', 'reopened'],
        required: [true, "State is required"]
    },
    labels: [{
        type: String,
        required: false
    }],
    milestone: {
        type: String,
        required: false
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment' // Link to a Comment model if you have one
    }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Issue', IssueSchema);
