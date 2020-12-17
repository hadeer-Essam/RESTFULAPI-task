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
            res.status(404).send({
                status:0,
                data:"",
                error:"No users yet in data base"
            });
            return
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
            res.status(404).send({
                status:0,
                data:"",
                error:"no user with this id"
            });
            return
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
router.patch("/user/update/:id",async (req,res)=>{
    const id= req.params.id

    try{
    const user=await User.findOneAndUpdate({_id:id},req.body,{useFindAndModify:false,new:true});
        if(!user){
            res.status(404).send({
                status:0,
                data:"",
                error:"no user with this id"
            });
            return
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


module.exports=router;

