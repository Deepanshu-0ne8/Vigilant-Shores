import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Navbar from "./Navbar";

// --- Mock Data: In a real app, this would come from an API ---
const mockReportsData = [
  {
    id: "REP-001",
    userName: "Ravi Kumar",
    userEmail: "ravi.k@example.com",
    reportType: "Coastal Flooding",
    date: "2025-09-15",
    status: "In Progress", // New reports would be in progress
    details: "Water from the high tide has entered the main market road. It's about knee-deep now.",
    location: { lat: 17.3850, lng: 78.4867 } // Example: Hyderabad (for variety, though not coastal)
  },
  {
    id: "REP-002",
    userName: "Priya Sharma",
    userEmail: "priya.s@example.com",
    reportType: "High Waves",
    date: "2025-09-15",
    status: "Pending", // Awaiting verification
    details: "The waves are crashing over the seawall near the fisherman's colony. It's very dangerous.",
    location: { lat: 12.9716, lng: 77.5946 } // Example: Bengaluru
  },
  {
    id: "REP-003",
    userName: "Anjali Das",
    userEmail: "anjali.d@example.com",
    reportType: "Infrastructure Damage",
    date: "2025-09-14",
    status: "Verified", // This one has been verified by others or an analyst
    details: "The small wooden bridge connecting to the village has been washed away by the strong currents.",
    location: { lat: 22.5726, lng: 88.3639 } // Example: Kolkata
  },
  {
    id: "REP-004",
    userName: "Sanjay Patel",
    userEmail: "sanjay.p@example.com",
    reportType: "Coastal Flooding",
    date: "2025-09-14",
    status: "Resolved", // Perhaps the water receded here
    details: "Yesterday, the water was flooding the streets, but it has now receded.",
    location: { lat: 19.0760, lng: 72.8777 } // Example: Mumbai
  },
  {
    id: "REP-005",
    userName: "Meena Iyer",
    userEmail: "meena.i@example.com",
    reportType: "Unusual Tide",
    date: "2025-09-13",
    status: "Verified",
    details: "The sea pulled back much further than normal a couple of days ago. It was very strange.",
    location: { lat: 13.0827, lng: 80.2707 } 

},]

// --- End of Mock Data ---

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchReports = () => {
      // Simulate a network delay
      setTimeout(() => {
        try {
          // In a real app, you'd make an API call here, e.g., using fetch() or axios
          // const response = await fetch('/api/reports');
          // const data = await response.json();
          setReports(mockReportsData);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch reports. Please try again later.");
          setLoading(false);
        }
      }, 1500); // 1.5 second delay
    };

    fetchReports();
  }, []); // The empty array [] means this effect runs only once on component mount

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
                <th>Report ID</th>
                <th>User Name</th>
                <th>Report Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td data-label="Report ID">{report.id}</td>
                  <td data-label="User Name">
                    <div className="user-info">
                      {report.userName}
                      <span className="user-email">{report.userEmail}</span>
                    </div>
                  </td>
                  <td data-label="Report Type">{report.reportType}</td>
                  <td data-label="Date">{report.date}</td>
                  <td data-label="Status">
                    <span
                      className={`status-badge status-${report.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td data-label="Details" className="details-cell">
                    {report.details}
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
