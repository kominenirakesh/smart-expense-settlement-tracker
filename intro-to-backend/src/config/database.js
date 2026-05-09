import mongoose from 'mongoose';
const ConnectToDB = async()=>
{
    try{
        const ConnectionInstan = await mongoose.connect(`${process.env.MONGODB_URI}`);

         console.log("\n ConnectionInstan succesFul With ID :",`${ConnectionInstan.connection.host}`);
    }
    catch(error)
    {
        console.log("\n Connection failed: ",error);
    }
}
export default ConnectToDB;