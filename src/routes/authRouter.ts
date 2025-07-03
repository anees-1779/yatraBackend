import { Router } from 'express';
import { registerUser, loginUser } from '../controller/auth/auth';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

export { authRouter };
