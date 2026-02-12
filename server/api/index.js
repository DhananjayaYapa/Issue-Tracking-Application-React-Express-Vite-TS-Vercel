let handler;

try {
  const serverless = require("serverless-http");
  const app = require("../src/server");
  const baseHandler = serverless(app);

  // Wrap handler with timeout to prevent 300s serverless timeout
  handler = async (req, res) => {
    const timeoutMs = 25000; // 25 seconds (Vercel hobby has 30s limit)

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout - database may be unreachable"));
      }, timeoutMs);
    });

    try {
      return await Promise.race([baseHandler(req, res), timeoutPromise]);
    } catch (error) {
      console.error("Handler error:", error.message);
      // Only send response if not already sent
      if (!res.headersSent) {
        res.statusCode = 504;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: "Gateway Timeout",
            message: error.message,
            hint: "Check RDS Security Group allows connections from 0.0.0.0/0",
          }),
        );
      }
    }
  };
} catch (error) {
  console.error("Failed to initialize serverless handler:", error);
  handler = async (req, res) => {
    res.status(500).json({
      error: "Server initialization failed",
      message: error.message,
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    });
  };
}

module.exports = handler;
module.exports.handler = handler;
