import { Response, Request } from "express"
import { AppDataSource } from "../../config/dataSource";
import { post } from "../../model/postModel/postModel";
import * as yup from 'yup';
import { picture } from "../../model/postModel/imageModel";

export const postRepository = AppDataSource.getRepository(post)

export interface decodedUser{
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

export const addPost = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const user = req.user as decodedUser;
    const userId = user.id;
    const { description, rating, difficulty, destination, category } = req.body
    const postInfo ={ description, rating, difficulty, destination, category }
    console.log(postInfo)

    await postSchema.validate(postInfo);

    // Create post
    const newPost = queryRunner.manager.create(post, {
      ...postInfo,
      user: { id: userId },
    });

    await queryRunner.manager.save(newPost);

    // Save images (if any)
    if (req.files && Array.isArray(req.files)) {
      const images = req.files.map((file: Express.Multer.File) =>
        queryRunner.manager.create(picture, {
          fileName: file.filename, // or file.path if storing path
          post: newPost,
        })
      );
      await queryRunner.manager.save(images);
    }

    // Commit transaction if all good
    await queryRunner.commitTransaction();

    res.status(200).json({
      message: "Post with images created successfully",
      post: newPost,
    });
  } catch (error) {
  await queryRunner.rollbackTransaction();
  console.error("Error creating post with images:", error);

  if (error instanceof yup.ValidationError) {
     res.status(400).json({
      message: "Validation failed",
      errors: error.errors,
    });
    return
  }

   res.status(500).json({ 
    message: "Failed to create post", 
    error: error instanceof Error ? error.message : error 
  });
  return
}

};

export const editPost = async (req: Request, res: Response) =>{
     try{  
      console.log("editPost is being called")
      const postInfo = req.body;
      const user = req.user as decodedUser
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
      const user = req.user as decodedUser
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



