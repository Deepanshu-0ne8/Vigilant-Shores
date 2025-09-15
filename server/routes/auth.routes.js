import express from 'express';

const authRouter = express.Router();

authRouter.post('/signin', (req, res) => {
  res.send({
    message: 'Sign-in successful'
  });
});

authRouter.post('/register', (req, res) => {
  res.send({
    message: 'Registration successful'
  });
});

authRouter.post('/logout', (req, res) => {
  res.send({
    message: 'Logout successful'
  });
});

export default authRouter;