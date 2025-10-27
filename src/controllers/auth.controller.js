const bcrypt = require("bcryptjs");
const Client = require("../models/Client.model");
const jwt = require("jsonwebtoken");

//Create JWT token
const createAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Create Refresh Token
const createRefershToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    }
  );
};

//Register Contorller
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ error: "Invalid Input" });
    }

    const findEmail = await Client.findOne({ email });
    if (findEmail) {
      return res.status(400).json({ error: "Email Already Exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newClient = new Client({ name, email, password: hashedPassword });
    await newClient.save();

    const accessToken = createAccessToken(newClient);
    const refershToken = createRefershToken(newClient);
    res.status(200).json({
      user: {
        _id: newClient._id,
        name: newClient.name,
        email: newClient.email,
      },
      token: { Access: accessToken, Refersh: refershToken },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

//Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Client.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const accessToken = createAccessToken(user);
    const refershToken = createRefershToken(user);

    res.status(200).json({
      user: { _id: user._id, name: user.name, email: user.email },
      token: { Access: accessToken, Refersh: refershToken },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { register, login };
