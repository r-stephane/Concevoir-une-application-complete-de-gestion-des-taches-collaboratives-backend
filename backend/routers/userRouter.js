const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const clientController = require("../controllers/clientController");

const {
  register,
  verifyOtp,
  login,
  reinisilize,
  resetPassword,
} = require("../controllers/userController");

// --- Routes Utilisateur ---
router.post("/register", register);
router.patch("/verify-email", verifyOtp);
router.post("/login", login);
router.post("/reinisilize", reinisilize);
router.patch("/resetPassword", resetPassword);

router.post("/tasks", authMiddleware, clientController.addTask);
router.patch(
  "/tasks/:id/status/:status",
  authMiddleware,
  clientController.updateTaskStatus
);

module.exports = router;
