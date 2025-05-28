import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import QuizManager from './services/QuizManager.js'
import BackgroundJobManager from './services/BackgroundJobManager.js'
import CronJobManager from './services/CronJobManager.js'

const app = express()
const server = createServer(app)

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
})

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}))
app.use(express.json())

// Initialize services
const quizManager = new QuizManager(io)
const backgroundJobManager = new BackgroundJobManager(quizManager)
const cronJobManager = new CronJobManager(quizManager)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    activeConnections: io.engine.clientsCount,
    activeQuizzes: quizManager.getActiveQuizzesCount(),
    uptime: process.uptime()
  })
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  // Send current quiz state to new connection
  socket.emit('state', quizManager.getQuizState())

  // Admin events
  socket.on('startQuiz', () => {
    console.log('Admin starting quiz')
    quizManager.startQuiz()
    io.emit('state', quizManager.getQuizState())
  })

  socket.on('endQuiz', () => {
    console.log('Admin ending quiz')
    quizManager.endQuiz()
    io.emit('state', quizManager.getQuizState())
  })

  socket.on('sendQuestion', (question) => {
    console.log('Admin sending question:', question.question)
    quizManager.sendQuestion(question)
    io.emit('question', question)
    io.emit('state', quizManager.getQuizState())

    // Start background job for question timeout
    backgroundJobManager.scheduleQuestionTimeout(question.timeLimit * 1000, () => {
      console.log('Question timeout reached')
      quizManager.processAnswers()
      io.emit('questionResults', quizManager.getLastQuestionResults())
      io.emit('state', quizManager.getQuizState())
    })
  })

  // Player events
  socket.on('join', (playerName) => {
    console.log(`Player joining: ${playerName}`)
    const player = quizManager.addPlayer(socket.id, playerName)
    socket.playerName = playerName
    socket.playerId = player.id
    
    io.emit('state', quizManager.getQuizState())
    socket.emit('playerJoined', { player, quizState: quizManager.getQuizState() })
  })

  socket.on('submitAnswer', (data) => {
    console.log(`Answer submitted by ${data.playerName}:`, data.answer)
    quizManager.submitAnswer(data.playerId, data.playerName, data.answer)
    io.emit('state', quizManager.getQuizState())

    // Check if all players have answered
    if (quizManager.allPlayersAnswered()) {
      backgroundJobManager.scheduleScoreProcessing(1000, () => {
        console.log('Processing scores early - all players answered')
        quizManager.processAnswers()
        io.emit('questionResults', quizManager.getLastQuestionResults())
        io.emit('state', quizManager.getQuizState())
      })
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
    if (socket.playerName) {
      quizManager.removePlayer(socket.id)
      io.emit('state', quizManager.getQuizState())
    }
  })

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })
})

// Start cron jobs
cronJobManager.startAllJobs()

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  cronJobManager.stopAllJobs()
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  cronJobManager.stopAllJobs()
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Quiz server running on port ${PORT}`)
  console.log(`📊 Health check available at http://localhost:${PORT}/health`)
  console.log(`🔌 WebSocket server ready for connections`)
})