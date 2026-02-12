/**
 * Migration script to drop assigned_to column from issues table
 * Run: node scripts/drop_assigned_to.js
 */
require("dotenv").config();
const { sequelize } = require("../src/config/db/models");

async function dropAssignedToColumn() {
  try {
    console.log("Starting migration: Drop assigned_to column...\n");

    // Drop foreign key constraint
    console.log("1. Dropping foreign key constraint...");
    try {
      await sequelize.query(
        "ALTER TABLE issues DROP FOREIGN KEY fk_issues_assigned_to",
      );
      console.log("   ✓ Foreign key constraint dropped");
    } catch (err) {
      if (err.original?.code === "ER_CANT_DROP_FIELD_OR_KEY") {
        console.log("   ⓘ Foreign key constraint does not exist, skipping");
      } else {
        throw err;
      }
    }

    // Drop index
    console.log("2. Dropping index...");
    try {
      await sequelize.query("DROP INDEX idx_issues_assigned_to ON issues");
      console.log("   ✓ Index dropped");
    } catch (err) {
      if (
        err.original?.code === "ER_CANT_DROP_FIELD_OR_KEY" ||
        err.original?.code === "ER_KEY_DOES_NOT_EXITS"
      ) {
        console.log("   ⓘ Index does not exist, skipping");
      } else {
        throw err;
      }
    }

    // Drop column
    console.log("3. Dropping assigned_to column...");
    try {
      await sequelize.query("ALTER TABLE issues DROP COLUMN assigned_to");
      console.log("   ✓ Column dropped");
    } catch (err) {
      if (err.original?.code === "ER_CANT_DROP_FIELD_OR_KEY") {
        console.log("   ⓘ Column does not exist, skipping");
      } else {
        throw err;
      }
    }

    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  }
}

dropAssignedToColumn();
