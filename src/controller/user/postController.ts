import { Response, Request } from "express"
import { AppDataSource } from "../../config/dataSource";
import { post } from "../../model/postModel";

const postRepository = AppDataSource.getRepository(post)

interface user{
  name: string;
  role: string,
  age: number,
  email: string,
  id: number,
}

export const addPost = async (req: Request, res:Response) =>{
  console.log("addpost is being called")
  const { description, rating } = req.body;
  const user = req.user as user
  const userId = user.id
  if(!description || !rating){
    res.status(401).json({
      message: "Both rating and description are needed"
    })
    return;
  }
 const createPost =  postRepository.create({
      description: description,
      rating: Number(rating),
      user: { id: userId }
  })
  await postRepository.save(createPost)
  res.status(200).json({
    message: "Post created successfully",
    createPost
  })
}