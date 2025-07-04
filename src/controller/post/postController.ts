import { Response, Request } from "express"
import { AppDataSource } from "../../config/dataSource";
import { post } from "../../model/postModel";
import * as yup from 'yup';

const postRepository = AppDataSource.getRepository(post)

interface user{
  name: string;
  role: string,
  age: number,
  email: string,
  id: number,
}

export const postSchema = yup.object({
  description: yup.string().required('Description is required'),
  rating: yup
    .number()
    .required('Rating is required')
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must be at most 5'),
  difficulty: yup.string().required('Difficulty is required'),
  destination: yup.string().required('Destination is required'),
  category: yup.string().required('Category is required'),
});

export const addPost = async (req: Request, res: Response) =>{
   try{  
      console.log("addpost is being called")
      const postInfo = req.body;
      const user = req.user as user
      const userId = user.id
      await postSchema.validate(req.body);

      const createPost = postRepository.create({...postInfo,
        user: { id: userId }
        })
        await postRepository.save(createPost)
        res.status(200).json({
        message: "Post created successfully",
        createPost
      })
  }catch (error) {
      if (error instanceof yup.ValidationError) {
          res.status(400).json({
          message: "Validation failed",
          errors: error.errors, // contains array of all error messages
        });
         return
      }
}}

export const editPost = async (req: Request, res: Response) =>{
     try{  
      console.log("editPost is being called")
      const postInfo = req.body;
      const user = req.user as user
      const userId = user.id
      await postSchema.validate(req.body);

      const editedPost = {...postInfo,
        user: { id: userId }
        }
        await postRepository.save(editedPost)
        res.status(200).json({
        message: "Post edited successfully",
        editedPost
      })
  }catch (error) {
      if (error instanceof yup.ValidationError) {
          res.status(400).json({
          message: "Validation failed",
          errors: error.errors, // contains array of all error messages
        });
         return
      }
}}

export const deletePost = async (req: Request, res: Response) =>{
  try{  
      console.log("deletePost is being called")
      const postId = req.params.id;
      const user = req.user as user
      const findPost = await postRepository.findOne({where: {id: Number(postId)}})
      if(!findPost){
        res.status(404).json({
          message: "Post not found"
        })
        return;
      }
      await postRepository.delete({id : Number(postId)})
        res.status(200).json({
        message: "Post deleted successfully",
      })
    }catch (error) {
      if (error) {
          res.status(400).json({
          errors: error, // contains array of all error messages
        });
         return
      }
}}


