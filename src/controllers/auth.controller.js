const bcrypt = require("bcryptjs");
const Client = require("../models/Client.model");
const jwt = require("jsonwebtoken");

// Create JWT Access Token
const createAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Create JWT Refresh Token
const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};

// Register Controller
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(401).json({ error: "Invalid input" });
    }

    const existingUser = await Client.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newClient = new Client({ name, email, password: hashedPassword });
    await newClient.save();

    const accessToken = createAccessToken(newClient);
    const refreshToken = createRefreshToken(newClient);

    res.status(200).json({
      user: {
        _id: newClient._id,
        name: newClient.name,
        email: newClient.email,
      },
      token: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Client.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.status(200).json({
      user: { _id: user._id, name: user.name, email: user.email },
      token: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh Token Controller
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await Client.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = createAccessToken(user);

    res.status(200).json({
      user: { _id: user._id, name: user.name, email: user.email },
      token: { accessToken: newAccessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

//Logout Controller
const logout = async (req, res) => {
  try {
    //Remove token form DB
    //
    //
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { register, login, refreshToken, logout };
