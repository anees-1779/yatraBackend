import express, {NextFunction, Request, Response} from "express";
import { AppDataSource } from "./config/dataSource";
import { auth } from "./middlewares/authMiddleware";
import { authRouter } from "./routes/authRouter/authRouter";
import { postRouter } from "./routes/postRouter/postRouter";
import { userRouter } from "./routes/user/userRoutes";

const app = express()

app.use(express.json());
app.get("/", (req: Request, res: Response) =>{
  res.send("server is running ");
})
app.use('/auth', authRouter);
app.use(auth);
app.use('/user', userRouter)
app.use('/post' ,postRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  } else {
    next(err);
  }
});

app.listen(4000, () =>{
  console.log("server is running on port 4000")
})
AppDataSource.initialize()
    .then(() => {
        console.log("Database initialized successfuly")
    })
    .catch((error) => console.log(error))