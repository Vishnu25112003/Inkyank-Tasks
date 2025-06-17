module.exports = (agenda) => {
  agenda.define("clear old scores", async (job) => {
    const Score = require("../models/Score");

    const result = await Score.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) }, // Older than 10 minutes
    });

    console.log(`🧹 Cleared ${result.deletedCount} scores older than 10 minutes`);
  });
};
