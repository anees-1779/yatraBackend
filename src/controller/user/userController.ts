import { Request, Response } from "express"
import { userRepository } from "../auth/auth";
import { decodedUser } from "../post/postController";
import { user } from "../../model/userModel";
import { checkPassword, hashpassword } from "../../lib/hashPassword";


export const editDetails = async (req: Request, res: Response) =>{
  try{
    const { name , age, phone_number } = req.body;
    if(!name || !age || !phone_number){
      res.status(400).json({
        message: "please input all the fields"
      })
      return;
    }
    const user = req.user as decodedUser
    const userId = user.id
    const getUser = await userRepository.findOne({where: {id: Number(userId)}})
    if(!getUser){
      res.status(400).json({
        message: "User not found"
      })
      return;
    }
    await userRepository.createQueryBuilder()
                        .update(user)
                        .set({
                          name: name,
                          age: age,
                          phone_number: phone_number
                        })
                        .where({ id: userId })
                        .execute()

    res.status(200).json({
      message: "user edited successfully"
    })                    

  } catch( error){
    res.status(400).json({
      message: error
    })
  }
}

export const deleteUser = async (req: Request, res: Response) =>{
    try{
        const getUser = req.user as decodedUser
        const userId = getUser.id;
        const findUser = await userRepository.findOne(
                                              {where: {id: userId}}
                                            )
        if(!findUser){
          res.status(400).json({
            message: "User doesnot exist"
          })
          return;
        }
        await userRepository.createQueryBuilder()
                            .delete()
                            .from(user)
                            .where({id: userId })
                            .execute()
        res.status(200).json({
          message: "User deleted successfully"
        })
    }catch(error){
      res.status(400).json({
        message: error
      })
    }

}

export const changePassword = async (req: Request, res: Response) =>{
 try{ 
  const { oldPassword, newPassword } = req.body;
  const getUser = req.user as decodedUser;
  const userId = getUser.id;
  const usersDetail = await userRepository.findOne({where: {id: userId}})
  const usersPassword = usersDetail?.password
  console.log(usersPassword)
  const verifyOldPassword = await checkPassword(oldPassword, usersPassword as string)
  console.log(verifyOldPassword)
  if(!verifyOldPassword){
    res.status(403).json({
      message: "Your old password doesnot match"
    })
    return;
  }
  const hashedPassword = await hashpassword(newPassword);
  await userRepository.createQueryBuilder()
                      .update()
                      .set({
                        password: hashedPassword
                      })
                      .execute()
  res.status(200).json({
    message: "Password updated successfully"
  })
}catch(error){
  res.status(400).json({
    message: error
  })
}
}