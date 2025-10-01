import express from 'express';
import { getProfile, signIn, signOut, signUp } from '../controllers/auth.controllers.js';
import { authorize } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/signin', signIn);

authRouter.post('/register', signUp);

authRouter.post('/signout', signOut);

authRouter.get('/profile', authorize, getProfile);

export default authRouter;