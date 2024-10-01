// user-routes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const { authenticate } = require('../bin/jwt.config');

router.get("/current", authenticate, UserController.getCurrent);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/deselected-calendars", authenticate, UserController.getDeselectedCalendars);
router.post("/change-password", authenticate, UserController.changePassword);
router.delete("/delete", authenticate, UserController.deleteUser);
router.put("/update", authenticate, UserController.updateUser);
router.post("/profile-picture", authenticate, UserController.updateProfilePicture);

module.exports = router;
