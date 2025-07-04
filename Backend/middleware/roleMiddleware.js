const verifyAdmin = (req,res,next) => {
   if(req.user.role !== "admin"){
     return res.status(403).json({error: "Admins only"});
   }
   next();
};

module.exports = verifyAdmin;