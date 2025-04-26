// const express = require("express");
// const path = require("path");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const app = express();
// const PORT = 3001;

// // MongoDB connection
// mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log("✅ Connected to MongoDB"))
// .catch((err) => console.error("❌ MongoDB connection error:", err));

// // User Schema
// const userSchema = new mongoose.Schema({
//     email: { type: String, unique: true, required: true },
//     username: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
// });
// const User = mongoose.model("User", userSchema);

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));

// // Serve pages
// app.get("/", (req, res) => {
//     res.redirect("/login");
// });

// app.get("/login", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "login.html"));
// });

// app.get("/register", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "register.html"));
// });

// app.get("/home", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "home.html"));
// });



// app.get("/templates", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "template.html"));
// });

// // Login route
// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({ success: false, message: "Please fill in all fields." });
//     }

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ success: false, message: "Invalid credentials." });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ success: false, message: "Invalid credentials." });
//         }

//         // If matched, return success
//         return res.json({ success: true, redirect: "/home" });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });

// // Register route
// app.post("/register", async (req, res) => {
//     const { email, username, password, confirmPassword } = req.body;

//     if (!email || !username || !password || !confirmPassword) {
//         return res.status(400).json({ success: false, message: "Please fill in all fields." });
//     }

//     if (password !== confirmPassword) {
//         return res.status(400).json({ success: false, message: "Passwords do not match." });
//     }

//     if (password.length < 8) {
//         return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
//     }

//     try {
//         const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: existingUser.email === email
//                     ? "Email already in use."
//                     : "Username already taken."
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 12);
//         const newUser = new User({ email, username, password: hashedPassword });
//         await newUser.save();

//         return res.json({ success: true, redirect: "/home" });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: "Registration failed. Please try again." });
//     }
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3001;

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/templates", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "template.html"));
});

// Login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please fill in all fields." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        return res.json({ success: true, redirect: "/home" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Register route
app.post("/register", async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: "Please fill in all fields." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    if (password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? "Email already in use."
                    : "Username already taken."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ email, username, password: hashedPassword });
        await newUser.save();

        return res.json({ success: true, redirect: "/home" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Registration failed. Please try again." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});