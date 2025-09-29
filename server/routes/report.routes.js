import express from 'express';
import { authorize } from '../middleware/auth.middleware.js';
import { createReport, deleteReport, getAllReports, getReportById } from '../controllers/report.controller.js';

const reportRouter = express.Router();

reportRouter.get('/get', authorize , getAllReports);

reportRouter.get('/get/:id', authorize, getReportById);

reportRouter.delete('/delete/:id', authorize, deleteReport);

reportRouter.post('/create', authorize, createReport);

export default reportRouter;