const express= require("express");
const User= require("../models/user");
const auth= require("../middleware/auth");
const router = new express.Router();

// add new user to db(sign up)
router.post('/user/add',(req,res)=>{
    const user = new User(req.body);
    
        user.save().then(() => {
                res.status(200).send({
                    status: 1,
                    data: user,
                    error: ""
                });
            })
            .catch((err)=>{
            res.status(400).send({
                status:0,
                data:"",
                error:err.message
            });
        });
});

// get all users
router.get("/user/all",auth,async (req,res)=>{

    try{
        const users=await User.find({});
        if(!users){
            return  res.status(404).send({
                status:0,
                data:"",
                error:"No users yet in data base"
            });
            
        }
        res.status(200).send({
            status: 1,
            data: users,
            error: ""
        });
    }catch(err){
        res.status(500).send({
            status:0,
            data:"",
            error:err.message
        });
    }

});
// get user by id
router.get("/user/:id",auth,async (req,res)=>{
    const id= req.params.id
    try{
        const user=await User.findById(id);
        if(!user){
            return res.status(404).send({
                status:0,
                data:"",
                error:"no user with this id"
            });
            
        }
        res.status(200).send({
            status: 1,
            data: user,
            error: ""
        });
    }catch(err){
        res.status(500).send({
            status:0,
            data:"",
            error:err.message
        });
    }

});

// update user info
router.patch("/user/updateInfo",auth,async (req,res)=>{
    const user=req.user
    const allowedProperty=["name","email","age"];
    const updates=Object.keys(req.body);
    const isValid=updates.every((update)=> allowedProperty.includes(update));
    if(!isValid){
        return res.status(400).send({
                status:0,
                data:"",
                error:"invalid property update"
        });
    }
    try{
   updates.forEach((update)=>{ user[update]=req.body[update];});
    await user.save({validateModifiedOnly:true})
        res.status(200).send({
            status: 1,
            data: updatedUser,
            error: ""
        });
    }catch(err){
        res.status(500).send({
            status:0,
            data:"",
            error:err.message
        });
    }

});

// update password
router.patch("/user/updatePassword",auth,async (req,res)=>{
    const user=req.user;
    const allowedProperty="password";
    const updates=Object.keys(req.body);
    const isValid=updates.every((update)=> allowedProperty==update);
    if(!isValid){
        return res.status(400).send({
                status:0,
                data:"",
                error:"invalid property update"
            });
    }

    try{
   
    user.password=req.body.password;
    await user.save();

        res.status(200).send({
            status: 1,
            data: "password updated",
            error: ""
        });
    }catch(err){
        res.status(500).send({
            status:0,
            data:"",
            error:err.message
        });
    }

});

router.post("/user/login",async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password);
       const token=await user.generateAuthToken();

        res.status(200).send({
            status: 1,
            data: user,
            lastToken:token,
            error: ""
        });
    }catch(err){
        res.status(400).send({
            status:0,
            data:"",
            error:err.message
        });
    }
});

router.post("/user/logout",auth,async (req,res)=>{
    const user=req.user;
    const token=req.token;
    try{
        const index=user.tokens.indexOf(token);
        user.tokens.splice(index,1);
        await user.save({validateModifiedOnly:true});
        res.status(200).send({
            status: 1,
            data: " succefully sign out",
            error: ""
        });
    
    }catch(err){
        res.status(500).send({
            status: 0,
            error: err.message
        });
    }
});

router.post("/user/logout/all",auth,async (req,res)=>{
    const user=req.user;
    try{
        user.tokens=[];
        await user.save({validateModifiedOnly:true});
        res.status(200).send({
            status: 1,
            data: " succefully sign out all",
            error: ""
        });
    
    }catch(err){
        res.status(500).send({
            status: 0,
            error: err.message
        });
    }
});
router.post("/user/delete/me")

module.exports=router;

