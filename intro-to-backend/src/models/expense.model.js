import mongoose  from "mongoose";
const expenseSchema = mongoose.Schema({
    amount:
    {
        type : Number,
        required : true,
    },
     description :
     {
        type:String,
        required:true,
     },
          category: {
         type: String,
        enum: ["Food", "Travel", "Shopping", "Bills", "Rent", "Other"],
         default: "Other"
         },
     PaidBy:
     {
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true,
     },
     groupId:
     {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group",
        required:true,
     },
     splitBetween:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
     ]

},
{
  timestamps : true,
});
export const Expense = mongoose.model("Expense",expenseSchema);