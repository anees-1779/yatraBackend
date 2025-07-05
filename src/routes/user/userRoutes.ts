import { Router } from "express";
import { changePassword, deleteUser, editDetails } from "../../controller/user/userController";
import { verifyToken } from "../../lib/jwtVerification";

export const userRouter = Router();

userRouter.put('/', verifyToken ,editDetails);
userRouter.delete('/', verifyToken, deleteUser);
userRouter.put('/password', verifyToken, changePassword)