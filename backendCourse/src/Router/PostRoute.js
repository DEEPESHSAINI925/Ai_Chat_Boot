const express=require("express");
const usermiddleware = require("../middleware/authMiddleware");
const { upload } = require("../Multer/multer");
const { postCreate } = require("../Controller/postController");



const app =express.Router();
app.post("/",usermiddleware,upload.single("images"),postCreate)


module.exports=app;