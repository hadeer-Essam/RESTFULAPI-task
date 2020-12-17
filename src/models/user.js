const mongoose= require("mongoose");
const validator= require("validator");
const bcrypt= require("bcrypt");

// my validating schema
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        requiredt:true,
        unique:true,
        trim:true,
    },
    age:{
        type:Number,
        validate:function(value){
            if(value<0){
                throw new Error("Enter a valid age");
            }
        }

    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        required:true,
        trim:true,
        validate:function(value){
            if(!validator.isEmail(value)){
                throw new Error("not a valid email");
            }

        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:8,
        maxlength:20,
        match:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    }


},{timestamps:true});

// remove password before sending data to user
userSchema.methods.toJSON=function(){
    let user= this;
    user=user.toObject();
    delete user.password;
    return user
}

userSchema.pre("save",async function(next){
    const user=this;
        console.log(this)
    if(user.password && user.isModified('password')){
        user.password=await bcrypt.hash(user.password,bcrypt.genSaltSync(8));
    }
    next();
});
userSchema.pre("findOneAndUpdate", async function(next){
    const user=this._update;
    console.log(this)

    if(user.password && user.isModified('password')){
        user.password=await bcrypt.hash(user.password,bcrypt.genSaltSync(8));
    console.log(user)

    }
    next();

} );

const User=mongoose.model("user",userSchema);
module.exports=User;