const router = require("express").Router();
const {
  addBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  togglePublish,
  addComment,
  getBlogComments,
  generateBlog,
} = require("../controllers/blogController");
const upload = require("../middleware/multer");
const auth = require("../middleware/auth");

router.post("/add", upload.single("image"), auth, addBlog);
router.get("/all", getAllBlogs);
router.get("/:id", getBlogById);
router.delete("/:id", auth, deleteBlogById);
router.patch("/:id", auth, togglePublish);

router.post("/add-comment", addComment);
router.get("/comments/:id", getBlogComments);
router.post("/generate", auth, generateBlog);

module.exports = router;
