const express= require("express");
const User= require("../models/user");
const router = new express.Router();

// add new user to db
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
router.get("/user/all",async (req,res)=>{

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
router.get("/user/:id",async (req,res)=>{
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
router.patch("/user/update/:id",async (req,res)=>{
    const id= req.params.id
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
    const user=await User.findByIdAndUpdate(id,req.body,{runValidators:true,new:true,useFindAndModify:false});
    if(!user){
            return  res.status(404).send({
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

// update password
router.patch("/user/updatePassword/:id",async (req,res)=>{
    const id= req.params.id
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
    const user=await User.findById(id);
    if(!user){
            return  res.status(404).send({
                status:0,
                data:"",
                error:"no user with this id"
            });   
        }
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

router.post("/users/login",async(req,res)=>{
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
})

module.exports=router;

