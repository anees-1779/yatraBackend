import { Request, Response } from "express"
import { decodedUser, postRepository } from "./postController"
import { AppDataSource } from "../../config/dataSource"
import { like } from "../../model/postModel/likesModel"
import { comment } from "../../model/postModel/commentsModel";

export const likeRepository = AppDataSource.getRepository(like);
export const commentRepository = AppDataSource.getRepository(comment)

export const addOrRemoveLike = async (req: Request, res: Response) =>{
try{
    const  postId = Number(req.params.pid)

    if(!postId){
      res.status(400).json({
        message: "Post id is required"
      })
      return
    }
    const getUserInfo = req.user as decodedUser
    const userId = getUserInfo.id

    const getPost = await postRepository.findOne({where:{id: postId}})

    if(!getPost){
      res.status(404).json({
        message: "Post not found"
      })
      return
    }
    const existingLike = !!(await likeRepository.findOne({
       where: {
            post: { id: postId },
            user: { id: userId }
          }
          }));
    if(existingLike){
      await likeRepository.createQueryBuilder()
                          .delete()
                          .where({
                            post: { id: postId },
                            user: { id: userId }
                          })
                          .execute()
      await postRepository.createQueryBuilder()
                          .update()
                          .set({
                            likes: () => "likes - 1"
                          })
                          .where({ id: postId })
                          .execute();

      res.status(200).json({
        message: "Like removed successfully"
      })
      return;
    }
    await likeRepository.save({
      post: { id: postId },
      user: { id: userId }
    });
    await postRepository.createQueryBuilder()
                           .update()
                           .set({
                             likes: () => "likes + 1"
                           })
                           .where({ id: postId })
                           .execute(); 

    res.status(200).json({
      message: "Like added successfully"
    })
  }catch(error){
    res.status(400).json({
      message: error
    }
    )
  }
}

export const addComment = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const postId = Number(req.params.pid)
    const user = req.user as decodedUser
    const userId = user.id
    if (!postId || !userId || !text) {
       res.status(400).json({ message: "postId, userId and text are required" });
       return;
    }
    const checkPost = await postRepository.findOne({where: {id: postId}})

    if(!checkPost){
      res.status(404).json({
        message: "Post not found"
      })
    }
    
    const newComment = commentRepository.create({
      comment_description: text,
      user: { id: userId },
      post: { id: postId },
    });

    await commentRepository.save(newComment);

    await postRepository.createQueryBuilder()
                        .update()
                        .set({ comments: () => '"comments" + 1' })
                        .where("id = :postId", { postId })
                        .execute();

    res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};