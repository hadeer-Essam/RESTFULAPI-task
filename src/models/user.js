const mongoose= require("mongoose");
const validator= require("validator");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");

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
        match:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{timestamps:true});

// remove password before sending data to user
userSchema.methods.toJSON=function(){
    let user= this;
    user=user.toObject();
    delete user.password;
    delete user.tokens;
    return user
}

// generate tokens when login
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse');
    user.tokens=user.tokens.concat({ token:token });
    await user.save({validateModifiedOnly:true});
    return token
}



// check if user found or not to allow him to login 
userSchema.statics.findByCredentials=async function(email,password){
    const user= await User.findOne({email});
    if(!user) throw new Error ("wrong email try again!");
    const checkPassword=await bcrypt.compare(password,user.password);
    if(!checkPassword) throw new Error ("wrong password try again!");
    return user;
}

// hash password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.password && user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})
const User=mongoose.model("user",userSchema);
module.exports=User;