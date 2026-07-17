require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");

// Force IPv4 DNS resolution (fixes SRV lookup failures on some networks)
dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB Connected to Atlas");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        console.log("Retrying connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

connectDB();

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, default: "" },
    landSize: { type: Number, default: 0 },
    crops: { type: String, default: "" },
    photo: { type: String, default: "default.png" },
    appliedSchemes: [String],
    eligibleSchemes: [String],
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
