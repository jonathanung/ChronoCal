const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/calendar-controller');
const UserController = require('../controllers/user-controller'); // If this is needed for getDeselectedCalendars
const { authenticate } = require('../bin/jwt.config');

router.post('/', authenticate, CalendarController.createCalendar);
router.get('/', authenticate, CalendarController.getAllCalendars);
router.get('/:id', authenticate, CalendarController.getCalendarById);
router.put('/:id', authenticate, CalendarController.updateCalendar);
router.delete('/:id', authenticate, CalendarController.deleteCalendar);
router.get("/user/deselected-calendars", authenticate, UserController.getDeselectedCalendars);

module.exports = router;
