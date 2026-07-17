require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const session = require("express-session");
const multer = require("multer");
const User = require("./mongodb");
const Scheme = require("./models/Scheme");
const Contact = require("./models/Contact");

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "876543234567809876",
    resave: false,
    saveUninitialized: false
}));

// Middleware
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine
const templatePath = path.join(__dirname, "../templates");
app.set("view engine", "hbs");
app.set("views", templatePath);

// Register HBS helper for equality check
hbs.registerHelper("eq", function (a, b) {
    return a === b;
});

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/uploads")),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Make user session available to all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

// ============ AUTH ROUTES ============

app.get("/", (req, res) => {
    if (req.session.user) return res.redirect("/index");
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("registration");
});

app.post("/signup", upload.single("photo"), async (req, res) => {
    try {
        const { username, email, password, confirmPassword, location, landSize, crops } = req.body;

        if (password !== confirmPassword) {
            return res.render("registration", { error: "Passwords do not match!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("registration", { error: "User already exists. Try to Login." });
        }

        const newUser = new User({
            username,
            email,
            password, // Will be hashed by pre-save hook
            location,
            landSize,
            crops,
            photo: req.file ? req.file.filename : "default.png",
            appliedSchemes: ["PM-KISAN"],
            eligibleSchemes: ["Soil Health Card Scheme", "Kisan Credit Card (KCC)"]
        });

        await newUser.save();
        req.session.user = { _id: newUser._id, email: newUser.email, username: newUser.username, photo: newUser.photo };
        res.redirect("/profile");
    } catch (error) {
        console.error("Signup Error:", error);
        res.render("registration", { error: "Signup failed. Please try again." });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.render("login", { error: "Invalid email or password." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render("login", { error: "Invalid email or password." });
        }

        req.session.user = { _id: user._id, email: user.email, username: user.username, photo: user.photo };
        res.redirect("/index");
    } catch (error) {
        console.error("Login Error:", error);
        res.render("login", { error: "Error logging in." });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// ============ PAGE ROUTES ============

app.get("/index", (req, res) => {
    res.render("index");
});

app.get("/loan", (req, res) => {
    res.render("loan");
});

app.get("/crop", (req, res) => {
    res.render("crop");
});

app.get("/schemes", async (req, res) => {
    try {
        const schemes = await Scheme.find({}).lean();
        res.render("schemes", { schemes: JSON.stringify(schemes) });
    } catch (error) {
        console.error("Schemes Error:", error);
        res.render("schemes", { schemes: "[]" });
    }
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.post("/contact", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const contact = new Contact({ name, email, phone, message });
        await contact.save();
        res.redirect("/thankyou");
    } catch (error) {
        console.error("Contact Error:", error);
        res.redirect("/thankyou");
    }
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/policy", (req, res) => {
    res.render("policy");
});

app.get("/thankyou", (req, res) => {
    res.render("thankyou");
});

// ============ PROFILE ROUTES ============

app.get("/profile", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/");
        }

        const userData = await User.findOne({ email: req.session.user.email });
        if (!userData) {
            return res.redirect("/");
        }

        res.render("profile", {
            username: userData.username,
            email: userData.email,
            location: userData.location,
            landSize: userData.landSize,
            crops: userData.crops,
            photo: userData.photo,
            appliedSchemes: userData.appliedSchemes,
            eligibleSchemes: userData.eligibleSchemes,
            memberSince: userData.createdAt ? userData.createdAt.toLocaleDateString("en-IN", { year: "numeric", month: "long" }) : "2025"
        });
    } catch (error) {
        console.error("Profile Error:", error);
        res.redirect("/");
    }
});

app.post("/add-applied-scheme", async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/");
        const { schemeName } = req.body;
        await User.findOneAndUpdate(
            { email: req.session.user.email },
            { $addToSet: { appliedSchemes: schemeName } }
        );
        res.redirect("/profile");
    } catch (error) {
        console.error("Add Scheme Error:", error);
        res.redirect("/profile");
    }
});

app.post("/add-eligible-scheme", async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/");
        const { schemeName } = req.body;
        await User.findOneAndUpdate(
            { email: req.session.user.email },
            { $addToSet: { eligibleSchemes: schemeName } }
        );
        res.redirect("/profile");
    } catch (error) {
        console.error("Add Scheme Error:", error);
        res.redirect("/profile");
    }
});

// ============ START SERVER ============

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
