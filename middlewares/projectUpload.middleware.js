const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "ProjectUploader/files";

    if (file.fieldname === "image") {
      folder = "ProjectUploader/images";
    } else if (file.fieldname === "video") {
      folder = "ProjectUploader/videos";
    }

    return {
      folder,
      public_id: `${file.fieldname}-${Date.now()}`,
      resource_type: "auto",
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
  fileFilter: (req, file, cb) => {
    console.log("Uploaded file mimetype:", file.mimetype);

    const allowedMimeTypes = [
      // Images
      "image/jpeg", "image/png", "image/webp", "image/gif",

      // Videos
      "video/mp4", "video/quicktime", "video/x-msvideo",

      // Documents
      "application/pdf", "application/zip",
      "application/msword",                              // .doc
      "application/vnd.ms-excel",                        // .xls
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",        // .xlsx
      "text/plain", "text/csv",                          // .txt, .csv

      // Audio
      "audio/mpeg", "audio/wav",

      // Fallback
      "application/octet-stream"
    ];

    // Block known dangerous file types
    const forbiddenExtensions = ['.exe', '.sh', '.bat', '.js'];
    const originalName = file.originalname.toLowerCase();
    const isForbidden = forbiddenExtensions.some(ext => originalName.endsWith(ext));

    if (isForbidden) {
      return cb(new Error("Executable files are not allowed"), false);
    }

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  }
});

module.exports = upload;
