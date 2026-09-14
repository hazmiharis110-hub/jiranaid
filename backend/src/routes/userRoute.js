// src/routes/userRoute.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
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
router.get("/me", authMiddleware, getCurrentUser);
router.get("/", getCurrentUser); // Fallback / support route if accessed without strict token
router.post("/switch-user", switchUser);
router.post("/verify-location", verifyLocation);
router.post("/logout", logout);

module.exports = router;
