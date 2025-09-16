import Report from "../models/reports.model.js"
import mongoose from "mongoose";

export const createReport = async (req, res, next) => {
    try {
        const report = await Report.create({
            ...req.body,
            user: req.id
        })
        res.status(201).json({
            status: 'success',
            data: report
        });
    } catch (error) {
        next(error)
    }
}

export const getAllReports = async (req, res, next) => {
    try {
        const reports = await Report.find();
        res.status(200).json({
            status: 'success',
            data: reports
        });
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