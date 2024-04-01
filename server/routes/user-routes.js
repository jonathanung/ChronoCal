// user-routes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const { authenticate } = require('../bin/jwt.config');

router.get("/api/user/current", authenticate, UserController.getCurrent);
router.post("/api/user/register", UserController.register);
router.post("/api/user/login", UserController.login);
router.get("/api/user/logout", UserController.logout);

module.exports = router;
