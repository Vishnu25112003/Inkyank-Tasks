class BackgroundJobManager {
  constructor(quizManager) {
    this.quizManager = quizManager
    this.activeJobs = new Map()
    this.jobCounter = 0
  }

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

  scheduleQuestionTimeout(timeLimit, callback) {
    return this.scheduleJob(timeLimit, callback, 'question_timeout')
  }

  scheduleScoreProcessing(delay, callback) {
    return this.scheduleJob(delay, callback, 'score_processing')
  }

  cancelAllJobs() {
    console.log(`Cancelling ${this.activeJobs.size} background jobs`)
    this.activeJobs.forEach((job, jobId) => {
      clearTimeout(job.timeoutId)
    })
    this.activeJobs.clear()
  }
}

export default BackgroundJobManager