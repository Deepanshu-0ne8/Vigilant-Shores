import express from 'express';
import { authorize } from '../middleware/auth.middleware.js';
import { getProfile, removeDp, updateProfile } from '../controllers/user.controllers.js';
import { upload } from '../middleware/multer.middleware.js';

const userRouter = express.Router();

userRouter.get('/profile', authorize, getProfile);

userRouter.patch('/profile/update', authorize, upload.single('displayPic'), updateProfile);

userRouter.delete('/profile/deleteDp', authorize, removeDp);

export default userRouter;