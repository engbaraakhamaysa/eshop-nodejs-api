const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserId,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.get("/allusers", authMiddleware, getAllUsers);
router.get("/authuser", authMiddleware, (req, res) => {
  res.json(req.user);
});

router.get("/user/:id", authMiddleware, getUserId);
router.delete("/user/:id", authMiddleware, deleteUser);
router.put("/user/:id", authMiddleware, updateUser);
router.post("/user", authMiddleware, createUser);
module.exports = router;
