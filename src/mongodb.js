const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/userDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
