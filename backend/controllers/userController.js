const User = require("../models/userModel")

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: error.message,
    })
  }
}

// Update user score
exports.updateScore = async (req, res) => {
  try {
    const { score } = req.body
    const userId = req.user.id

    if (!score) {
      return res.status(400).json({
        success: false,
        message: "Please provide a score",
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update high score if new score is higher
    if (score > user.highScore) {
      user.highScore = score
    }

    // Increment games played
    user.gamesPlayed += 1

    await user.save()

    res.status(200).json({
      success: true,
      data: {
        highScore: user.highScore,
        gamesPlayed: user.gamesPlayed,
      },
      message: "Score updated successfully",
    })
  } catch (error) {
    console.error("Update score error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update score",
      error: error.message,
    })
  }
}

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ highScore: -1 })
      .limit(10)
      .select("username name highScore gamesPlayed")

    res.status(200).json({
      success: true,
      data: leaderboard,
    })
  } catch (error) {
    console.error("Get leaderboard error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get leaderboard",
      error: error.message,
    })
  }
}
