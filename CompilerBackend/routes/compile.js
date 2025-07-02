const express =require("express");
const router=express.Router;
const {compileCode}=require("../compilers");

router.post("/",(req,res)=>{
  const {language,code,input}=req.body;

  compileCode(language,code,input,(err,output) =>{
    if(err) return res.status(400).json({error:err});
    res.json({output});
  });
});

module.exports=router;
