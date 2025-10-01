import Report from "../models/reports.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const createReport = async (req, res, next) => {
    try {
        // Check if an image was uploaded
        if (!req.file) {
            return res.status(400).json({
                status: 'fail',
                message: 'Image file is required for the report'
            });
        }

        const localImagePath = req.file.path;

        // Upload image to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(localImagePath);

        if (!cloudinaryResponse || !cloudinaryResponse.url) {
            // In a real app, you'd handle the file deletion from the local system here if the upload failed
            return res.status(500).json({
                status: 'error',
                message: 'Failed to upload image to Cloudinary'
            });
        }

        // Create the report with data from req.body and the Cloudinary image URL
        const report = await Report.create({
            ...req.body,
            location: JSON.parse(req.body.location), // Assuming location comes as a stringified JSON
            image: {
                url: cloudinaryResponse.url // Store the URL returned by Cloudinary
            },
            user: req.id
        })
        
        // You might want to remove the temporary file from the local server after successful upload.
        // For that, you'd need to import 'fs' and call fs.unlinkSync(localImagePath);

        res.status(201).json({
            status: 'success',
            data: report
        });
    } catch (error) {
        next(error)
    }
}

// export const getAllReports = async (req, res, next) => {
//     try {
//         const reports = await Report.find();
//         res.status(200).json({
//             status: 'success',
//             data: reports
//         });
//     } catch (error) {
//         next(error)
//     }
// }

//changed get all reports to get reports by user

export const getAllReports = async (req, res,next) => {
    try {
        const userId = req.id;
        const report = await Report.find({ createdBy: userId }).populate({
            path: 'createdBy',
            options: { sort: { createdAt: -1 } },    
        })
        if (!report) {
            return res.status(404).json({
                message: "No applicaion found",
                success: false
            })
        }
        return res.status(200).json({
            report,
            success: true
        })

    } catch (error) {
        next(error)
    }
}

export const getReportById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const report = await Report.findById(id);
        if (!report) {
            res.status(404).json({
                status: 'fail',
                message: 'Report not found'
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: report
        });
    } catch (error) {
        if(error.name === 'CastError') {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid report ID'
            });
        }
        next(error)
    }
}

export const deleteReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const report = await Report.findByIdAndDelete(id);
        if (!report) {
            return res.status(404).json({
                status: 'fail',
                message: 'Report not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Report deleted successfully',
        });
    } catch (error) {
        next(error)
    }
}