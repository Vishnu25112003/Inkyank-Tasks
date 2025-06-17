const express = require("express");
const router = express.Router();
const scoreCtrl = require("../controllers/scoreController");

router.post("/submit", scoreCtrl.submitScore);
router.get("/leaderboard", scoreCtrl.getLeaderboard);

module.exports = router;