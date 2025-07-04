const express =require("express");
const router=express.Router();
const compileRoutes =require("./compile");

router.use("/compile",compileRoutes);

module.exports=router;