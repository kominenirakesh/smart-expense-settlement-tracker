import mongoose from 'mongoose';

const groupSchema = mongoose.Schema(
  {
    name:{
        type : String,
        trim : true,
        required : true
    },
    CreatedBy:
    {
       type : mongoose.Schema.Types.ObjectId,
       ref : "User",
       required:true
    },
    members:[
        {
               type : mongoose.Schema.Types.ObjectId,
               ref : "User",

        }
    ]
  
 
  },
  {
    timestamps:true,
  }
);
export const Group = mongoose.model("Group",groupSchema);
