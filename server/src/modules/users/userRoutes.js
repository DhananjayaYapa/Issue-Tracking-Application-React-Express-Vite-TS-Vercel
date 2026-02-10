const express = require("express");
const router = express.Router();
const UserController = require("./userController");
const { authenticate, authorize } = require("../../middleware/auth");
const { USER_ROLES } = require("../../shared/constants/roleConstants");
const { asyncHandler } = require("../../middleware/errorHandler");

router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN));

router.get("/", asyncHandler(UserController.getAllUsers));
router.get("/:id", asyncHandler(UserController.getUserById));
router.delete("/:id", asyncHandler(UserController.deleteUser));

module.exports = router;
