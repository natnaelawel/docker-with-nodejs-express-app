import Blog from "../models/blog";

export const getAllBlogs = async (req, res) => {
  try {
    const data = await Blog.find({});
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Blog.findById(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, body } = req.body;
    const blog = new Blog();
    blog.title = title;
    blog.body = body;
    const result = await blog.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const updateBlog = (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const result = await Blog.findByIdAndUpdate(id, { title, body });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const deleteBlog = (req, res) => {
  try {
    const { id } = req.params;
    const result = await Blog.findByIdAndDelete(id);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
