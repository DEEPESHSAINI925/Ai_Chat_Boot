
var ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey : process.env.publicKey,
    privateKey :   process.env.privateKey,
    urlEndpoint : process.env.urlEndpoint
});

// Function to upload an image to ImageKit
const uploadImage = async (file,fileName) => {
    try {
        const response = await imagekit.upload({
        file: file, // base64 string
        fileName: fileName, // required
        folder: "/uploads", // optional, specify the folder where you want to upload the image
        });
        return response;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
    }
module.exports = { uploadImage };   