import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Import CSS file

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/hospitals`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setHospitals(res.data);
    } catch (error) {
      console.error("Error fetching hospitals", error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedHospitalId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedHospitalId) return;

    try {
      await axios.delete(`${BASE_URL}/hospitals/delete?id=${selectedHospitalId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setShowDeleteModal(false); 
      setSelectedHospitalId(null);
      fetchHospitals(); 
    } catch (error) {
      console.error("Error deleting hospital", error);
      alert("Failed to delete hospital.");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedHospitalId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      
      <div className="admin-top-bar">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      
      <p className="welcome-message">Welcome, Admin! You can manage hospitals here.</p>

      
      <div className="admin-buttons">
        <button onClick={() => navigate("/add-hospital")}>Add New Hospital</button>
      </div>

      
      <h2>Hospital List</h2>
      <div className="hospital-list">
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <div key={hospital._id} className="hospital-card">
              <img
                src={hospital.imageUrl || "https://via.placeholder.com/300"}
                alt={hospital.name}
                className="hospital-image"
              />
              <h3>{hospital.name}</h3>
              <p><strong>City:</strong> {hospital.city}</p>
              <p><strong>Specialities:</strong> {hospital.specialities.join(", ")}</p>
              <p><strong>Rating:</strong> ⭐ {hospital.rating}</p>
              <div className="hospital-actions">
                <button onClick={() => navigate(`/hospital-details/${hospital._id}`, { state: hospital })}>
                  More Details
                </button>
                <button onClick={() => navigate(`/edit-hospital/${hospital._id}`, { state: hospital })}>
                  Update
                </button>
                <button className="delete-btn" onClick={() => handleDeleteClick(hospital._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hospitals found.</p>
        )}
      </div>

      
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Confirm Deletion</h2>
            <p>Are you sure you want to delete this hospital?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleDeleteCancel}>Cancel</button>
              <button className="confirm-btn" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
