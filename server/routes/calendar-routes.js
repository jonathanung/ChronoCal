const CalendarController = require('../controllers/calendar-controller');
const { authenticate } = require('../bin/jwt.config');

module.exports = app => {
    app.post('/api/calendar', authenticate, CalendarController.createCalendar);
    app.get('/api/calendar', authenticate, CalendarController.getAllCalendars);
    app.get('/api/calendar/:id', authenticate, CalendarController.getCalendarById);
    app.put('/api/calendar/:id', authenticate, CalendarController.updateCalendar);
    app.delete('/api/calendar/:id', authenticate, CalendarController.deleteCalendar);
    app.get("/api/user/deselected-calendars", authenticate, UserController.getDeselectedCalendars);
}
