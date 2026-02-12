const AWS = require("aws-sdk");

let s3 = null;

try {
  if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  ) {
    s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  } else {
    console.warn(
      "AWS S3 credentials not configured. File upload feature will be disabled.",
    );
  }
} catch (error) {
  console.error("Failed to initialize AWS S3:", error.message);
}

module.exports = s3;
