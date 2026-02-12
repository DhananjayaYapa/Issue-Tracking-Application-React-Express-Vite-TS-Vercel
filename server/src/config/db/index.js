const { Sequelize } = require("sequelize");

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
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
  },
);

//Test database connection
const testConnection = async () => {
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
