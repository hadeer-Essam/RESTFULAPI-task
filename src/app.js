const express= require("express");
const cors = require("cors");
const mongoose = require("./db/mongoose");

const app = express();
const User= require("./routes/user");
const Task= require("./routes/task");
app.use(express.json());
// app.use(cors);
const port= process.env.PORT || 8080;


app.use(User);
app.use(Task);
app.listen(port,()=>{
    console.log("localhost: ",port)
})
