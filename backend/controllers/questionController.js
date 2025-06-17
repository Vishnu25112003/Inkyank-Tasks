// controllers/questionController.js
const Question = require("../models/Question");

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuestion = async (req, res) => {const Question = require("../models/Question");

  exports.getAllQuestions = async (req, res) => {
    try {
      const questions = await Question.find();
      res.json(questions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.createQuestion = async (req, res) => {
    console.log("Incoming create request:", req.body); // Debug log
    const question = new Question(req.body);
    try {
      const saved = await question.save(); // Only one save
      console.log("Saved question ID:", saved._id);
      res.status(201).json(saved);
    } catch (err) {
      console.error("Error saving question:", err.message);
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.updateQuestion = async (req, res) => {
    try {
      const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Question not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.deleteQuestion = async (req, res) => {
    try {
      await Question.findByIdAndDelete(req.params.id);
      res.json({ message: "Question deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  const question = new Question(req.body);
  try {
    const saved = await question.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Question not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};