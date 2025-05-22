// routes/user.route.js
const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateAvatar,
} = require("../controllers/user.controller");

const { uploadAvatar } = require("../middlewares/multer.middleware"); // ✅ Correct file

const router = express.Router();

router.post("/register", uploadAvatar, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
const verifyToken = require('../middlewares/auth.middleware')
router.get('/me', verifyToken, getCurrentUser)
router.put("/profileAvatar", verifyToken, uploadAvatar, updateAvatar);
module.exports = router;
