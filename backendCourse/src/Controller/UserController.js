const { validationResult } = require("express-validator");
const userModel = require("../model/userModel");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userRegister = async (req,res)=>{
   try {
     const {username,password }=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    if( !username && !password ){
        return res.status(409).json({message:"Please fill all the fields"})
    }
    const existuser=await userModel.findOne({username})
    if(existuser){
        return res.status(409).json({message:"User already exists"})
    }
    const salt=await bcrypt.genSalt(8)
    const hashPassword=await bcrypt.hash(password,salt)
    const user=await userModel.create({
        username,
        password:hashPassword
    })
    if(!user){
        return res.status(500).json({message:"User not created"})
    }
    return res.status(201).json({message:"User created successfully",
        user:user
    }) 
   } catch (error) {
    return res.status(500).json({error:"Internal server error"})
   }
}

const userLogin=async (req,res)=>{
    try {
        const {username,password}=req.body;

        const error=validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({error:error.array()})
        }
        if(!username && !password){
            return res.status(409).json({"message":"All field is required"})
        }
        const userExit=await userModel.findOne({username}).select('+password')
        if(!userExit){
            return res.status(409).json({"message":"user not Exits"})
        }
        const compare= bcrypt.compare(userExit.password,password);
        if(!compare){
            return res.status(409).json({"message":"password incorrect"})
        }
        const token=jwt.sign({_id:userExit._id},process.env.SCREAT,{expiresIn:"24h"})
        res.cookie('token', token, {
            httpOnly: true,   
            secure: false,   
            maxAge: 24 * 60 * 60 * 1000 
        });
        return res.status(200).json({
            "message":"Login successfully",
            user:userExit,
            token:token
        })
        
    } catch (error) {
        return res.status(500).json({
            "message":"Internal Server Error "
        })
    }
}

const user_Logout=async (req,res)=>{
    if(!res.cookies("token")){
        return res.status(409).json({
            message:"you are already logout"
        })
    }
    req.cookie("token","")
    return res.status(200).json({
        message:"logout sucessfully"
    })
}


module.exports={userRegister,userLogin,user_Logout}