const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require("helmet"); // Import helmet
require("dotenv").config(); // Load .env variables
const path = require("path"); // Import path module

const app = express();
const PORT = process.env.PORT ||5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Replace with your actual API key

// ✅ Enable CORS
app.use(cors({
    origin: ["http://localhost:5000", "http://localhost"], // Allow both with and without port
    methods: ["GET", "POST"], // Allow only necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true, // Allow credentials if needed
}));

app.use(express.json()); // Parse JSON requests

// ✅ Use Helmet to set security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            scriptSrcAttr: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "https://i.imgur.com"],
            objectSrc: ["'none'"], // Disallow Flash, etc.
            upgradeInsecureRequests: [],
        },
    },
}));


// ✅ Serve static files from the 'public' directory 
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Root Route (Redirect to index.html)
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, 'public', 'main.html');
    console.log("Attempting to serve file from:", filePath);
    res.sendFile(filePath);
});

// ✅  Gemini API request
app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const response = await axios.post(apiUrl, {
            contents: [
                {
                    parts: [{ text: userMessage }]
                }
            ]
        });

        console.log("Gemini API Response:", response.data);

        const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
        res.json({ message: aiResponse });

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch Gemini API response." });
    }
});


// ✅ Start the Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));