import cron from 'node-cron'

class CronJobManager {
  constructor(quizManager) {
    this.quizManager = quizManager
    this.jobs = new Map()
  }

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
    }, {
      scheduled: false,
      timezone: "America/New_York"
    })

    this.jobs.set('daily_reminder', job)
    console.log('Daily reminder job scheduled for 8 AM')
  }

  scheduleWeeklyReset() {
    const job = cron.schedule('0 0 * * 0', () => {
      console.log('Weekly leaderboard reset triggered')
      
      const finalResults = this.quizManager.getFinalResults()
      console.log('Weekly winners:', finalResults.leaderboard.slice(0, 3))
      
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

  scheduleHourlyCleanup() {
    const job = cron.schedule('0 * * * *', () => {
      console.log('Hourly cleanup triggered')
      
      const removedCount = this.quizManager.removeInactivePlayers()
      
      if (removedCount > 0) {
        console.log(`Hourly cleanup: removed ${removedCount} inactive players`)
      }
    }, {
      scheduled: false
    })

    this.jobs.set('hourly_cleanup', job)
    console.log('Hourly cleanup job scheduled')
  }

  startAllJobs() {
    console.log('Starting all cron jobs...')
    
    this.scheduleDailyReminder()
    this.scheduleWeeklyReset()
    this.scheduleHourlyCleanup()
    
    this.jobs.forEach((job, jobName) => {
      job.start()
      console.log(`✓ Started: ${jobName}`)
    })
    
    console.log(`🕐 All ${this.jobs.size} cron jobs are now active`)
  }

  stopAllJobs() {
    console.log('Stopping all cron jobs...')
    
    this.jobs.forEach((job, jobName) => {
      job.stop()
      console.log(`✓ Stopped: ${jobName}`)
    })
    
    console.log('All cron jobs stopped')
  }
}

export default CronJobManager