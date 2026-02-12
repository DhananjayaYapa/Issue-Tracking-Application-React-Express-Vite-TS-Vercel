// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const UPLOAD_DIR = path.join(__dirname, "../../uploads");
// if (!fs.existsSync(UPLOAD_DIR)) {
//   fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// }

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, UPLOAD_DIR);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     const ext = path.extname(file.originalname);
//     const baseName = path
//       .basename(file.originalname, ext)
//       .replace(/[^a-zA-Z0-9_-]/g, "_");
//     cb(null, `${uniqueSuffix}-${baseName}${ext}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/gif",
//     "image/webp",
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     "application/vnd.ms-excel",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     "text/plain",
//     "text/csv",
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(
//         "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, PDF, DOC, DOCX, XLS, XLSX, TXT, CSV",
//       ),
//       false,
//     );
//   }
// };

// // Create multer instance
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB max
//   },
// });

// module.exports = { upload, UPLOAD_DIR };


const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const s3 = require("../config/s3");

// Allowed MIME types
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
];

// Multer file filter
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, PDF, DOC, DOCX, XLS, XLSX, TXT, CSV"
      ),
      false
    );
  }
};

let upload;

if (s3 && process.env.AWS_BUCKET_NAME) {
  // Multer S3 storage
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: "private",
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const timestamp = Date.now().toString();
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext).replace(
          /[^a-zA-Z0-9_-]/g,
          "_"
        );
        cb(null, `${timestamp}-${baseName}${ext}`);
      },
    }),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
} else {
  // Fallback to memory storage if S3 is not configured
  upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
}

module.exports = { upload };