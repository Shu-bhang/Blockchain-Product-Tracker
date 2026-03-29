const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Signup
router.post("/signup", async (req, res) => {

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  await user.save();

  res.json({ message: "User created" });

});

// Login
router.post("/login", async (req, res) => {

  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password
  });

  if(!user){
    return res.status(400).json({ message: "Invalid login" });
  }

  res.json({ message: "Login successful", userId: user._id });

});

module.exports = router;