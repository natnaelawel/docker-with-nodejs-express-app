const { Router } = require("express");
const {
  getAllBlogs,
  createBlog,
  getBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/blogs");

const router = Router();

router.get("/", getAllBlogs);
router.post("/", createBlog);
router.patch("/:id", updateBlog);
router.get("/:id", getBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
