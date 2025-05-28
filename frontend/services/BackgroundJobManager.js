class BackgroundJobManager {
  constructor(quizManager) {
    this.quizManager = quizManager
    this.activeJobs = new Map()
    this.jobCounter = 0
  }

  // Schedule a job to run after a delay
  scheduleJob(delay, callback, jobName = null) {
    const jobId = jobName || `job_${++this.jobCounter}`
    
    console.log(`Scheduling background job: ${jobId} (delay: ${delay}ms)`)
    
    const timeoutId = setTimeout(() => {
      try {
        console.log(`Executing background job: ${jobId}`)
        callback()
        this.activeJobs.delete(jobId)
      } catch (error) {
        console.error(`Error in background job ${jobId}:`, error)
        this.activeJobs.delete(jobId)
      }
    }, delay)

    this.activeJobs.set(jobId, {
      timeoutId,
      scheduledAt: new Date(),
      delay,
      jobName: jobId
    })

    return jobId
  }

  // Cancel a scheduled job
  cancelJob(jobId) {
    const job = this.activeJobs.get(jobId)
    if (job) {
      clearTimeout(job.timeoutId)
      this.activeJobs.delete(jobId)
      console.log(`Cancelled background job: ${jobId}`)
      return true
    }
    return false
  }

  // Question timeout handler
  scheduleQuestionTimeout(timeLimit, callback) {
    return this.scheduleJob(timeLimit, callback, 'question_timeout')
  }

  // Score processing with delay for better UX
  scheduleScoreProcessing(delay, callback) {
    return this.scheduleJob(delay, callback, 'score_processing')
  }

  // Auto-save quiz state
  scheduleAutoSave(interval = 30000) { // 30 seconds
    const autoSaveJob = () => {
      try {
        const quizState = this.quizManager.getQuizState()
        // In a real app, you'd save to database here
        console.log('Auto-saving quiz state...', {
          players: quizState.players.length,
          isActive: quizState.isActive,
          questionsAsked: quizState.questionsAsked
        })
        
        // Schedule next auto-save
        this.scheduleJob(interval, autoSaveJob, 'auto_save')
      } catch (error) {
        console.error('Error in auto-save:', error)
      }
    }

    return this.scheduleJob(interval, autoSaveJob, 'auto_save')
  }

  // Cleanup inactive players periodically
  schedulePlayerCleanup(interval = 300000) { // 5 minutes
    const cleanupJob = () => {
      try {
        const removedCount = this.quizManager.removeInactivePlayers()
        if (removedCount > 0) {
          console.log(`Background cleanup: removed ${removedCount} inactive players`)
        }
        
        // Schedule next cleanup
        this.scheduleJob(interval, cleanupJob, 'player_cleanup')
      } catch (error) {
        console.error('Error in player cleanup:', error)
      }
    }

    return this.scheduleJob(interval, cleanupJob, 'player_cleanup')
  }

  // Process quiz results with achievements
  scheduleResultsProcessing(delay, callback) {
    const resultsJob = () => {
      try {
        const finalResults = this.quizManager.getFinalResults()
        
        // Calculate achievements
        const achievements = this.calculateAchievements(finalResults)
        
        // Execute callback with enhanced results
        callback({
          ...finalResults,
          achievements
        })
      } catch (error) {
        console.error('Error processing results:', error)
        callback(null)
      }
    }

    return this.scheduleJob(delay, resultsJob, 'results_processing')
  }

  // Calculate player achievements
  calculateAchievements(results) {
    const achievements = []

    if (results.leaderboard.length > 0) {
      const winner = results.leaderboard[0]
      
      // Perfect score achievement
      if (winner.correctAnswers === results.totalQuestions) {
        achievements.push({
          type: 'perfect_score',
          playerId: winner.id,
          playerName: winner.name,
          description: 'Perfect Score! Answered all questions correctly!'
        })
      }

      // Speed demon achievement (high score with quick responses)
      if (winner.score > results.totalQuestions * 120) { // More than 120 points per question
        achievements.push({
          type: 'speed_demon',
          playerId: winner.id,
          playerName: winner.name,
          description: 'Speed Demon! Lightning fast correct answers!'
        })
      }

      // Participation achievements
      if (results.totalPlayers >= 10) {
        achievements.push({
          type: 'popular_quiz',
          description: 'Popular Quiz! 10+ players participated!'
        })
      }

      // Consistency achievement (high accuracy)
      results.leaderboard.forEach(player => {
        if (player.accuracy >= 90 && player.totalAnswered >= 5) {
          achievements.push({
            type: 'consistent_performer',
            playerId: player.id,
            playerName: player.name,
            description: `Consistent Performer! ${player.accuracy}% accuracy!`
          })
        }
      })
    }

    return achievements
  }

  // Send delayed notifications
  scheduleNotification(delay, message, recipients = 'all') {
    const notificationJob = () => {
      try {
        console.log(`Sending notification: ${message}`)
        // In a real app, you'd send push notifications, emails, etc.
        
        if (this.quizManager.io) {
          this.quizManager.io.emit('notification', {
            message,
            timestamp: new Date(),
            type: 'info'
          })
        }
      } catch (error) {
        console.error('Error sending notification:', error)
      }
    }

    return this.scheduleJob(delay, notificationJob, 'notification')
  }

  // Get active jobs status
  getActiveJobs() {
    const jobs = []
    this.activeJobs.forEach((job, jobId) => {
      jobs.push({
        id: jobId,
        name: job.jobName,
        scheduledAt: job.scheduledAt,
        delay: job.delay,
        timeRemaining: Math.max(0, job.delay - (new Date() - job.scheduledAt))
      })
    })
    return jobs
  }

  // Cancel all jobs
  cancelAllJobs() {
    console.log(`Cancelling ${this.activeJobs.size} background jobs`)
    this.activeJobs.forEach((job, jobId) => {
      clearTimeout(job.timeoutId)
    })
    this.activeJobs.clear()
  }

  // Start essential background services
  startEssentialServices() {
    console.log('Starting essential background services...')
    
    // Start auto-save every 30 seconds
    this.scheduleAutoSave(30000)
    
    // Start player cleanup every 5 minutes
    this.schedulePlayerCleanup(300000)
    
    console.log('Essential background services started')
  }
}

export default BackgroundJobManager
