class QuizManager {
  constructor(io) {
    this.io = io
    this.quizState = {
      isActive: false,
      players: [],
      currentQuestion: null,
      responses: [],
      questionsAsked: 0,
      lastQuestionResults: null,
      quizStartTime: null,
      totalQuestions: 0
    }
  }

  getQuizState() {
    return { ...this.quizState }
  }

  getActiveQuizzesCount() {
    return this.quizState.isActive ? 1 : 0
  }

  startQuiz() {
    this.quizState.isActive = true
    this.quizState.quizStartTime = new Date()
    this.quizState.questionsAsked = 0
    this.quizState.responses = []
    this.quizState.currentQuestion = null
    this.quizState.lastQuestionResults = null
    
    console.log('Quiz started at:', this.quizState.quizStartTime)
    
    // Reset all player scores
    this.quizState.players.forEach(player => {
      player.score = 0
      player.correctAnswers = 0
      player.totalAnswered = 0
    })
  }

  endQuiz() {
    this.quizState.isActive = false
    this.quizState.currentQuestion = null
    this.quizState.responses = []
    
    console.log('Quiz ended. Final results:', this.getFinalResults())
  }

  addPlayer(socketId, playerName) {
    // Check if player already exists
    const existingPlayer = this.quizState.players.find(p => p.name === playerName)
    if (existingPlayer) {
      // Update socket ID for reconnection
      existingPlayer.socketId = socketId
      existingPlayer.isConnected = true
      return existingPlayer
    }

    const player = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      socketId,
      name: playerName,
      score: 0,
      correctAnswers: 0,
      totalAnswered: 0,
      joinedAt: new Date(),
      isConnected: true
    }

    this.quizState.players.push(player)
    console.log(`Player added: ${playerName} (${player.id})`)
    return player
  }

  removePlayer(socketId) {
    const playerIndex = this.quizState.players.findIndex(p => p.socketId === socketId)
    if (playerIndex !== -1) {
      const player = this.quizState.players[playerIndex]
      player.isConnected = false
      console.log(`Player disconnected: ${player.name}`)
      
      // Remove player after 5 minutes of disconnection
      setTimeout(() => {
        const currentPlayerIndex = this.quizState.players.findIndex(p => p.id === player.id)
        if (currentPlayerIndex !== -1 && !this.quizState.players[currentPlayerIndex].isConnected) {
          this.quizState.players.splice(currentPlayerIndex, 1)
          console.log(`Player removed after timeout: ${player.name}`)
        }
      }, 5 * 60 * 1000) // 5 minutes
    }
  }

  sendQuestion(question) {
    this.quizState.currentQuestion = {
      ...question,
      sentAt: new Date(),
      timeLimit: question.timeLimit || 30
    }
    this.quizState.responses = []
    this.quizState.questionsAsked++
    this.quizState.totalQuestions++
    
    console.log(`Question sent: ${question.question}`)
    console.log(`Correct answer: ${question.options[question.correctAnswer]}`)
  }

  submitAnswer(playerId, playerName, answer) {
    // Check if player already answered this question
    const existingResponse = this.quizState.responses.find(r => r.playerId === playerId)
    if (existingResponse) {
      console.log(`Player ${playerName} already answered this question`)
      return false
    }

    const response = {
      playerId,
      playerName,
      answer,
      timestamp: new Date(),
      isCorrect: answer === this.quizState.currentQuestion?.correctAnswer
    }

    this.quizState.responses.push(response)
    
    // Update player stats
    const player = this.quizState.players.find(p => p.id === playerId)
    if (player) {
      player.totalAnswered++
    }

    console.log(`Answer submitted by ${playerName}: ${answer} (${response.isCorrect ? 'Correct' : 'Incorrect'})`)
    return true
  }

  allPlayersAnswered() {
    const connectedPlayers = this.quizState.players.filter(p => p.isConnected)
    return connectedPlayers.length > 0 && this.quizState.responses.length >= connectedPlayers.length
  }

  processAnswers() {
    if (!this.quizState.currentQuestion) return

    const results = {
      question: this.quizState.currentQuestion,
      totalResponses: this.quizState.responses.length,
      correctAnswers: 0,
      playerResults: []
    }

    // Process each response and update scores
    this.quizState.responses.forEach(response => {
      const player = this.quizState.players.find(p => p.id === response.playerId)
      if (!player) return

      const isCorrect = response.answer === this.quizState.currentQuestion.correctAnswer
      const points = isCorrect ? this.calculatePoints(response.timestamp) : 0

      if (isCorrect) {
        player.score += points
        player.correctAnswers++
        results.correctAnswers++
      }

      results.playerResults.push({
        playerId: response.playerId,
        playerName: response.playerName,
        answer: response.answer,
        isCorrect,
        points,
        responseTime: response.timestamp - this.quizState.currentQuestion.sentAt
      })
    })

    // Handle players who didn't answer
    const respondedPlayerIds = this.quizState.responses.map(r => r.playerId)
    this.quizState.players
      .filter(p => p.isConnected && !respondedPlayerIds.includes(p.id))
      .forEach(player => {
        results.playerResults.push({
          playerId: player.id,
          playerName: player.name,
          answer: null,
          isCorrect: false,
          points: 0,
          responseTime: null
        })
      })

    this.quizState.lastQuestionResults = results
    console.log('Question results processed:', results)
    
    return results
  }

  calculatePoints(responseTimestamp) {
    if (!this.quizState.currentQuestion) return 0
    
    const responseTime = responseTimestamp - this.quizState.currentQuestion.sentAt
    const timeLimit = this.quizState.currentQuestion.timeLimit * 1000
    
    // Base points for correct answer
    let points = 100
    
    // Bonus points for quick response (up to 50 bonus points)
    const timeBonus = Math.max(0, 50 - Math.floor((responseTime / timeLimit) * 50))
    
    return points + timeBonus
  }

  getLastQuestionResults() {
    return this.quizState.lastQuestionResults
  }

  getFinalResults() {
    const sortedPlayers = [...this.quizState.players]
      .filter(p => p.totalAnswered > 0)
      .sort((a, b) => b.score - a.score)

    return {
      totalQuestions: this.quizState.questionsAsked,
      totalPlayers: this.quizState.players.length,
      leaderboard: sortedPlayers.map((player, index) => ({
        rank: index + 1,
        ...player,
        accuracy: player.totalAnswered > 0 ? (player.correctAnswers / player.totalAnswered * 100).toFixed(1) : 0
      })),
      quizDuration: this.quizState.quizStartTime ? 
        new Date() - this.quizState.quizStartTime : 0
    }
  }

  resetQuiz() {
    this.quizState = {
      isActive: false,
      players: [],
      currentQuestion: null,
      responses: [],
      questionsAsked: 0,
      lastQuestionResults: null,
      quizStartTime: null,
      totalQuestions: 0
    }
    console.log('Quiz state reset')
  }

  removeInactivePlayers() {
    const initialCount = this.quizState.players.length
    this.quizState.players = this.quizState.players.filter(p => p.isConnected)
    const removedCount = initialCount - this.quizState.players.length
    
    if (removedCount > 0) {
      console.log(`Removed ${removedCount} inactive players`)
    }
    
    return removedCount
  }
}

export default QuizManager