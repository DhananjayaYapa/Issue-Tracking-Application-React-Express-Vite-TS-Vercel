const { Sequelize } = require("sequelize");

let sequelize = null;

// Only create Sequelize instance if DB credentials are available
if (process.env.DB_NAME && process.env.DB_USER && process.env.DB_HOST) {
  try {
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
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          timestamps: true,
          underscored: true,
        },
        dialectOptions: {
          connectTimeout: 10000,
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
