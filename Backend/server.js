const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Auth endpoints
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "demo@example.com" && password === "password123") {
    res.json({
      success: true,
      token: "mock-jwt-token",
      user: { id: "1", name: "Demo User", email, role: "user" },
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/api/auth/register", (req, res) => {
  res.json({
    success: true,
    message: "Registration successful",
    user: { id: Date.now().toString(), ...req.body, role: "user" },
  });
});

// Items endpoints
app.get("/api/items", (req, res) => {
  res.json({
    success: true,
    items: [
      {
        id: "1",
        title: "Vintage Denim Jacket",
        category: "Outerwear",
        size: "M",
        condition: "Good",
        description: "Classic vintage denim jacket",
        images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a"],
        owner: "Demo User",
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
});
