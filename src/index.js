const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const User = require("./mongodb");

const app = express();


app.use(express.static(path.join(__dirname, "../public")));


const templatePath = path.join(__dirname, "../templates");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set("view engine", "hbs");
app.set("views", templatePath);


app.get("/", (req, res) => {
    res.render("login");
});


app.get("/signup", (req, res) => {
    res.render("registration");
});


app.post("/signup", async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.send("Passwords do not match!");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("User already exists. Try logging in.");
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        
        res.render("index", { message: "Signup successful! Please log in." });
    } catch (error) {
        res.send("Error signing up.");
    }
});


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.send("Invalid email or password.");
        }

        res.render("index", { message: "Login successful!" });
    } catch (error) {
        res.send("Error logging in.");
    }
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
