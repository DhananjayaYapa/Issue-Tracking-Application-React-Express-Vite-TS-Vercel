const http = require("http");

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const request = (method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: PORT,
      path: `/api${path}`,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on("error", (e) => reject(e));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const verify = async () => {
  try {
    console.log("Starting API Verification...");

    // Register User
    const user = {
      name: "Test Refactor",
      email: `testrefactor${Date.now()}@example.com`,
      password: "password123",
    };
    console.log("Registering user...", user.email);
    const regRes = await request("POST", "/auth/register", user);

    if (regRes.status !== 201) {
      // Try login if user exists
      console.log("Registration failed, trying login...");
    }

    // Login to get token
    const loginRes = await request("POST", "/auth/login", {
      email: user.email,
      password: user.password,
    });

    if (loginRes.status !== 200) {
      console.error("Login failed:", loginRes.data);
      process.exit(1);
    }

    const token = loginRes.data.data.token;
    console.log("Logged in. Token received.");

    // Create Issue
    console.log("Creating issue...");
    const issueData = {
      title: "Test Database Normalization",
      description: "Checking if status/priority works",
      status: "Open",
      priority: "High",
    };

    const createRes = await request("POST", "/issues", issueData, token);
    if (createRes.status !== 201) {
      console.error("Create issue failed:", createRes.data);
      process.exit(1);
    }
    console.log("Issue created:", createRes.data);
    const issueId = createRes.data.data.insertId || createRes.data.data.id;

    // Get Issue
    console.log(`Fetching issue ${issueId}...`);
    const getRes = await request("GET", `/issues/${issueId}`, null, token);

    if (getRes.status !== 200) {
      console.error("Get issue failed:", getRes.data);
      process.exit(1);
    }

    const issue = getRes.data.data;
    console.log("Fetched Issue:", JSON.stringify(issue, null, 2));

    // Verify fields
    if (issue.status !== "Open" || issue.priority !== "High") {
      console.error(
        "FAILED: Issue fields do not match expected string values.",
      );
      console.error(
        `Expected: Open, High. Got: ${issue.status}, ${issue.priority}`,
      );
      process.exit(1);
    } else {
      console.log("PASSED: Issue fields are correct strings.");
    }

    //Update Status
    console.log("Updating status to In Progress...");
    const updateRes = await request(
      "PUT",
      `/issues/${issueId}`,
      { status: "In Progress" },
      token,
    );

    if (updateRes.status !== 200) {
      console.error("Update failed:", updateRes.data);
      process.exit(1);
    }

    // Verify Update
    const getRes2 = await request("GET", `/issues/${issueId}`, null, token);
    if (getRes2.data.data.status !== "In Progress") {
      console.error(
        "FAILED: Status did not update. Got:",
        getRes2.data.data.status,
      );
      process.exit(1);
    }
    console.log("PASSED: Status updated successfully.");

    //Get Stats
    console.log("Fetching stats...");
    const statsRes = await request("GET", "/issues/stats/counts", null, token);

    console.log("Stats:", statsRes.data);

    console.log("\nVerification Successful!");
    process.exit(0);
  } catch (e) {
    console.error("Verification failed:", e);
    process.exit(1);
  }
};

verify();
