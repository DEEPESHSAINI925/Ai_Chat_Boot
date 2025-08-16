const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel"); // Add this line
const usermiddleware = async (req, res, next) => {
   try {
   const token = req.cookies["token"]; // Corrected
   if(!token) {
         return res.status(401).json({ message: "Unauthorized user" });
   }
   const decoded=jwt.verify(token,process.env.SCREAT)
       if (!decoded) {
           return res.status(403).json({ message: "Invalid token" });
       }
       const user = await userModel.findById(decoded._id);
       if (!user) {
           return res.status(404).json({ message: "User not found" });
       }
       req.user = user;
       next();
   } catch (error) {
       return res.status(500).json({ message: "internal server error" });
   }
};
module.exports = usermiddleware;