const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const db = require("./src/Database/db");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { generateText } = require("./src/services/service");

const httpServer = createServer(app);

// Connect to database
db();

// Enable CORS for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Replace with your frontend URL if needed
    methods: ["GET", "POST"]
  }
});

// Chat history storage
const chatHistory = [];

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });

  socket.on("message", async (data) => {
    console.log("📨 Message received:", data);

    try {
      // Add user message to history
      chatHistory.push({
        role: "user",
        parts: [{ text: data.content }]
      });

      // Trim history to avoid memory issues
      if (chatHistory.length > 50) {
        chatHistory.shift();
      }

      // Generate AI response
      const response = await generateText(chatHistory);

      // Add bot response to history
      chatHistory.push({
        role: "model",
        parts: [{ text: response }]
      });

      // Send response back to client
      socket.emit("ai-message-response", response);
    } catch (error) {
      console.error("⚠️ Error generating response:", error);
      socket.emit("ai-message-response", "Sorry, something went wrong.");
    }
  });
});

// Start server
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});