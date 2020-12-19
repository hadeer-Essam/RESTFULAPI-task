const jwt = require("jsonwebtoken");
const User= require("../models/user");
 const auth=async function (req,res,next){
    try{
        const token= req.header('Authorization').replace("Bearer ","");
        const decodeToken=jwt.verify(token,"thisismynewcourse");
        const user= await User.findOne({_id:decodeToken._id,"tokens.token":token});
        if(!user){throw new Error ("you are not authonticated");}
        req.user=user;
        req.token=token;
        next();
    }catch(err){
        res.send({
            status:0,
            error:err.message
        });
    }
    

}

module.exports=auth;