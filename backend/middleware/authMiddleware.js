const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

// Protect routes - verify token
exports.protect = async (req, res, next) => {
  try {
    let token

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Special case for admin token
      if (decoded.id === "admin" && decoded.role === "admin") {
        req.user = { id: "admin", role: "admin" }
        return next()
      }

      // Check if user still exists
      const user = await User.findById(decoded.id)
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User no longer exists",
        })
      }

      // Add user to request object
      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    })
  }
}

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Special case for admin
    if (req.user.id === "admin" && req.user.role === "admin") {
      return next()
    }

    // Check user role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      })
    }
    next()
  }
}
