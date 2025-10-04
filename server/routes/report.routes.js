import express from 'express';
import { authorize } from '../middleware/auth.middleware.js';
import { createReport, deleteReport, getAllReports, getAllReportsOfUser, getReportById, updateReportStatusTOResolved, updateReportStatusTOVerified } from '../controllers/report.controller.js';
import { upload } from '../middleware/multer.middleware.js'; // Assuming you create this utility

const reportRouter = express.Router();

// Middleware for file upload (assuming 'reportImage' is the field name for the file)
reportRouter.post(
    '/create', 
    authorize, 
    upload.single('reportImage'), // Middleware to handle single file upload
    createReport
);

reportRouter.get('/', authorize, getAllReports)

reportRouter.get('/get', authorize , getAllReportsOfUser);

reportRouter.get('/get/:id', authorize, getReportById);

reportRouter.delete('/delete/:id', authorize, deleteReport);

reportRouter.put('/verify/:id', authorize, updateReportStatusTOVerified);

reportRouter.put('/resolve/:id', authorize, updateReportStatusTOResolved);

export default reportRouter;