const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://admin:admin123@cluster0.d8t6o1w.mongodb.net/?appName=Cluster0"
);

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
const authRoutes = require("./routes/auth");

app.use("/auth", authRoutes);
const productRoutes = require("./routes/products");

app.use("/products", productRoutes);
const handleLogin = (email, password) => {

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  localStorage.setItem("auth", "true");
  localStorage.setItem("userId", email);

  setIsLoggedIn(true);
};