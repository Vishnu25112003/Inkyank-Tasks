const express = require("express");
const router = express.Router();
const questionCtrl = require("../controllers/questionController"); // Should now resolve correctly

router.route("/")
  .get(questionCtrl.getAllQuestions)
  .post(questionCtrl.createQuestion);

router.route("/:id")
  .put(questionCtrl.updateQuestion)
  .delete(questionCtrl.deleteQuestion);

module.exports = router;