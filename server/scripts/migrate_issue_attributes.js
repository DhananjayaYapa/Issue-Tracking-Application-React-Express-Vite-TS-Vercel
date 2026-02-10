require("dotenv").config();
const { sequelize } = require("../src/config/db/index");
const IssueStatus = require("../src/config/db/models/IssueStatus");
const IssuePriority = require("../src/config/db/models/IssuePriority");

const migrate = async () => {
  try {
    console.log("Starting migration...");

    // 1. Sync new models to create tables
    console.log("Creating new tables...");
    await IssueStatus.sync();
    await IssuePriority.sync();

    // 2. Seed data
    console.log("Seeding data...");
    const statuses = ["Open", "In Progress", "Resolved", "Closed"];
    const priorities = ["Low", "Medium", "High", "Critical"];

    for (const name of statuses) {
      await IssueStatus.findOrCreate({ where: { name } });
    }
    for (const name of priorities) {
      await IssuePriority.findOrCreate({ where: { name } });
    }

    // 3. Add new columns to issues table
    console.log("Adding new columns to issues table...");
    const queryInterface = sequelize.getQueryInterface();

    try {
      await queryInterface.addColumn("issues", "status_id", {
        type: "INTEGER",
        allowNull: true, // Temporarily true for migration
      });
    } catch (e) {
      console.log("Column status_id might already exist");
    }

    try {
      await queryInterface.addColumn("issues", "priority_id", {
        type: "INTEGER",
        allowNull: true,
      });
    } catch (e) {
      console.log("Column priority_id might already exist");
    }

    // 4. Migrate data
    console.log("Migrating existing data...");
    // We use raw queries for speed and because the old columns might not be in the model definition anymore
    const [issues] = await sequelize.query(
      "SELECT issue_id, status, priority FROM issues",
    );

    for (const issue of issues) {
      // Get IDs (caching would be better but this is one-off)
      const status = await IssueStatus.findOne({
        where: { name: issue.status || "Open" },
      });
      const priority = await IssuePriority.findOne({
        where: { name: issue.priority || "Medium" },
      });

      await sequelize.query(
        `UPDATE issues SET 
                    status_id = ${status.statusId}, 
                    priority_id = ${priority.priorityId}
                WHERE issue_id = ${issue.issue_id}`,
      );
    }

    // 5. Add Constraints and Drop old columns
    console.log("Applying constraints and cleaning up...");

    // Add FK constraints
    try {
      await queryInterface.addConstraint("issues", {
        fields: ["status_id"],
        type: "foreign key",
        name: "fk_issues_status",
        references: { table: "issue_statuses", field: "status_id" },
      });
      await queryInterface.addConstraint("issues", {
        fields: ["priority_id"],
        type: "foreign key",
        name: "fk_issues_priority",
        references: { table: "issue_priorities", field: "priority_id" },
      });
    } catch (e) {
      console.log("Constraints might already exist", e.message);
    }

    // Drop old columns - careful, this is destructive
    // Check if columns exist before dropping to allow re-running
    try {
      await queryInterface.removeColumn("issues", "status");
    } catch (e) {}
    try {
      await queryInterface.removeColumn("issues", "priority");
    } catch (e) {}

    // Make new columns not null
    try {
      await queryInterface.changeColumn("issues", "status_id", {
        type: "INTEGER",
        allowNull: false,
      });
    } catch (e) {}
    try {
      await queryInterface.changeColumn("issues", "priority_id", {
        type: "INTEGER",
        allowNull: false,
      });
    } catch (e) {}

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
