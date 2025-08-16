const express=require("express");
const app=express.Router();
const {body}=require("express-validator");
const { userRegister, userLogin, user_Logout } = require("../Controller/UserController");

app.post("/register",
    body("username").isEmail().isString().isLength({min:3}).withMessage("Username must be at least 3 characters long"),
    body("password").isStrongPassword().isString().isLength({min:6}).withMessage("Password")
,userRegister)

app.post("/login",
    body("username").isEmail().isString().isLength({min:3}).withMessage("Username must be at least 3 characters long"),
    body("password").isStrongPassword().isString().isLength({min:6}).withMessage("Password")
,userLogin)

app.get("/logout",user_Logout)

// app.get("/profile",)
module.exports=app