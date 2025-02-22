/* const {Router}=require("express");
const multer=require("multer");
const path=require('path');

const Blog=require("../models/blog");
const Comment=require("../models/comment")
const router=Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
    const fileName=`${Date.now()}-${file.originalname}`;
    cb(null,fileName);
    },
  });
  const upload = multer({ storage: storage })
  
router.get('/add-new',(req,res)=>{
    return res.render("addBlog",{
        user: req.user,
    });
});

router.get('/:id',async (req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    const comments=await Comment.find({blogId: req.params.id}).populate('createdBy');
    return res.render('blog',{
        user:req.user,
        blog,
        comments,
    });
});

router.post("/comment/:blogId",async (req,res)=>{
    await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

router.post('/',upload.single('coverImage'),async (req,res)=>{
        const {title,body}=req.body
        const blog=await Blog.create({
            body,
            title,
            createdBy:req.user._id,
            coverImageURL:`/uploads/${req.file.filename}`,
        })
        return res.redirect(`/blog/${blog._id}`);
});

module.exports=router */
const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

// Route to render the 'Add New Blog' page
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

// Route to fetch and display a specific blog post
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

// Route to add a comment on a blog post
router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

// Route to add a new blog
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});


// Route to render the 'Edit Blog' page with pre-filled blog data
router.get('blog/edit/:blogId', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }
        return res.render("editBlog", { user: req.user, blog });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
});

router.post("blog/edit/:blogId", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.findById(req.params.blogId);

  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  // If a new image is uploaded, update the cover image URL
  if (req.file) {
    blog.coverImageURL = `/uploads/${req.file.filename}`;
  }

  // Update title and body
  blog.title = title;
  blog.body = body;

  await blog.save();
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
