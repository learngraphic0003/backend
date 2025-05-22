
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ProjectUploader/avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `avatar-${Date.now()}`,
  },
});

const uploadAvatar = multer({ storage: avatarStorage }).single("avatar");

module.exports = { uploadAvatar };

