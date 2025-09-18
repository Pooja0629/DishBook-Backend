const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const mongoURL = "mongodb+srv://ReceipeUser:Pooja2906@receipe.hnkhrxa.mongodb.net/recipesDB?retryWrites=true&w=majority";
mongoose.connect(mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  steps: String,
  category: String,
  userEmail: String
});
const Recipe = mongoose.model("Recipe", recipeSchema);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

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

app.post("/recipes", async (req, res) => {
  try {
    const { name, ingredients, steps, category, userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: "User email required to save recipe" });
    }

    const recipe = new Recipe({ name, ingredients, steps, category, userEmail });
    await recipe.save();

    res.json({ message: "Recipe added successfully", recipe });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/recipes/:email", async (req, res) => {
  try {
    const recipes = await Recipe.find({ userEmail: req.params.email });
    res.json(recipes);
  } catch (err) {
    res.status(500).send(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
