import express from 'express';
import { authorize } from '../middleware/auth.middleware.js';
import { createReport, deleteReport, getAllReports, getReportById } from '../controllers/report.controller.js';

const reportRouter = express.Router();

reportRouter.get('/', authorize , getAllReports);

reportRouter.get('/:id', authorize, getReportById);

reportRouter.delete('/:id', authorize, deleteReport);

reportRouter.post('/', authorize, createReport);

export default reportRouter;