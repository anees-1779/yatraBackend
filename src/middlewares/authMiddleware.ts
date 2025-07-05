import express, { Request, Response, NextFunction } from 'express';
import {expressjwt} from 'express-jwt';
import { JWT_SECRET } from '../config/dataSource'; 

const app = express();

app.use(express.json()); 

// JWT middleware
export const auth = expressjwt({
        secret: JWT_SECRET as string,
        algorithms: ['HS256'],
        }).unless({
        path: ['/public', 'auth/login', 'auth/register','/user/reset-password'],
        });



