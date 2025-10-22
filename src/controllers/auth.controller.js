const bcrypt = require("bcryptjs");
const Client = require("../models/Client.model");

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
    res.status(200).json({
      user: {
        _id: newClient._id,
        name: newClient.name,
        email: newClient.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

//Login
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

    res
      .status(200)
      .json({ user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { register, login };
