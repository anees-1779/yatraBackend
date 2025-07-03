import { Request, Response } from "express"
import { user } from "../model/user";
import { AppDataSource } from "../config/dataSource";
import { hashedPassword } from "../lib/hashPassword";

const userRepository = AppDataSource.getRepository(user);

export const registerUser = async (req:Request, res:Response)=>{
  const  {name , age, email, password, phone_number, role} = req.body

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