const { Router } = require("express");
const {
  getAllBlogs,
  createBlog,
  getBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/blogs");
const { protectRoute } = require("../middlewares/auth");

const router = Router();

router.get("/", getAllBlogs);
router.post("/", protectRoute, createBlog);
router.get("/:id", getBlog);
router.patch("/:id", protectRoute, updateBlog);
router.delete("/:id", protectRoute, deleteBlog);

module.exports = router;
