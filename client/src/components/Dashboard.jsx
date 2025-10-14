import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import Navbar from "./Navbar";
import { REPORT_API_ENDPOINT } from "../utils/constant";
import { useLocation } from "../context/LocationContext";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icons for different severities
const createCustomIcon = (severity) => {
  const colors = {
    low: "#28a745",
    medium: "#ffc107",
    high: "#dc3545",
  };

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${colors[severity]}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const { location, fetchLocation } = useLocation();
  const { user } = useAuth();

  // Image modal handlers
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Handle click outside modal to close
  const handleModalClick = (e) => {
    if (e.target.classList.contains("image-modal")) {
      closeImageModal();
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${REPORT_API_ENDPOINT}/`, {
          withCredentials: true,
        });
        if (response.data && response.data.data) {
          setReports(response.data.data);
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
    // Fetch user location on mount
    if (!location) {
      fetchLocation();
    }
  }, []);

  // Helper function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Filter verified reports and calculate distance if user location is available
  const verifiedReports = reports
    .filter((report) => report.status === "Verified")
    .map((report) => {
      if (location && report.location && report.location.coordinates) {
        const [lon, lat] = report.location.coordinates; // GeoJSON format [longitude, latitude]
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          lat,
          lon
        );
        return { ...report, distance };
      }
      return { ...report, distance: null };
    })
    .sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

  // Filter high-severity alerts (verified or pending)
  const importantAlerts = reports
    .filter(
      (report) =>
        report.severity === "high" &&
        (report.status === "Verified" || report.status === "Pending")
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5); // Top 5 alerts

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <h2>Loading Reports...</h2>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <h2 className="error-message">{error}</h2>
        </div>
      </>
    );
  }

  // Default map center (India coastline)
  const defaultCenter = location
    ? [location.latitude, location.longitude]
    : [20.5937, 78.9629]; // Center of India

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h3>📊 Dashboard</h3>
            </div>

            <nav className="sidebar-nav">
              <button
                className={`nav-item ${
                  activeSection === "overview" ? "active" : ""
                }`}
                onClick={() => setActiveSection("overview")}
              >
                <span className="nav-icon">📈</span>
                <span className="nav-text">Overview</span>
              </button>

              <button
                className={`nav-item ${
                  activeSection === "map" ? "active" : ""
                }`}
                onClick={() => setActiveSection("map")}
              >
                <span className="nav-icon">🗺️</span>
                <span className="nav-text">Heatmap</span>
              </button>

              <button
                className={`nav-item ${
                  activeSection === "nearby" ? "active" : ""
                }`}
                onClick={() => setActiveSection("nearby")}
              >
                <span className="nav-icon">📍</span>
                <span className="nav-text">Nearby Reports</span>
              </button>

              <button
                className={`nav-item ${
                  activeSection === "alerts" ? "active" : ""
                }`}
                onClick={() => setActiveSection("alerts")}
              >
                <span className="nav-icon">🚨</span>
                <span className="nav-text">Alerts</span>
                {importantAlerts.length > 0 && (
                  <span className="nav-badge">{importantAlerts.length}</span>
                )}
              </button>

              <button
                className={`nav-item ${
                  activeSection === "all" ? "active" : ""
                }`}
                onClick={() => setActiveSection("all")}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-text">All Reports</span>
              </button>
            </nav>

            <div className="sidebar-footer">
              <div className="sidebar-stats">
                <div className="mini-stat">
                  <span className="mini-stat-icon">📊</span>
                  <div>
                    <div className="mini-stat-value">{reports.length}</div>
                    <div className="mini-stat-label">Total</div>
                  </div>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-icon">✓</span>
                  <div>
                    <div className="mini-stat-value">
                      {verifiedReports.length}
                    </div>
                    <div className="mini-stat-label">Verified</div>
                  </div>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-icon">🚨</span>
                  <div>
                    <div className="mini-stat-value">
                      {importantAlerts.length}
                    </div>
                    <div className="mini-stat-label">Alerts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          <div className="dashboard-container">
            <div className="dashboard-header">
              <h1 className="dashboard-title">
                <span className="title-icon">🌊</span>
                Coastal Monitoring Dashboard
              </h1>
            </div>

            {/* Overview Section - Stats Grid */}
            {(activeSection === "overview" || activeSection === "overview") && (
              <div className="dashboard-grid">
                <div className="grid-stats">
                  <div className="stat-card stat-total">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                      <div className="stat-value">{reports.length}</div>
                      <div className="stat-label">Total Reports</div>
                    </div>
                  </div>
                  <div className="stat-card stat-verified">
                    <div className="stat-icon">✓</div>
                    <div className="stat-content">
                      <div className="stat-value">{verifiedReports.length}</div>
                      <div className="stat-label">Verified</div>
                    </div>
                  </div>
                  <div className="stat-card stat-alerts">
                    <div className="stat-icon">🚨</div>
                    <div className="stat-content">
                      <div className="stat-value">{importantAlerts.length}</div>
                      <div className="stat-label">High Priority</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Map Section */}
            {(activeSection === "overview" || activeSection === "map") && (
              <section className="dashboard-section map-section">
                <div className="section-header">
                  <h2>🗺️ Interactive Heatmap</h2>
                  {!location && (
                    <button
                      onClick={fetchLocation}
                      className="btn-fetch-location"
                    >
                      📍 Enable Location
                    </button>
                  )}
                </div>
                <div className="map-container">
                  <MapContainer
                    center={defaultCenter}
                    zoom={location ? 10 : 5}
                    style={{
                      height: "500px",
                      width: "100%",
                      borderRadius: "12px",
                    }}
                    className="leaflet-map"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* User location marker */}
                    {location && (
                      <>
                        <Marker
                          position={[location.latitude, location.longitude]}
                        >
                          <Popup>
                            <strong>📍 Your Location</strong>
                          </Popup>
                        </Marker>
                        <Circle
                          center={[location.latitude, location.longitude]}
                          radius={5000}
                          pathOptions={{
                            color: "#3498db",
                            fillColor: "#3498db",
                            fillOpacity: 0.1,
                          }}
                        />
                      </>
                    )}

                    {/* Report markers */}
                    {reports
                      .filter(
                        (report) =>
                          report.location && report.location.coordinates
                      )
                      .map((report) => {
                        const [lon, lat] = report.location.coordinates;
                        return (
                          <Marker
                            key={report._id}
                            position={[lat, lon]}
                            icon={createCustomIcon(report.severity)}
                          >
                            <Popup>
                              <div className="map-popup">
                                {report.image?.url && (
                                  <img
                                    src={report.image.url}
                                    alt={report.title}
                                    className="popup-image"
                                  />
                                )}
                                <h3>{report.title}</h3>
                                <p>
                                  <strong>Status:</strong> {report.status}
                                </p>
                                <p>
                                  <strong>Severity:</strong>{" "}
                                  <span
                                    className={`severity-${report.severity}`}
                                  >
                                    {report.severity}
                                  </span>
                                </p>
                                <p>{report.description}</p>
                                <p className="popup-date">
                                  {new Date(
                                    report.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                  </MapContainer>
                </div>

                {/* Map Legend */}
                <div className="map-legend">
                  <h4>Legend</h4>
                  <div className="legend-items">
                    <div className="legend-item">
                      <span className="legend-dot legend-high"></span>
                      <span>High Severity</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot legend-medium"></span>
                      <span>Medium Severity</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot legend-low"></span>
                      <span>Low Severity</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Nearby Reports Section */}
            {(activeSection === "overview" || activeSection === "nearby") && (
              <section className="dashboard-section nearby-section">
                <div className="section-header">
                  <h2>📍 Verified Reports Near You</h2>
                  <span className="count-badge">
                    {verifiedReports.length} reports
                  </span>
                </div>
                <div className="heatmap-grid">
                  {verifiedReports.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <p>No verified reports available.</p>
                    </div>
                  ) : (
                    verifiedReports.slice(0, 6).map((report, index) => (
                      <div
                        key={report._id}
                        className="heatmap-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="heatmap-card-header">
                          <span
                            className={`severity-badge severity-${report.severity}`}
                          >
                            {report.severity}
                          </span>
                          {report.distance !== null && (
                            <span className="distance-badge">
                              📍 {report.distance.toFixed(1)} km
                            </span>
                          )}
                        </div>
                        {report.image?.url && (
                          <div
                            className="card-image-wrapper"
                            onClick={() => openImageModal(report.image.url)}
                            style={{ cursor: "pointer" }}
                            title="Click to enlarge"
                          >
                            <img
                              src={report.image.url}
                              alt={report.title}
                              className="heatmap-card-image"
                            />
                            <div className="image-overlay">
                              <span className="zoom-icon">🔍</span>
                            </div>
                          </div>
                        )}
                        <div className="heatmap-card-content">
                          <h3>{report.title}</h3>
                          <p className="heatmap-description">
                            {report.description?.substring(0, 80)}
                            {report.description?.length > 80 ? "..." : ""}
                          </p>
                          <div className="heatmap-meta">
                            <span className="meta-date">
                              📅{" "}
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <span className="status-verified">✓ Verified</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Alerts Section */}
            {(activeSection === "overview" || activeSection === "alerts") && (
              <section className="dashboard-section alerts-section">
                <div className="section-header">
                  <h2>🚨 Important Alerts</h2>
                  <span className="alert-count">
                    {importantAlerts.length} active
                  </span>
                </div>
                <div className="alerts-list">
                  {importantAlerts.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">✅</div>
                      <p>No active alerts at this time.</p>
                    </div>
                  ) : (
                    importantAlerts.map((alert, index) => (
                      <div
                        key={alert._id}
                        className="alert-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="alert-pulse">
                          <div className="alert-icon">
                            <span>⚠️</span>
                          </div>
                        </div>
                        <div className="alert-content">
                          <div className="alert-header">
                            <h3>{alert.title}</h3>
                            <span
                              className={`status-badge status-${alert.status.toLowerCase()}`}
                            >
                              {alert.status}
                            </span>
                          </div>
                          <p className="alert-description">
                            {alert.description}
                          </p>
                          <div className="alert-meta">
                            <span className="alert-severity severity-high">
                              🔴 High Severity
                            </span>
                            <span className="alert-time">
                              🕒 {new Date(alert.createdAt).toLocaleString()}
                            </span>
                            {alert.createdBy?.name && (
                              <span className="alert-analyst">
                                👤 {alert.createdBy.name}
                              </span>
                            )}
                          </div>
                        </div>
                        {alert.image?.url && (
                          <div
                            className="alert-thumbnail-wrapper"
                            onClick={() => openImageModal(alert.image.url)}
                            style={{ cursor: "pointer" }}
                            title="Click to enlarge"
                          >
                            <img
                              src={alert.image.url}
                              alt={alert.title}
                              className="alert-thumbnail"
                            />
                            <div className="zoom-overlay">🔍</div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* All Reports Table Section */}
            {(activeSection === "overview" || activeSection === "all") && (
              <section className="dashboard-section reports-section">
                <div className="section-header">
                  <h2>📋 All Reports</h2>
                  <span className="report-count">{reports.length} total</span>
                </div>
                <div className="table-responsive">
                  <table className="reports-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Severity</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report, index) => (
                        <tr
                          key={report._id}
                          style={{ animationDelay: `${index * 0.05}s` }}
                          className="table-row-animated"
                        >
                          <td data-label="Image">
                            {report.image?.url ? (
                              <img
                                src={report.image.url}
                                alt={report.title}
                                className="report-image"
                                onClick={() => openImageModal(report.image.url)}
                                style={{ cursor: "pointer" }}
                                title="Click to enlarge"
                              />
                            ) : (
                              <div className="no-image-placeholder">📷</div>
                            )}
                          </td>
                          <td data-label="Title" className="title-cell">
                            {report.title}
                          </td>
                          <td data-label="Severity">
                            <span
                              className={`severity-badge severity-${report.severity}`}
                            >
                              {report.severity}
                            </span>
                          </td>
                          <td data-label="Date" className="date-cell">
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
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={handleModalClick}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeImageModal}>
              ✕
            </button>
            <img src={selectedImage} alt="Preview" className="modal-image" />
            <div className="modal-caption">
              <p>Click outside or press ✕ to close</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
