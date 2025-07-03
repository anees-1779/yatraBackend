import { Router } from "express";
import { verifyToken } from "../lib/jwtVerification";
import { addPost } from "../controller/user/postController";

export const postRouter = Router();

postRouter.post('/', verifyToken ,addPost); 