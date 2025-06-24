const express=require("express");
const bcrypt=require("bcrypt");
const User=require("../models/User");

const router=express.Router();

router.post("/register",async (req,res) => {
    const {username,email,password,role}=req.body;
   try{
     const existing=await User.findOne({email});
     if(existing){
        return res.status(400).json({error: "User already exists"});
     }
    const hashedpassword= await bcrypt.hash(password,10);

    const newUser=new User({
        username,
        email,
        password: hashedpassword,
        role
    });

    await newUser.save();
    res.json({message: "User registered successfully"});
   }
   catch(err){
     console.error("Register error",err);
     res.status(500).json({error:"Server error"});
   }
    
});

const jwt=require("jsonwebtoken");
const SECRET="supersecretkey";

// Login route
router.post("/login",async(req,res) =>{
   const {email,password}=req.body;

   try{
     const user=await User.findOne({email});
     if(!user) return res.status(400).json({error:"User not found"});

     const isMatch=await bcrypt.compare(password,user.password);
     if(!isMatch) return res.status(401).json({error: "Invalid credentials"});

     // Generate JWT

     const token =jwt.sign({id: user._id, role:user.role}, SECRET,{expiresIn: "1h"});

     res.json({message: "Login successful", token});
   }
   catch (err){
     console.error("Login error:",err);
     res.status(500).json({error:"Server error"});
   }
});

module.exports=router;