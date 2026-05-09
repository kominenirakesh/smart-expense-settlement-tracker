import mongoose from "mongoose";
const PostSchema = new mongoose.Schema(
    {
       name :{
            type : String,
            required :true,
            trim : true
       },
       description :{
            type : String,
            required :true,
            trim : true
       },
      age :{
            type : Number,
            required :true,
            min:1,
            max:150
       },
       user:{
               type: mongoose.Schema.Types.ObjectId,
               ref:"User",
               required:true
          },
    },
    {
        timestamps:true
    }
);

export const Post = mongoose.model('Post',PostSchema);