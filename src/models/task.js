const mongoose= require("mongoose");

const taskSchema= new mongoose.Schema({
    name:{
        type:String,
        requiredt:true,
        unique:true,
        trim:true,
    },
    description:{
        type:String,
        requiredt:true,
        trim:true,
    },
    status:{
        type:Boolean,
        default:false
    }
});
const Task=mongoose.model("task",taskSchema)
module.exports=Task;