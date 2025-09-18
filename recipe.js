const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB connection
const mongoURL = "mongodb+srv://ReceipeUser:Pooja2906@receipe.hnkhrxa.mongodb.net/recipesDB?retryWrites=true&w=majority";
mongoose.connect(mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// ✅ Schemas & Models
const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  steps: String,
  category: String
});
const Recipe = mongoose.model("Recipe", recipeSchema);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({ message: `Welcome back, ${user.username}!`, user });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/recipes", (req, res) => {
  console.log("Received:", req.body);
  res.json({ message: "Recipe received!" });
});

// Dummy Auth Routes
app.post("/auth/signup", (req, res) => {
  const { username, password } = req.body;
  res.json({ message: "User created" });
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  res.json({ token: "JWT_TOKEN_HERE" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
