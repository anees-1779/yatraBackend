import { Request, Response } from "express"
import { userRepository } from "../auth/auth";
import { decodedUser } from "../post/postController";
import { user } from "../../model/userModel/userModel";
import { checkPassword, hashpassword } from "../../lib/hashPassword";
import { generateOtp } from "../../lib/optGenerator";
import { sendResetPasswordMail } from "../../lib/mailer";


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

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Case 1: Only email is provided → Send OTP
    if (email && !otp && !newPassword) {
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return 
      }

      const generatedOtp = generateOtp();

      await userRepository
        .createQueryBuilder()
        .update()
        .set({ opt: generatedOtp })
        .where({ id: user.id })
        .execute();

      await sendResetPasswordMail(generatedOtp, email);

      res.status(200).json({ message: "OTP sent to email" });
      return
    }

    // Case 2: OTP and new password are provided → Reset password
    if (otp && newPassword) {
      const user = await userRepository.findOne({ where: { opt: otp } });

      if (!user) {
         res.status(400).json({ message: "Invalid OTP" });
         return
      }
      const hashedPassword = await hashpassword(newPassword)
      await userRepository
        .createQueryBuilder()
        .update()
        .set({
          password: hashedPassword,
          opt: '' // clear the otp
        })
        .where({ id: user.id })
        .execute();

       res.status(200).json({ message: "Password reset successfully" });
       return
    }

    // Invalid request
    res.status(400).json({ message: "Invalid request body" });
      return

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Something went wrong", error });
    return 
  }
};
