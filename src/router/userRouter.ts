import { Router } from "express";
import { registerUser } from "../controller/auth";

const userRouter = Router();

userRouter.post('/auth', registerUser )

export {userRouter}