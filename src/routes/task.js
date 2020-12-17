const express= require("express");
const Task= require("../models/task");
const router = new express.Router();




// add new task to db
router.post("/task/add",(req,res)=>{
    const task = new Task(req.body);
    
        user.save().then(() => {
                res.status(200).send({
                    status: 1,
                    data: task,
                    error: ""
                });
            }).catch((err)=>{
                res.send({
                   status:0,
                  data:"",
                  error:err.message
                });    
        });
});

// get all tasks
router.get("/task/all",async (req,res)=>{
   
    try{
        const tasks = await Task.find({});
        if(!tasks){
            res.status(404).send({
                status:0,
                data:"",
                error:"No tasks yet in data base"
            });
            return
        }
        res.status(200).send({
            status: 1,
            data: tasks,
            error: ""
        });
    }catch(err){
        res.send({
            status:0,
            data:"",
            error:err.message
        });
    }

});

// get task by id

router.get("/task/:id",async(req,res)=>{
    const id=req.params.id;
    try{
        const task= await Task.findById(id);
        if(!task){
            res.status(404).send({
                status:0,
                data:"",
                error:"no task for this id"
            });
            return
        }
        res.status(200).send({
            status: 1,
            data: task,
            error: ""
        });

    }catch(err){
        res.send({
            status:0,
            data:"",
            error:err.message
        });

    }
})

module.exports=router;