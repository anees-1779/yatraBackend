import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/dataSource"; 


declare global {
  namespace Express {
    interface Request {
      user?: object;  // to use user info  from decoded token everywhere
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    console.log("verification is being called")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, JWT_SECRET as string);
    console.log(decoded)
    if (!decoded) {
      res.status(401).json({ message: "Invalid token structure" });
      return;
    }
    (req as any).user = decoded;
    next(); 
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

        
export const generateToken = (payload: object) =>{
  const token = jwt.sign(payload , JWT_SECRET as string,{expiresIn:'1h'});
  return token;
} 