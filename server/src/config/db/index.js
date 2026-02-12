const { Sequelize } = require("sequelize");

let sequelize = null;

// Only create Sequelize instance if DB credentials are available
if (process.env.DB_NAME && process.env.DB_USER && process.env.DB_HOST) {
  try {
    // Optimized for serverless (Vercel)
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
          max: isServerless ? 2 : 10, // Smaller pool for serverless
          min: 0,
          acquire: isServerless ? 3000 : 30000, // Faster timeout for serverless
          idle: isServerless ? 0 : 10000, // Close idle connections immediately in serverless
          evict: isServerless ? 1000 : 1000,
        },
        define: {
          timestamps: true,
          underscored: true,
        },
        dialectOptions: {
          connectTimeout: isServerless ? 5000 : 10000, // 5s timeout for serverless
        },
      },
    );
  } catch (error) {
    console.error("Failed to create Sequelize instance:", error.message);
  }
} else {
  console.warn(
    "Database credentials not configured. DB_NAME:",
    process.env.DB_NAME,
    "DB_USER:",
    process.env.DB_USER,
    "DB_HOST:",
    process.env.DB_HOST,
  );
}

//Test database connection
const testConnection = async () => {
  if (!sequelize) {
    console.warn("Sequelize not initialized - skipping connection test");
    return false;
  }
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully (Sequelize)");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
};

const syncDatabase = async (options = {}) => {
  if (!sequelize) {
    console.warn("Sequelize not initialized - skipping sync");
    return false;
  }
  try {
    await sequelize.sync(options);
    console.log("Database synchronized");
    return true;
  } catch (error) {
    console.error("Database sync failed:", error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
};
