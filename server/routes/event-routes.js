const EventController = require('../controllers/event-controller');
const { authenticate } = require('../bin/jwt.config');

module.exports = app => {
    app.post('/api/event', authenticate, EventController.createEvent);
    app.get('/api/event/:id', authenticate, EventController.getEventById);
    app.put('/api/event/:id', authenticate, EventController.updateEvent);
    app.delete('/api/event/:id', authenticate, EventController.deleteEvent);
}
