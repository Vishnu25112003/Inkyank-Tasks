const Player = require("../models/Player");

exports.submitScore = async (req, res) => {
  const { name, score, totalQuestions, correctAnswers } = req.body;

  // Basic validation
  if (!name || score === undefined || totalQuestions === undefined || correctAnswers === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const player = new Player({
    name,
    score,
    totalQuestions,
    correctAnswers,
  });

  try {
    const saved = await player.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const players = await Player.find()
      .sort({ score: -1 })
      .limit(10)
      .select("name score timestamp -_id"); // Exclude _id and include only needed fields
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};