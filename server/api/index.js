let handler;

try {
  const serverless = require("serverless-http");
  const app = require("../src/server");
  handler = serverless(app);
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
