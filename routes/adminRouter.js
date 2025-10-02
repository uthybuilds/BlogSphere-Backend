const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  adminLogin,
  getAllComments,
  getAllBlogsAdmin,
  deleteCommentById,
  approveCommentById,
  getDashboard,
} = require("../controllers/adminController");

router.post("/login", adminLogin);
router.get("/blogs", auth, getAllBlogsAdmin);
router.get("/comments", auth, getAllComments);
router.delete("/comments/:id", auth, deleteCommentById);
router.patch("/comments/:id", auth, approveCommentById);
router.get("/dashboard", auth, getDashboard);

module.exports = router;
