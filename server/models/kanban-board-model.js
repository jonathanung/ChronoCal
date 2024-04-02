const mongoose = require('mongoose');

const KanbanBoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Board title is required"],
        maxlength: [255, "Board title cannot exceed 255 characters"]
    },
    description: {
        type: String
    },
    columns: [{
        title: {
            type: String,
            required: [true, "Column title is required"],
            maxlength: [255, "Column title cannot exceed 255 characters"]
        },
        issues: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Issue' // Assuming you have an Issue model
        }]
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Board owner is required"],
        ref: 'User' // Assuming you have a User model
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project' // If the board is associated with a project
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team' // If the board is associated with a team
    },
    visibile_to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    modifiable_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('KanbanBoard', KanbanBoardSchema);
