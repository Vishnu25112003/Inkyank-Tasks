const express = require("express")
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

// Protected routes
router.get("/leaderboard", userController.getLeaderboard)

router.use(authMiddleware.protect) // All routes below require authentication

router.patch("/score", userController.updateScore)

// Admin only routes
router.get("/", authMiddleware.restrictTo("admin"), userController.getAllUsers)

module.exports = router
