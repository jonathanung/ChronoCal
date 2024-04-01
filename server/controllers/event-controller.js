const Event = require('../models/event-model');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

class EventController {

    // Helper function to get user from token
    getUserFromToken = async (req) => {
        if (!req.cookies.usertoken) {
            throw new Error('Unauthorized');
        }
        const userData = jwt.verify(req.cookies.usertoken, key);
        const userID = userData.payload.id;
        return await User.findOne({ _id: userID }).sort({ createdAt: 1 });
    }

    // Create a new event
    createEvent = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const newEvent = new Event({ ...req.body, owner_id: user._id });
            await newEvent.save();
            res.status(201).json(newEvent);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get event by ID
    getEventById = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const event = await Event.findOne({
                _id: req.params.id,
                $or: [
                    { owner_id: user._id },
                    { modifiable_by: user._id },
                    { visible_to: user._id }
                ]
            });
            if (!event) {
                return res.status(404).json({ message: "Event not found or not accessible" });
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update an event
    updateEvent = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const event = await Event.findOneAndUpdate({
                _id: req.params.id,
                $or: [
                    { owner_id: user._id },
                    { modifiable_by: user._id }
                ]
            }, req.body, { new: true });
            if (!event) {
                return res.status(404).json({ message: "Event not found or not modifiable" });
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete an event
    deleteEvent = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const event = await Event.findOneAndDelete({
                _id: req.params.id,
                owner_id: user._id
            });
            if (!event) {
                return res.status(404).json({ message: "Event not found or not deletable" });
            }
            res.status(200).json({ message: "Event successfully deleted" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new EventController();
