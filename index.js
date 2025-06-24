const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const authRoutes= require("./routes/auth");

const app=express();
app.use(express.json());


//connect to mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/online_judge")
 .then(() => console.log("MongoDB connected"))
 .catch((err) => console.log("MongoDB connection error:", err));
// for using frontend
app.use(express.static(path.join(__dirname,"public")));

// use routes

app.use(authRoutes);
// returns the homepage when someone visits the website
app.get("/",(req,res)=> {
    res.sendFile(path.join(__dirname,"public","index.html"));
    //res.send("hello");
});

app.listen(5000,()=>{
    console.log("Server running on http://localhost:5000");
});

