const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerUser);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", authMiddleware, logoutUser);

// @route   GET api/auth/check-auth
// @desc    Check authentication status
// @access  Private
router.get("/check-auth", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated",
    user: req.user,
  });
});

module.exports = router;