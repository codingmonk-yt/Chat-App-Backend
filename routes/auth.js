const router = require("express").Router();

const authController = require("../controllers/authController");

router.post("/login", authController.login);

router.post("/register", authController.register, authController.sendOTP);
router.post("/verify", authController.verifyOTP);
router.post("/send-otp", authController.sendOTP);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
