const express = require('express');
const router = express.Router();
const EventController = require('../controllers/event-controller');
const { authenticate } = require('../bin/jwt.config');

router.post('/', authenticate, EventController.createEvent);
router.get('/:id', authenticate, EventController.getEventById);
router.put('/:id', authenticate, EventController.updateEvent);
router.delete('/:id', authenticate, EventController.deleteEvent);

module.exports = router;
