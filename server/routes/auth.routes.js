const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", protect, authController.logout);

module.exports = router;