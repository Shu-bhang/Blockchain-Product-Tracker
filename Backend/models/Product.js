const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  userId: String,
  productHash: String,
  name: String,
  location: String,
  timestamp: Date
});

module.exports = mongoose.model("Product", ProductSchema);