import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Mock auth endpoints
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  if (email === "demo@example.com" && password === "password123") {
    res.status(200).json({
      success: true,
      token: "mock-jwt-token",
      user: {
        id: "1",
        name: "Demo User",
        email: "demo@example.com",
        role: "user"
      }
    });
  } else if (email === "admin@example.com" && password === "password123") {
    res.status(200).json({
      success: true,
      token: "mock-jwt-token-admin",
      user: {
        id: "2",
        name: "Admin User", 
        email: "admin@example.com",
        role: "admin"
      }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Invalid credentials" 
    });
  }
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: "mock-jwt-token",
    user: {
      id: Date.now().toString(),
      name,
      email,
      role: "user"
    }
  });
});

// Mock items endpoints
app.get("/api/items", (req, res) => {
  res.status(200).json({
    success: true,
    items: [
      {
        id: "1",
        title: "Vintage Denim Jacket",
        category: "Outerwear",
        size: "M",
        condition: "Good",
        description: "Classic vintage denim jacket in great condition",
        images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a"],
        owner: "Demo User",
        location: "New York",
        createdAt: new Date().toISOString()
      }
    ]
  });
});

app.post("/api/items", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Item created successfully",
    item: {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    }
  });
});

// Catch all other routes
app.get("*", (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found" 
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Something went wrong!" 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📱 API available at: http://localhost:${PORT}/api`);
  console.log(`💻 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
