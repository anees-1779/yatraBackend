import { Router } from "express";
import { verifyToken } from "../../lib/jwtVerification";
import { addPost, deletePost, editPost } from "../../controller/post/postController";
import { addComment, addOrRemoveLike } from "../../controller/post/likesController";
import { upload } from "../../config/multerConfig";

export const postRouter = Router();

postRouter.post('/', verifyToken ,upload.array("images", 5),addPost); 
postRouter.put('/', verifyToken, editPost);
postRouter.delete('/:id', verifyToken, deletePost);
postRouter.post('/like/:pid', verifyToken, addOrRemoveLike);
postRouter.post('/comment/:pid', verifyToken, addComment);
