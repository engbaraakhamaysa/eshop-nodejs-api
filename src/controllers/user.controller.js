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

module.exports = { getAllClinents, getUserId };
