import { Router } from "express";
import { verifyToken } from "../../lib/jwtVerification";
import { addPost, deletePost, editPost } from "../../controller/post/postController";
import { addComment, addOrRemoveLike } from "../../controller/post/likesController";

export const postRouter = Router();

postRouter.post('/', verifyToken ,addPost); 
postRouter.put('/', verifyToken, editPost);
postRouter.delete('/:id', verifyToken, deletePost);
postRouter.post('/like/:pid', verifyToken, addOrRemoveLike);
postRouter.post('/comment/:pid', verifyToken, addComment)