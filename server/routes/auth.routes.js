import express from 'express';
import { signIn, signOut, signUp } from '../controllers/auth.controllers.js';
import { authorize } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/signin', signIn);

authRouter.post('/register', signUp);

authRouter.post('/signout', signOut);

authRouter.get('/profile', authorize, (req, res) => {
  // If the request reaches this point, the `protect` middleware has already
  // verified the JWT and attached the user's data to `req.user`.
  
  // All we need to do is send that user object back to the client.
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
});

export default authRouter;