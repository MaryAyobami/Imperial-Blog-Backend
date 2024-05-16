const db = require("../models/index");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

exports.createAdmin = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
  
      if (!(email && password && name )) {
        res.status(400).send({
          message: "All input is required,some parameters are missing",
          status: false,
        });
        return;
      }
      var hashedPassword = bcrypt.hashSync(password, 10);
  
      const userData = await db.BlogAdmin.findOne({
        where: {
          email: req.body.email,
        },
      });
  
      if (userData && req.body.email == userData.email) {
        return res.status(403).json({
          success: false,
          message: `this email is already in use, Provide another email address`,
          data: null,
        });
      }
      await db.BlogAdmin.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(200).json({
        success: true,
        message: `Admin created successfully`,
        data: null,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.message,
        data: null,
      });
    }
  };
  
exports.adminLogin = async (req, res) => {
    if (!(req.body.email && req.body.password)) {
      res.status(400).send({
        status: false,
        message: "bad request",
      });
    }
  
    const admin = await db.BlogAdmin.findOne({
      where: {
        email: req.body.email,
      },
    });
  
    if (!admin) {
      return res.status(401).send({
        status: false,
        message: "invalid email address provided",
      });
    }
  
    const validPassword = await bcrypt.compare(req.body.password, admin.password);
  
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid password", status: false });
    }
  
    let AdminData = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };
  
    const token = jwt.sign(AdminData, process.env.TOKEN, {
      expiresIn: 7200 * 100,
    });
  
    res.status(200).send({
      status: true,
      message: "Admin logged in successfully",
      data: { token },
    });
  };


exports.createBlogPost = async (req, res, next) => {
    try {
      const blogTitle = req.body.title;
      //const blogCode = req.body.blogCode;
      var check = await db.Blog.findOne({
        where: {
          title: blogTitle,
          //blogCode: blogCode
        },
      });
  
      if (check)
        return res.status(400).json({
          success: false,
          message: ` A post with the same title already exists!`,
        });

  
      const blog = await db.Blog.create({
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        authorName: req.body.authorName,
        authorBio: req.body.authorBio,
        coverPicture:  req.files.coverPicture[0].location,
        authorPicture: req.files.authorPicture[0].location,
      });

      var draft = await db.BlogDraft.findOne();
   
      if (draft){
        await db.BlogDraft.update( {
            title: '',
            content: '',
            tags: '',
            authorName: '',
            authorBio: '',
            coverPicture:  '',
            authorPicture:  ' ',
        },{
            where:{
                id: draft.id
            }
        })
      }
    
   
      res.status(200).json({
        status: true,
        message: `the blog with title ${blog.title} have been created`,
        data: {
            title: blog.title
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: false,
        data: null,
        message: err.message,
      });
    }
  };


exports.editBlogPost = async (req, res, next) => {
    try {
      console.log(req.body)
      const title = req.body.title;
      await db.Blog.update(
        {
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags,
            authorName: req.body.authorName,
            authorBio: req.body.authorBio,
            coverPicture:  req.body.coverPicture || req.files.coverPicture[0].location,
            authorPicture: req.body.authorPicture || req.files.authorPicture[0].location,
        }
        , {
        where: {
                id: req.body.id
        },
      });
      res.status(200).json({
        status: true,
        message: `Blog Post have been updated`,
        data: {
          title: title
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  };
 
exports.DeleteBlogPost = async (req, res, next) => {
    try {
      const title = req.params.title;

      await db.Blog.destroy( {
        where: {
          title: title
        },
      });
      res.status(200).json({
        status: true,
        message: `Blog Post have been deleted`,
        data: null,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  };


exports.getSingleBlogPost = async (req, res, next) => {
    try {
      const title = req.params.title;
     
      const SinglePost = await db.Blog.findOne({
          where: {
            title: title
         },
      });
      res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        SinglePost,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error : err, 
        message: "Ppst Doesn't Exist",
      });
    }
  };


exports.getAllBlogPost = async (req, res, next) => {
    try {
   
      const AllPost = await db.Blog.findAll();
      res.status(200).json({
        success: true,
        message: "Blog Posts fetched successfully",
        AllPost,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error : err, 
        message: "An error occured",
      });
    }
  };

exports.saveDraft = async (req, res, next) => {
    try {
      var draft = await db.BlogDraft.findOne();
 
      if (draft){
        await db.BlogDraft.update( req.body,{
            where:{
                id: draft.id
            }
        })
      }
      else{
        await db.BlogDraft.create({
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags,
            authorName: req.body.authorName,
            authorBio: req.body.authorBio,
            coverPicture:  req.files.coverPicture? req.files.coverPicture[0]?.location : '',
            authorPicture: req.files.authorPicture? req.files.authorPicture[0]?.location : ' ',
            subject: req.body.subject,
            blogPosts: req.body.blogPosts,
            newsletterContent: req.body.newsletterContent
          });
      }
   
      res.status(200).json({
        status: true,
        message: `Draft saved!`,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: false,
        data: null,
        message: err.message,
      });
    }
  };

  exports.getDraft = async (req, res, next) => {
    try {
      var draft = await db.BlogDraft.findOne();

     console.log(await db.BlogDraft.findAll())
      res.status(200).json({
        status: true,
        message: `Draft retrieved!`,
        draft
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: false,
        data: null,
        message: err.message,
      });
    }
  };