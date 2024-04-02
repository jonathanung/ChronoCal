const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/calendar-controller');
const { authenticate } = require('../bin/jwt.config');

router.post('/', authenticate, CalendarController.createCalendar);
router.get('/', authenticate, CalendarController.getAllCalendars);
router.get('/:id', authenticate, CalendarController.getCalendarById);
router.put('/:id', authenticate, CalendarController.updateCalendar);
router.delete('/:id', authenticate, CalendarController.deleteCalendar);

module.exports = router;
