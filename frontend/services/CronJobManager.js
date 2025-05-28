import cron from 'node-cron'

class CronJobManager {
  constructor(quizManager) {
    this.quizManager = quizManager
    this.jobs = new Map()
  }

  // Daily quiz reminder at 8 AM
  scheduleDailyReminder() {
    const job = cron.schedule('0 8 * * *', () => {
      console.log('Daily quiz reminder triggered at 8 AM')
      
      if (this.quizManager.io) {
        this.quizManager.io.emit('notification', {
          type: 'reminder',
          message: 'Good morning! Ready for today\'s quiz challenge?',
          timestamp: new Date()
        })
      }
      
      // You could also trigger an auto-start quiz here
      // this.quizManager.startQuiz()
    }, {
      scheduled: false,
      timezone: "America/New_York" // Adjust timezone as needed
    })

    this.jobs.set('daily_reminder', job)
    console.log('Daily reminder job scheduled for 8 AM')
  }

  // Weekly leaderboard reset on Sundays at midnight
  scheduleWeeklyReset() {
    const job = cron.schedule('0 0 * * 0', () => {
      console.log('Weekly leaderboard reset triggered')
      
      // Save current leaderboard before reset
      const finalResults = this.quizManager.getFinalResults()
      console.log('Weekly winners:', finalResults.leaderboard.slice(0, 3))
      
      // Reset quiz state
      this.quizManager.resetQuiz()
      
      if (this.quizManager.io) {
        this.quizManager.io.emit('notification', {
          type: 'reset',
          message: 'Weekly leaderboard has been reset! New week, new challenges!',
          timestamp: new Date(),
          weeklyWinners: finalResults.leaderboard.slice(0, 3)
        })
      }
    }, {
      scheduled: false,
      timezone: "America/New_York"
    })

    this.jobs.set('weekly_reset', job)
    console.log('Weekly reset job scheduled for Sundays at midnight')
  }

  // Hourly cleanup of inactive sessions
  scheduleHourlyCleanup() {
    const job = cron.schedule('0 * * * *', () => {
      console.log('Hourly cleanup triggered')
      
      const removedCount = this.quizManager.removeInactivePlayers()
      
      if (removedCount > 0) {
        console.log(`Hourly cleanup: removed ${removedCount} inactive players`)
      }
      
      // Additional cleanup tasks
      this.performSystemCleanup()
    }, {
      scheduled: false
    })

    this.jobs.set('hourly_cleanup', job)
    console.log('Hourly cleanup job scheduled')
  }

  // Schedule quiz at specific time
  scheduleQuizStart(cronExpression, quizData = null) {
    const jobId = `scheduled_quiz_${Date.now()}`
    
    const job = cron.schedule(cronExpression, () => {
      console.log('Scheduled quiz starting...')
      
      this.quizManager.startQuiz()
      
      if (this.quizManager.io) {
        this.quizManager.io.emit('notification', {
          type: 'quiz_start',
          message: 'Scheduled quiz is starting now! Join quickly!',
          timestamp: new Date()
        })
        
        this.quizManager.io.emit('state', this.quizManager.getQuizState())
      }
      
      // Auto-send first question after 30 seconds
      setTimeout(() => {
        if (quizData && quizData.questions && quizData.questions.length > 0) {
          this.quizManager.sendQuestion(quizData.questions[0])
          this.quizManager.io.emit('question', quizData.questions[0])
        }
      }, 30000)
      
    }, {
      scheduled: false
    })

    this.jobs.set(jobId, job)
    console.log(`Scheduled quiz job created: ${jobId} with expression: ${cronExpression}`)
    return jobId
  }

  // Daily statistics report at 6 PM
  scheduleDailyStats() {
    const job = cron.schedule('0 18 * * *', () => {
      console.log('Daily statistics report triggered')
      
      const stats = this.generateDailyStats()
      
      if (this.quizManager.io) {
        this.quizManager.io.emit('daily_stats', {
          type: 'daily_report',
          stats,
          timestamp: new Date()
        })
      }
      
      console.log('Daily stats:', stats)
    }, {
      scheduled: false,
      timezone: "America/New_York"
    })

    this.jobs.set('daily_stats', job)
    console.log('Daily statistics job scheduled for 6 PM')
  }

  // Weekend quiz marathon (Saturdays at 2 PM)
  scheduleWeekendMarathon() {
    const job = cron.schedule('0 14 * * 6', () => {
      console.log('Weekend quiz marathon starting!')
      
      if (this.quizManager.io) {
        this.quizManager.io.emit('notification', {
          type: 'marathon',
          message: 'Weekend Quiz Marathon is starting! Extended quiz session with bonus points!',
          timestamp: new Date()
        })
      }
      
      // Start quiz with special weekend settings
      this.quizManager.startQuiz()
      
    }, {
      scheduled: false,
      timezone: "America/New_York"
    })

    this.jobs.set('weekend_marathon', job)
    console.log('Weekend marathon job scheduled for Saturdays at 2 PM')
  }

  // Performance monitoring every 15 minutes
  schedulePerformanceMonitoring() {
    const job = cron.schedule('*/15 * * * *', () => {
      const memoryUsage = process.memoryUsage()
      const uptime = process.uptime()
      
      console.log('Performance check:', {
        memory: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        uptime: `${Math.round(uptime / 3600)} hours`,
        activeConnections: this.quizManager.io ? this.quizManager.io.engine.clientsCount : 0,
        activePlayers: this.quizManager.getQuizState().players.length
      })
      
      // Alert if memory usage is too high
      if (memoryUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
        console.warn('High memory usage detected!')
      }
    }, {
      scheduled: false
    })

    this.jobs.set('performance_monitoring', job)
    console.log('Performance monitoring scheduled every 15 minutes')
  }

  // Helper method to generate daily statistics
  generateDailyStats() {
    const quizState = this.quizManager.getQuizState()
    
    return {
      totalPlayers: quizState.players.length,
      activeQuiz: quizState.isActive,
      questionsAsked: quizState.questionsAsked,
      averageScore: quizState.players.length > 0 ? 
        quizState.players.reduce((sum, p) => sum + p.score, 0) / quizState.players.length : 0,
      topPlayer: quizState.players.length > 0 ? 
        quizState.players.reduce((top, p) => p.score > top.score ? p : top) : null,
      date: new Date().toDateString()
    }
  }

  // System cleanup tasks
  performSystemCleanup() {
    // Clear old logs, temporary files, etc.
    console.log('Performing system cleanup...')
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
      console.log('Garbage collection triggered')
    }
  }

  // Start a specific job
  startJob(jobName) {
    const job = this.jobs.get(jobName)
    if (job) {
      job.start()
      console.log(`Started cron job: ${jobName}`)
      return true
    }
    console.warn(`Job not found: ${jobName}`)
    return false
  }

  // Stop a specific job
  stopJob(jobName) {
    const job = this.jobs.get(jobName)
    if (job) {
      job.stop()
      console.log(`Stopped cron job: ${jobName}`)
      return true
    }
    console.warn(`Job not found: ${jobName}`)
    return false
  }

  // Start all jobs
  startAllJobs() {
    console.log('Starting all cron jobs...')
    
    // Schedule all jobs
    this.scheduleDailyReminder()
    this.scheduleWeeklyReset()
    this.scheduleHourlyCleanup()
    this.scheduleDailyStats()
    this.scheduleWeekendMarathon()
    this.schedulePerformanceMonitoring()
    
    // Start all jobs
    this.jobs.forEach((job, jobName) => {
      job.start()
      console.log(`✓ Started: ${jobName}`)
    })
    
    console.log(`🕐 All ${this.jobs.size} cron jobs are now active`)
  }

  // Stop all jobs
  stopAllJobs() {
    console.log('Stopping all cron jobs...')
    
    this.jobs.forEach((job, jobName) => {
      job.stop()
      console.log(`✓ Stopped: ${jobName}`)
    })
    
    console.log('All cron jobs stopped')
  }

  // Get job status
  getJobStatus() {
    const status = {}
    this.jobs.forEach((job, jobName) => {
      status[jobName] = {
        running: job.running || false,
        scheduled: job.scheduled || false
      }
    })
    return status
  }

  // Remove a job
  removeJob(jobName) {
    const job = this.jobs.get(jobName)
    if (job) {
      job.stop()
      this.jobs.delete(jobName)
      console.log(`Removed cron job: ${jobName}`)
      return true
    }
    return false
  }
}

export default CronJobManager
