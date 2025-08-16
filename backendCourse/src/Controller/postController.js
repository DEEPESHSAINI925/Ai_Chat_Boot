const { uploadImage } = require("../Imagkitio/imagekit");
const { postModel } = require("../model/postModule");
const { getImageCaption } = require("../services/service");

const postCreate = async (req,res)=>{
    try {
        const file=req.file;
        console.log(file)
        if(!file){
            return res.status(400).json({
                message:"Please upload an image"
            });
        }
        const base64ImageFile = new Buffer.from(file.buffer).toString("base64");
        const caption = await getImageCaption(base64ImageFile);
        const uploadedImage = await uploadImage(file.fieldname,file.originalname);
        if(!uploadedImage){
            return res.status(500).json({   
                message:"Image upload failed"
            });
        }
        const post = await postModel.create({
            imageURL: uploadedImage.url,
            content: caption, // Assuming content is the original file name
            user: req.user._id
        }); 
        res.status(200).json({
            message:"Image uploaded successfully",
            post: {
                imageURL: post.imageURL,
                content: caption,
                user: post.user
            }
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error inside post"
        })
    }
}
module.exports={postCreate}