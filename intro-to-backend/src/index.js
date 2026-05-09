import dotenv from "dotenv";
import ConnectToDB from "./config/database.js";
import app from './app.js';
dotenv.config({
    path :"./.env"
});
const startSever = async () =>
{
   try
   {
      await ConnectToDB();
      const PORT = process.env.PORT || 8000;
 
        const server = app.listen(PORT,()=>
        {
            console.log("\n server is running on the port Number"+`${PORT}`);
        });

         server.on("error",(error)=>
            {
                console.log("\n Error is :",error);
                throw error;
            });


   }
   catch(error)
   {
    console.log("\n Failed to start the server : ",error);
   }
}
startSever();