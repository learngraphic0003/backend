const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const upload = require("../middlewares/projectUpload.middleware");
const {
  createProject,
  getAllProjects,
  searchProjects,
  updateProject,
  deleteProject,
  getProjectById,
  getMyProjects,
} = require("../controllers/project.controller");

const router = express.Router();

// 🔹 Upload Project (Authenticated + File Upload)
router.post(
  "/upload",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createProject
);

// 🔹 Get all projects (Public)
router.get("/all", getAllProjects);

// 🔹 Search projects by name (Public)
router.get("/search", searchProjects);

// 🔹 Update a project (Owner/Admin) ✅ FILE SUPPORT ADDED HERE
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateProject
);

// 🔹 Delete a project (Owner/Admin)
router.delete("/:id", verifyToken, deleteProject);

// 🔹 Get single project by ID (Admin Access)
router.get("/:id", verifyToken, getProjectById);

// 🔹 Get projects of logged-in user
router.get("/my-projects", verifyToken, getMyProjects);

module.exports = router;
