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

module.exports = { getAllClinents };
