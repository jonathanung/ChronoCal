const Calendar = require('../models/calendar-model');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

class CalendarController {

    // Helper function to get user from token
    getUserFromToken = async (req) => {
        if (!req.cookies.usertoken) {
            throw new Error('Unauthorized');
        }
        const userData = jwt.verify(req.cookies.usertoken, key);
        const userID = userData.payload.id;
        return await User.findOne({ _id: userID }).sort({ createdAt: 1 });
    }

    // Create a new calendar
    createCalendar = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const existingCalendar = await Calendar.findOne({ owner_id: user._id, name: req.body.name });

            if (existingCalendar) {
                return res.status(400).json({ message: "A calendar with this name already exists." });
            }

            const calendar = await Calendar.create({ ...req.body, owner_id: user._id });
            res.status(201).json(calendar);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all calendars
    getAllCalendars = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const calendars = await Calendar.find({
                $or: [
                    { owner_id: user._id },
                    { _id: { $in: user.modifiable_calendars.values() } },
                    { _id: { $in: user.visible_calendars.values() } }
                ]
            });
            res.status(200).json(calendars);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }


    // Get a calendar by ID
    getCalendarById = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const calendar = await Calendar.findOne({
                $and: [
                    { _id: req.params.id },
                    {
                        $or: [
                            { owner_id: user._id },
                            { _id: { $in: user.modifiable_calendars.values() } },
                            { _id: { $in: user.visible_calendars.values() } }
                        ]
                    }
                ]
            });
            if (!calendar) {
                return res.status(404).json({ message: "Calendar not found or not accessible" });
            }
            res.status(200).json(calendar);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update a calendar
    updateCalendar = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const calendar = await Calendar.findOneAndUpdate({
                $and: [
                    { _id: req.params.id },
                    {
                        $or: [
                            { owner_id: user._id },
                            { _id: { $in: user.modifiable_calendars.values() } }
                        ]
                    }
                ]
            }, req.body, { new: true });
            if (!calendar) {
                return res.status(404).json({ message: "Calendar not found or not modifiable" });
            }
            res.status(200).json(calendar);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }


    // Delete a calendar
    deleteCalendar = async (req, res) => {
        try {
            const user = await this.getUserFromToken(req);
            const calendar = await Calendar.findOne({ _id: req.params.id, owner_id: user._id });

            if (!calendar) {
                return res.status(404).json({ message: "Calendar not found" });
            }

            if (calendar.name === "Personal") {
                return res.status(400).json({ message: "Cannot delete the 'Personal' calendar" });
            }

            await calendar.remove();

            res.status(200).json({ message: "Calendar deleted successfully" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new CalendarController();
