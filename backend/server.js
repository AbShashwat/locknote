// ---------- IMPORTS ----------
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

// ---------- APP SETUP ----------
const app = express();
const PORT = 5000;
const JWT_SECRET = "locknote_secret_key";

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- MONGODB CONNECTION ----------
mongoose.connect(
  "mongodb+srv://locknoteUser:Shashwat%40123@cluster0.fvjhn3s.mongodb.net/locknote"
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));

// ---------- USER SCHEMA ----------
const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: { type: String, unique: true },
    password: String
});
const User = mongoose.model("User", UserSchema);

// ---------- DOCUMENT SCHEMA ----------
const DocumentSchema = new mongoose.Schema({
    username: String,
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});
const Document = mongoose.model("Document", DocumentSchema);

// ---------- PHOTO SCHEMA ----------
const PhotoSchema = new mongoose.Schema({
    username: String,
    name: String,
    imagePath: String,
    uploadedAt: { type: Date, default: Date.now }
});
const Photo = mongoose.model("Photo", PhotoSchema);

// ---------- MULTER CONFIG ----------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ---------- JWT AUTH MIDDLEWARE ----------
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.username = decoded.username;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

// ---------- ROUTES ----------
app.get("/", (req, res) => {
    res.send("LockNote backend running");
});

// ---------- AUTH ROUTE ----------
app.post("/auth", async (req, res) => {
    const { firstName, lastName, username, password, mode } = req.body;

    try {
        // ---------- SIGNUP ----------
        if (mode === "signup") {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.json({ message: "Username already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                firstName,
                lastName,
                username,
                password: hashedPassword
            });

            await newUser.save();
            return res.json({ message: "Signup successful" });
        }

        // ---------- LOGIN ----------
        if (mode === "login") {
            const user = await User.findOne({ username });
            if (!user) {
                return res.json({ message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.json({ message: "Invalid password" });
            }

            const token = jwt.sign(
                { username: user.username },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.json({
                message: "Login successful",
                token
            });
        }

        return res.json({ message: "Invalid request" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ---------- DOCUMENT ROUTES (PROTECTED) ----------
app.post("/documents", authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const username = req.username;

    try {
        const newDoc = new Document({ username, title, content });
        await newDoc.save();
        res.json({ message: "Document saved successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error saving document" });
    }
});

app.get("/documents", authMiddleware, async (req, res) => {
    try {
        const docs = await Document.find({ username: req.username });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching documents" });
    }
});

// ---------- PHOTO ROUTES (PROTECTED) ----------
app.post("/photos", authMiddleware, upload.single("photo"), async (req, res) => {
    const { name } = req.body;
    const username = req.username;

    try {
        const newPhoto = new Photo({
            username,
            name,
            imagePath: req.file.path
        });

        await newPhoto.save();
        res.json({ message: "Photo uploaded successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error uploading photo" });
    }
});

app.get("/photos", authMiddleware, async (req, res) => {
    try {
        const photos = await Photo.find({ username: req.username });
        res.json(photos);
    } catch (err) {
        res.status(500).json({ message: "Error fetching photos" });
    }
});

// ---------- SERVE UPLOADED IMAGES ----------
app.use("/uploads", express.static("uploads"));

// ---------- START SERVER ----------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
