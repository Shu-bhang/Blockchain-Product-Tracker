const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Save product
router.post("/add", async (req, res) => {

  const product = new Product({
    userId: req.body.userId,
    productHash: req.body.productHash,
    name: req.body.name,
    location: req.body.location,
    timestamp: new Date()
  });

  await product.save();

  res.json({ message: "Product saved" });

});

// Get products of a user
router.get("/:userId", async (req, res) => {

  const products = await Product.find({
    userId: req.params.userId
  });

  res.json(products);

});

module.exports = router;