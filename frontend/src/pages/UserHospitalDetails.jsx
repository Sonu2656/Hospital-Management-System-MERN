import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./UserHospitalDetails.css";

const UserHospitalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hospital = location.state;

  const [showModal, setShowModal] = useState(false);

  if (!hospital) {
    return <p className="error-message">No hospital details available.</p>;
  }

  return (
    <div className="hospital-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>

      <h1 className="hospital-name">{hospital.name}</h1>
      <img src={hospital.imageUrl || "https://via.placeholder.com/400"} alt={hospital.name} className="hospital-image" />

      <div className="hospital-info">
        <p><strong>City:</strong> {hospital.city}</p>
        <p><strong>Specialities:</strong> {hospital.specialities?.length > 0 ? hospital.specialities.join(", ") : "N/A"}</p>
        <p><strong>Rating:</strong> {hospital.rating ?? "Not Rated"} / 5</p>
        <p><strong>Number of Doctors:</strong> {hospital.numberOfDoctors || "N/A"}</p>
        <p><strong>Departments:</strong> {hospital.numberOfDepartments || "N/A"}</p>
        <p><strong>Description:</strong> {hospital.description || "No description available."}</p>

        {hospital.images?.length > 0 && (
          <div className="hospital-images">
            <h3>Additional Images</h3>
            <div className="image-gallery">
              {hospital.images.map((img, index) => (
                <img key={index} src={img} alt={`Hospital ${index + 1}`} className="gallery-image" />
              ))}
            </div>
          </div>
        )}
      </div>

      <button 
        className="book-appointment-btn" 
        onClick={() => !hospital.hasAvailableSlots ? setShowModal(true) : alert("Appointment Booked!")}
      >
        Book Appointment
      </button>

     
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Slot Not Available</h2>
            <p>Currently, there are no available slots for booking.</p>
            <button className="close-btn" onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHospitalDetails;
