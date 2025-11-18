const { use } = require("passport");
const Client = require("../models/Client.model");

//Get All Clients
const getAllClinents = async (req, res) => {
  try {
    const clients = await Client.find().select("-password");
    res.status(200).json({ user: clients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Client.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    if (!name || !email || !role || !password || password.length < 8) {
      return res.status(401).json({ error: "Invalid input" });
    }

    const existingUser = await Client.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newClient = new Client({
      name,
      email,
      role,
      password: hashedPassword,
    });
    await newClient.save();

    res.status(200).json({
      user: {
        _id: newClient._id,
        name: newClient.name,
        role: newClient.role,
        email: newClient.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Check if user exists
    const user = await Client.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Validate role
    const allowedRoles = ["user", "admin", "writer"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check email uniqueness
    if (email) {
      const emailExists = await Client.findOne({ email, _id: { $ne: id } });
      if (emailExists)
        return res.status(400).json({ error: "Email already exists" });
    }

    // Prepare update object
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;

    // Update user
    const updatedUser = await Client.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllClinents, getUserId };
