import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css"; // Ensure you have this CSS file
import Navbar from "./Navbar";
import { REPORT_API_ENDPOINT } from "../utils/constant";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${REPORT_API_ENDPOINT}/get`);
        if (response.data && response.data.report) {
          setReports(response.data.report);
        } else {
          throw new Error("Invalid data format received from server.");
        }
      } catch (err) {
        setError("Failed to fetch reports. Please try again later.");
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading Reports...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2 className="error-message">{error}</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>User Reports Dashboard</h1>
        <div className="table-responsive">
          <table className="reports-table">
            <thead>
              <tr>
                {/* 1. Added Image column header */}
                <th>Image</th> 
                <th>User</th>
                <th>Report Title</th>
                <th>Date</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  {/* 2. Added table cell for the image */}
                  <td data-label="Image">
                    {/* Check if image and url exist before rendering */}
                    {report.image && report.image.url ? (
                      <img 
                        src={report.image.url} 
                        alt={report.title} 
                        className="report-image" 
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td data-label="User">
                    <div className="user-info">
                      {report.createdBy ? report.createdBy.name : 'N/A'}
                      <span className="user-email">
                        {report.createdBy ? report.createdBy.email : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td data-label="Report Title">{report.title}</td>
                  <td data-label="Date">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td data-label="Status">
                    <span
                      className={`status-badge status-${report.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td data-label="Description" className="details-cell">
                    {report.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;