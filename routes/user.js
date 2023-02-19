const router = require("express").Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.patch("/update-me", authController.protect, userController.updateMe);
router.get("/get-all", authController.protect, userController.getUsers);

module.exports = router;
