const express=require("express")
const cookieParser = require("cookie-parser");
const app=express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/auth",require("./src/Router/UserRoute"))
app.use("/auth/post",require("./src/Router/PostRoute"))

module.exports=app