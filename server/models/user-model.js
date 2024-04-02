const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        minlength: [3, "Username must be at least 3 characters long!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email!"
        },
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    calendars: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        ref: "Calendar"
    },
    visible_calendars: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        ref: "Calendar"
    },
    modifiable_calendars: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        ref: "Calendar"
    },
    deselected_calendars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Calendar"
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    visible_events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    sticky_boards: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        ref: "StickyBoard"
    },
    visible_sticky_boards: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        ref: "StickyBoard"
    },
    modifiable_sticky_boards: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        ref: "StickyBoard"
    },
    payment_methods: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod"
    }],
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense"
    }],
    visible_expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense"
    }],
    kanban_boards: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        ref: "KanbanBoard"
    },
    visible_kanban_boards: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        ref: "KanbanBoard"
    },
    modifiable_kanban_boards: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        ref: "KanbanBoard"
    },
    assigned_issues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue"
    }],
    expense_types: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExpenseType"
    }],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

//This function gets the confirmPassword variable from the API Post and sets it to a variable
UserSchema.virtual('confirmPassword')
    .get( () => this._confirmPassword )
    .set( value => this._confirmPassword = value );

//This function validates the password against the confirmPassword variable
UserSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password!');
    }
    next();
});

//This function uses bcrypt to encrypt the password
UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS))
        .then(hash => {
            this.password = hash;
            next();
        });
});

module.exports = mongoose.model('User', UserSchema);
