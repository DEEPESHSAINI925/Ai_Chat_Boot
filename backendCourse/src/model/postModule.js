const mongoose=require("mongoose");
const postschema=mongoose.Schema({
    imageURL:{
        type:String,
        unique:true,
        require:true,
    },
    content:{
        type:String,
        require:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }
})
const postModel=mongoose.model("post",postschema)
module.exports={postModel}