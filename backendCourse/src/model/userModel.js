const mongoose=require("mongoose");
const schema=mongoose.Schema({
    username:{
        type:String,  
        required:true,
        minlength:3,  
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false, 
    },
    post:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
        }
    ]

});
const userModel=mongoose.model("user",schema);
module.exports=userModel;