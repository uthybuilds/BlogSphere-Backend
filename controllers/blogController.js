const BLOG = require("../models/blog");
const ImageKit = require("imagekit");
const fs = require("fs");
const COMMENT = require("../models/comment");

const addBlog = async (req, res) => {
  const { title, subTitle, description, category, isPublished } = req.body;
  try {
    const imageFile = req.file;

    //check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    //upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    //optimization through imageKit URL transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" }, // Auto compression
        { format: "webp" }, // convert to modern format
        { width: "1280" }, // width resize
      ],
    });

    const image = optimizedImageUrl;

    const blog = await BLOG.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });

    res
      .status(201)
      .json({ success: true, message: "Blog added successfully", blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BLOG.find({ isPublished: true });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await BLOG.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    await BLOG.findByIdAndDelete(id);

    //Delete all comments assosciated with this blog
    await COMMENT.deleteMany({ blog: id });

    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const togglePublish = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Missing blog ID" });
    const blog = await BLOG.findById(id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.status(200).json({ success: true, message: "Blog status Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const addComment = async (req, res) => {
  const { blog, name, content } = req.body;
  try {
    await COMMENT.create({ blog, name, content });
    res
      .status(201)
      .json({ success: true, message: "Comment added for review" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBlogComments = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Blog ID is required" });
    }
    const comments = await COMMENT.find({
      blog: id,
      isApproved: true,
    }).sort({
      createdAt: -1,
    });
    if (comments.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No comments found", comments: [] });
    }
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  togglePublish,
  addComment,
  getBlogComments,
};
