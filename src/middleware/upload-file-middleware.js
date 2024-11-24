import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images/"); // Path where the file will be stored
  },
  filename: (req, file, cb) => {
    // Get the email from the request and sanitize the filename
    const email = req.user.email.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize email (replace non-alphanumeric chars)
    const originalName = file.originalname;
    const extname = path.extname(originalName);
    const baseName = path.basename(originalName, extname); // Get the original filename without extension

    // Create a new filename format: email-originalfilename.extension
    cb(null, `${email}-${baseName}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Format image tidak sesuai"), false);
  }
  cb(null, true);
};

const uploadFileMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

export { uploadFileMiddleware };
