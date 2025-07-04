import { Request, Response } from "express"
import { user } from "../../model/userModel";
import { AppDataSource } from "../../config/dataSource";
import { checkPassword, hashedPassword } from "../../lib/hashPassword";
import { generateToken } from "../../lib/jwtVerification";
import * as yup from 'yup';

export const userRepository = AppDataSource.getRepository(user);

const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup
    .number()
    .required('Age is required')
    .min(0, 'Age must be a positive number'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  role: yup
    .string()
    .oneOf(['user', 'admin'], 'Role must be either user or admin') // adjust based on allowed roles
    .required('Role is required'),
  username: yup
    .string()
    .required('Username is required')
});


export const  registerUser = async (req:Request, res:Response)=>{
 try{ const  userInfo = req.body
  console.log('Register user is being called')
  await userSchema.validate(req.body)
 
  const user:any  = await userRepository.findOne({
    where: {email: userInfo.email}
  })
  if(user){
    res.status(404).send({
      message: "User already exists"
    })
    return
    }
    const hashPassword = await hashedPassword(userInfo.password)
      let newUser = {...userInfo}
      newUser.password = hashPassword
      await userRepository.save(newUser);
      res.status(200).send({
        message: "User added successfully"
      })
    }catch (error) {
    if (error instanceof yup.ValidationError) {
        res.status(400).json({
        message: "Validation failed",
        errors: error.errors, // contains array of all error messages
      });
       return
    }
}
}


export const loginUser = async (req: Request, res: Response) =>{
  const { email, password } = req.body;
  if(!email || !password)
  {
    res.status(401).json({
      message: "Email and password both are required"
    })
  }
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
    id: checkUser.id,
    username: checkUser.username
  }
  const token = generateToken(payload)
  res.status(200).send({
    message:"login successful",
    token: token
  })

}