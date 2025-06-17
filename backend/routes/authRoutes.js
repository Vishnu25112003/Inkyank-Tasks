const express = require("express")
const router = express.Router()
const {
  registerPlayer,
  loginPlayer,
  loginAdmin,
} = require("../controllers/authController")

router.post("/auth/register", registerPlayer)
router.post("/auth/login", loginPlayer)
router.post("/auth/admin/login", loginAdmin)

module.exports = router