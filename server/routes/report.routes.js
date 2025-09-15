import express from 'express';

const reportRouter = express.Router();

reportRouter.get('/', (req, res) => {
  res.send({
    message: 'all reports'
  });
});


export default reportRouter;