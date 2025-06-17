const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

// Token generator
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

// ✅ Player Register
exports.registerPlayer = async (req, res) => {
  const { name, username, password } = req.body

  console.log("📨 Registering user:", req.body)

  try {
    if (!name || !username || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const existingUser = await User.findOne({ username }).exec()
    if (existingUser) {
      console.log("⚠️ Username already exists")
      return res.status(400).json({ message: "Username already exists" })
    }

    const newUser = new User({ name, username, password })
    await newUser.save()

    const token = generateToken(newUser._id)
    res.status(201).json({ user: newUser, token })

  } catch (err) {
    console.error("❌ Registration Error Details:", err)
    res.status(500).json({ 
      message: "Server error", 
      error: err.message || "Unknown error occurred" 
    })
  }
}
// ✅ Player Login
exports.loginPlayer = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id)
    res.status(200).json({ user, token })
  } catch (err) {
    console.error("❌ Login Error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// ✅ Admin Login
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body

  if (username === "admin@gmail.com" && password === "admin321") {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })
    return res.status(200).json({
      user: { username: "admin", role: "admin" },
      token,
    })
  }

  return res.status(401).json({ message: "Invalid admin credentials" })
}