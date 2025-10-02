const jwt = require("jsonwebtoken");
const BLOG = require("../models/blog");
const COMMENT = require("../models/comment");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await BLOG.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await COMMENT.find({})
      .populate("blog")
      .sort({ createdAt: -1 });

    if (!comments.length) {
      return res.status(200).json({
        success: true,
        comments: [],
        message: "No comments found",
      });
    }

    res.status(200).json({
      success: true,
      comments,
      count: comments.length, // Optional: Send total count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await BLOG.find({}).sort({ createdAt: -1 }).limit(5);
    const blogs = await BLOG.countDocuments();
    const comments = await COMMENT.countDocuments();
    const drafts = await BLOG.countDocuments({ isPublished: false });

    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs,
    };
    res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedComment = await COMMENT.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    await COMMENT.findByIdAndUpdate(id, { isApproved: true });
    res
      .status(200)
      .json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  adminLogin,
  getAllBlogsAdmin,
  getAllComments,
  getDashboard,
  deleteCommentById,
  approveCommentById,
};
