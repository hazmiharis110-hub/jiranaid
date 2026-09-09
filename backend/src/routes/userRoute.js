// src/routes/userRoute.js
const express = require("express");
const {
  registerUser,
  login,
  getCurrentUser,
  switchUser,
  verifyLocation,
  logout,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/me", getCurrentUser);
router.post("/switch-user", switchUser);
router.post("/verify-location", verifyLocation);
router.post("/logout", logout);

module.exports = router;
