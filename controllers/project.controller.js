const Project = require("../models/project.model");

// 🔹 Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, status, category, tags, description } = req.body;

    // With Cloudinary uploads, req.files properties will contain Cloudinary URLs in the "path"
    const image = req.files?.image?.[0]?.path || "";
    const video = req.files?.video?.[0]?.path || "";
    const file = req.files?.file?.[0]?.path;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    // Creating project instance with Cloudinary URLs
    const project = new Project({
      name,
      image,
      video,
      file,
      status,
      category,
      tags: tags ? tags.split(",") : [],
      description,
      createdBy: req.user.userId,  // Ensure userId is passed via authentication
    });

    // Save the project to the database
    await project.save();

    // Return response with the saved project data
    res.status(201).json({
      message: "Project created successfully",
      project: project.toObject(), // Convert Mongoose document to plain object
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy", "email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "❌ Error: " + error.message });
  }
};

// 🔹 Search Projects by Name and Tag
exports.searchProjects = async (req, res) => {
  try {
    const { name, tag } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive name search
    }

    if (tag) {
      query.tags = { $in: [tag] }; // Matches projects containing the provided tag
    }

    const projects = await Project.find(query);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "❌ Error: " + error.message });
  }
};

// 🔹 Update Project (Only Owner or Admin)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    // Allow only project owner or admin to update
    if (!project.createdBy.equals(req.user.userId) && req.user.role !== "admin") {
      return res.status(403).json({ message: "⛔ Access Denied" });
    }

    const { name, status, category, tags, description } = req.body;

    // Update text fields if provided
    project.name = name || project.name;
    project.status = status || project.status;
    project.category = category || project.category;
    project.tags = tags ? tags.split(",") : project.tags;
    project.description = description || project.description;

    // Update uploaded files (Cloudinary URLs will be returned in req.files)
    if (req.files?.image?.[0]) {
      project.image = req.files.image[0].path;
    }
    if (req.files?.video?.[0]) {
      project.video = req.files.video[0].path;
    }
    if (req.files?.file?.[0]) {
      project.file = req.files.file[0].path;
    }

    // Save the updated project
    await project.save();

    res.json({ message: "✅ Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "❌ Error: " + error.message });
  }
};

// 🔹 Delete Project (Only Owner or Admin)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ message: "❌ Project not found" });

    if (!project.createdBy.equals(req.user.userId) && req.user.role !== "admin") {
      return res.status(403).json({ message: "⛔ Access Denied" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error: " + error.message });
  }
};

// 🔹 Get Single Project (Admin Access)
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("createdBy", "email");
    if (!project)
      return res.status(404).json({ message: "❌ Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "❌ Error: " + error.message });
  }
};

// 🔹 Get Projects by Logged-in User
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.userId });
    if (!projects.length) {
      return res.status(404).json({ message: "Sorry, no projects right now." });
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "❌ Error: " + error.message });
  }
};
