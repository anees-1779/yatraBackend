import express, {Request, Response} from "express";
import dotenv from "dotenv"
import { AppDataSource } from "./config/dataSource";
import { userRouter } from "./router/userRouter";

const app = express()
dotenv.config()
app.use(express.json());


app.get("/", (req: Request, res: Response) =>{
  res.send("server is running ");
})

app.listen(3000, () =>{
  console.log("server is running on port 3000")
})

app.use('/user', userRouter);

AppDataSource.initialize()
    .then(() => {
        console.log("Database initialized successfuly")
    })
    .catch((error) => console.log(error))