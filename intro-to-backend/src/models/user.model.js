import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userschema = new Schema(
{
 username:{
   type:String,
   required:[true,"Username is required"],
   unique:true,
   minLength:5,
   maxLength:30,
   trim:true
 },
 email:{
   type:String,
   required:[true,"Email is required"],
   unique:true,
   minLength:5,
   maxLength:30,
   trim:true,
   lowercase: true,
  match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
 },
 password:{
   type:String,
   required:[true,"Password is required"],
   minLength:5,
   maxLength:30,
   trim:true,
   select:false
 }
 ,
 upiId: {
  type: String,
  default: ""
}
},
{
 timestamps:true
}
);

const HashThePassword = async function () {

 if(!this.isModified("password")) return;

 this.password = await bcrypt.hash(this.password,10);

};

userschema.pre("save", HashThePassword);

userschema.methods.comparePassword = async function(password){
 return await bcrypt.compare(password,this.password);
};

export const User = mongoose.model("User", userschema);