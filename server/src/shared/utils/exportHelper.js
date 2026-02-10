const { Parser } = require("json2csv");

const exportToCSV = (issues) => {
  if (!issues || issues.length === 0) {
    return "No data to export";
  }

  const fields = [
    { label: "Issue ID", value: "issue_id" },
    { label: "Title", value: "title" },
    { label: "Description", value: "description" },
    { label: "Status", value: "status" },
    { label: "Priority", value: "priority" },
    { label: "Created By", value: "created_by_name" },
    { label: "Assigned To", value: "assigned_to_name" },
    { label: "Created At", value: "created_at" },
    { label: "Updated At", value: "updated_at" },
    { label: "Resolved At", value: "resolved_at" },
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(issues);

  return csv;
};

const exportToJSON = (issues) => {
  return {
    exportDate: new Date().toISOString(),
    totalCount: issues.length,
    issues: issues.map((issue) => ({
      id: issue.issue_id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      createdBy: issue.created_by_name,
      assignedTo: issue.assigned_to_name,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      resolvedAt: issue.resolved_at,
    })),
  };
};

const getExportFilename = (format) => {
  const date = new Date().toISOString().split("T")[0];
  return `issues-export-${date}.${format}`;
};

module.exports = {
  exportToCSV,
  exportToJSON,
  getExportFilename,
};
