const express = require("express");
const {
    registerUser,
    authUser,
    allUsers,
  } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// router.route("/").get(allUsers);
router.post("/register",registerUser);
router.post("/login", authUser);
router.get('/',protect, allUsers);

module.exports = router;