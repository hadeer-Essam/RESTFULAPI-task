const mongoose= require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manger-api",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
}
,(err) => {
    if(err){
        throw new Error ("can't find db",err);
    }
    console.log("connected to db");
}
);

