import { Router } from "express";
import { verifyToken } from "../../lib/jwtVerification";
import { addPost, deletePost, editPost } from "../../controller/post/postController";

export const postRouter = Router();

postRouter.post('/', verifyToken ,addPost); 
postRouter.put('/', verifyToken, editPost)
postRouter.delete('/:id', verifyToken, deletePost)