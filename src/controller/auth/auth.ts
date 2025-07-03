import { Request, Response } from "express"
import { user } from "../../model/userModel";
import { AppDataSource } from "../../config/dataSource";
import { checkPassword, hashedPassword } from "../../lib/hashPassword";
import { generateToken } from "../../lib/jwtVerification";

const userRepository = AppDataSource.getRepository(user);

export const registerUser = async (req:Request, res:Response)=>{
  const  {name , age, email, password, phone_number, role} = req.body
  console.log('Register user is being called')
  const user:any  = await userRepository.findOne({
    where: {email: email}
  })
  if(user){
    res.status(404).send({
      message: "User already exists"
    })
    return
    }
    
      const newUser = {
        name: name,
        age: age,
        email: email,
        password: await hashedPassword(password),
        phone_number: phone_number,
        role: role,
      }
      await userRepository.save(newUser);
      res.status(200).send({
        message: "User added successfully"
      })
}

export const loginUser = async (req: Request, res: Response) =>{
  const { email, password } = req.body;
  const checkUser = await userRepository.findOne({where: {email: email}}) 
  if(!checkUser){
    res.status(400).send({
      message: "User doesnot exist"
    })
    return;
  }
  await checkPassword(password, String(checkUser.password))
  if(!checkPassword){
    res.status(401).send({
      message: "Incorrect password" 
    })
    return;
  }
  const payload = {
    name: checkUser.name,
    role: checkUser.role,
    age: Number(checkUser.age),
    email: checkUser.email,
    id: checkUser.id
  }
  const token = generateToken(payload)
  res.status(200).send({
    message:"login successful",
    token: token
  })

}