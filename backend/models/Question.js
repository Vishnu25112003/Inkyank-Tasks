const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  category: String,
});

module.exports = mongoose.model("Question", QuestionSchema);