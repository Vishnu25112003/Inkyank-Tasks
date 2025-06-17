const express = require("express")
const mongoose = require("mongoose")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const dotenv = require("dotenv")
const agenda = require("./jobs/agenda") // Agenda instance
require("./jobs/clearOldScores")(agenda) // Define the job

// Routes
const questionRoutes = require("./routes/questionRoutes")
const scoreRoutes = require("./routes/scoreRoutes")
const authRoutes = require("./routes/authRoutes")  // ✅ This is what your frontend uses
const userRoutes = require("./routes/userRoutes")

// Load environment variables
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Connect MongoDB and start Agenda job
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected")

    await agenda.start()
    await agenda.every("*/10 * * * *", "clear old scores") // every 10 minutes
    console.log("⏰ Agenda job scheduled: clear old scores every 10 minutes")
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Register routes (important order)
app.use("/api/questions", questionRoutes)
app.use("/api/score", scoreRoutes)
app.use("/api", authRoutes)     // ✅ Your frontend expects this
app.use("/api/users", userRoutes)

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Setup HTTP server
const server = http.createServer(app)

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Replace * with your frontend URL in production
  },
})

// Socket.io logic
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id)

  socket.on("join-room", (roomId, username) => {
    socket.join(roomId)
    io.to(roomId).emit("user-joined", username)
  })

  socket.on("send-question", (data) => {
    io.to(data.roomId).emit("new-question", data.question)
  })

  socket.on("submit-answer", (data) => {
    const isCorrect = true // Replace with actual logic
    io.to(data.roomId).emit("answer-result", {
      user: data.user,
      correct: isCorrect,
    })
  })

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id)
  })
})

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
