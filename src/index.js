const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const User = require("./mongodb");
const session = require("express-session");

const app = express();

app.use(session({
    secret: "876543234567809876", // change this to a strong secret in production
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, "../public")));


const templatePath = path.join(__dirname, "../templates");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set("view engine", "hbs");
app.set("views", templatePath);


const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

app.get("/", (req, res) => {
    res.render("login");
});


app.get("/signup", (req, res) => {
    res.render("registration");
});


app.post("/signup", upload.single("photo"), async (req, res) => {
    try {
        const { username, email, password, confirmPassword, location, landSize, crops } = req.body;

        if (password !== confirmPassword) {
            return res.send("Passwords do not match!");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send("User already exists. Try to LogIN");
        }

        const newUser = new User({
            username,
            email,
            password,
            location,
            landSize,
            crops,
            photo: req.file.filename,
            appliedSchemes: ["PM-Kisan"],
            eligibleSchemes: ["Soil Health Card", "KCC"]
        });

        await newUser.save();
        res.redirect(`/profile?email=${email}`);
    } catch (error) {
        console.error(error);
        res.send("Signup error");
    }
});



app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.send("Invalid email or password.");
        }

        req.session.user = user; 
        res.redirect("/profile");
    } catch (error) {
        res.send("Error logging in.");
    }
});


app.get('/index', (req, res) => {
    res.render('index');
});

app.get("/loan", (req, res) => {
    res.render("loan");
});

app.get("/crop", (req, res) => {
    res.render("crop");
});

app.get("/schemes", (req, res) => {
    res.render("schemes");
});

app.get("/contact", (req, res) => {
    res.render("contact");
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

app.get("/profile", async (req, res) => {
    try {
        const sessionUser = req.session.user;

        if (!sessionUser) {
            return res.send("User not logged in.");
        }

        const userData = await User.findOne({ email: sessionUser.email });

        if (!userData) {
            return res.send("User not found.");
        }

        res.render("profile", {
            username: userData.username,
            email: userData.email,
            location: userData.location,
            landSize: userData.landSize,
            crops: userData.crops,
            photo: userData.photo, 
            appliedSchemes: ['PM-KISAN', 'Soil Health Card'],
            eligibleSchemes: ['Irrigation Support Yojana', 'Crop Insurance Scheme']
        });
    } catch (error) {
        res.send("Error loading profile.");
    }
});
app.post('/add-applied-scheme', (req, res) => {
    const { schemeName } = req.body;
    console.log('New Applied Scheme:', schemeName);
    res.redirect('/profile');
});

app.post('/add-eligible-scheme', (req, res) => {
    const { schemeName } = req.body;
    console.log('New Eligible Scheme:', schemeName);
    res.redirect('/profile');
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
