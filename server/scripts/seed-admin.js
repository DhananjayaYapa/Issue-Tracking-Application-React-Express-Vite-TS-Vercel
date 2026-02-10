require("dotenv").config();

const bcrypt = require("bcryptjs");
const { sequelize, testConnection, syncDatabase } = require("../src/config/db");
const { User } = require("../src/config/db/models");

const ADMIN_USER = {
  name: "System Admin",
  email: "admin@issuetracker.com",
  password: "Admin@123",
  role: "admin",
};

const seedAdmin = async () => {
  try {
    console.log("=".repeat(50));
    console.log("SEED ADMIN USER");
    console.log("=".repeat(50));

    // Connect to database
    const connected = await testConnection();
    if (!connected) {
      console.error("Failed to connect to database. Exiting.");
      process.exit(1);
    }

    // Sync database
    await syncDatabase({ alter: true });
    console.log("Database synced successfully.");

    // Check admin already exists
    const existingAdmin = await User.findOne({
      where: { email: ADMIN_USER.email },
    });

    if (existingAdmin) {
      console.log(`\nAdmin user already exists: ${ADMIN_USER.email}`);
      console.log("Skipping seed. No changes made.");
      process.exit(0);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(ADMIN_USER.password, 10);

    // Create admin user
    const admin = await User.create({
      name: ADMIN_USER.name,
      email: ADMIN_USER.email,
      passwordHash: passwordHash,
      role: ADMIN_USER.role,
      isEnabled: true,
    });

    console.log("\nAdmin user created successfully!");
    console.log("-".repeat(40));
    console.log(`  Name:     ${admin.name}`);
    console.log(`  Email:    ${admin.email}`);
    console.log(`  Role:     ${admin.role}`);
    console.log(`  Password: ${ADMIN_USER.password}`);
    console.log("-".repeat(40));
    console.log("\nChange the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedAdmin();
