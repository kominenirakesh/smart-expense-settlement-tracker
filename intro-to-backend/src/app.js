import express from "express";
import cors from "cors";
import errorHandler from "./middleware/error.middleware.js";
const app = express();

//import routers
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import groupRouter from "./routes/group.routes.js"
import expenseRouter from "./routes/expense.routes.js";


app.use(cors());
app.use(express.json());

//routes Declaration
app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/groups",groupRouter);
app.use("/api/v1/expense",expenseRouter);

//example route  url = http://localhost:4000/api/v1/users/register

// if any routues throw the error Error handler will handle it(Gobal Error Handler)
app.use(errorHandler);
export default app;