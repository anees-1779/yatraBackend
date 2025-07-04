import { Router } from "express";
import { deleteUser, editDetails } from "../../controller/user/userController";
import { verifyToken } from "../../lib/jwtVerification";

export const userRouter = Router();

userRouter.put('/', verifyToken ,editDetails);
userRouter.delete('/', verifyToken, deleteUser);