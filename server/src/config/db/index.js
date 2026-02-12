const { Sequelize } = require("sequelize");

let sequelize = null;
let initialized = false;

// Lazy initialization - only connect when actually needed
const getSequelize = () => {
  if (initialized) return sequelize;
  initialized = true;

  if (process.env.DB_NAME && process.env.DB_USER && process.env.DB_HOST) {
    try {
      const isServerless = !!process.env.VERCEL;

      sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS || "",
        {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT || 3306,
          dialect: "mysql",
          logging: false,
          pool: {
            max: isServerless ? 2 : 10,
            min: 0,
            acquire: isServerless ? 5000 : 30000,
            idle: isServerless ? 0 : 10000,
            evict: 1000,
          },
          define: {
            timestamps: true,
            underscored: true,
          },
          dialectOptions: {
            connectTimeout: isServerless ? 5000 : 10000,
            // Socket timeout to prevent hanging on blocked firewall
            socketTimeout: isServerless ? 5000 : 30000,
          },
        },
      );
    } catch (error) {
      console.error("Failed to create Sequelize instance:", error.message);
    }
  } else {
    console.warn("Database credentials not configured.");
  }

  return sequelize;
};

// For non-serverless, initialize immediately
if (!process.env.VERCEL) {
  getSequelize();
}

//Test database connection
const testConnection = async () => {
  const db = getSequelize();
  if (!db) {
    console.warn("Sequelize not initialized - skipping connection test");
    return false;
  }
  try {
    await db.authenticate();
    console.log("Database connected successfully (Sequelize)");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
};

const syncDatabase = async (options = {}) => {
  const db = getSequelize();
  if (!db) {
    console.warn("Sequelize not initialized - skipping sync");
    return false;
  }
  try {
    await db.sync(options);
    console.log("Database synchronized");
    return true;
  } catch (error) {
    console.error("Database sync failed:", error.message);
    return false;
  }
};

module.exports = {
  get sequelize() {
    return getSequelize();
  },
  getSequelize,
  testConnection,
  syncDatabase,
};
