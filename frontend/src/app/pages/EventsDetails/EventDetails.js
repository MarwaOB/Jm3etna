"use client";
import { useState } from "react";
import "./EventDetails.css";


const EventDetails = ({ event }) => {
  const [selectedNeedType, setSelectedNeedType] = useState(""); // Track selected need type
  const [needs, setNeeds] = useState(event?.needs || []); // List of needs for the event
  const [newNeed, setNewNeed] = useState({
    type: "",
    requiredPeople: "",
    skill: "",
    startTime: "",
    endTime: "",
    itemName: "",
    requiredQuantity: "",
    amountRequired: "",
  });

  // Function to handle need type selection
  const handleNeedTypeChange = (e) => {
    setSelectedNeedType(e.target.value);
  };

  // Function to update the newNeed state
  const handleInputChange = (e) => {
    setNewNeed({
      ...newNeed,
      [e.target.name]: e.target.value,
    });
  };

  // Function to add a new need
  const addNeed = () => {
    if (!selectedNeedType) return;

    let updatedNeed = { ...newNeed, type: selectedNeedType };

    setNeeds([...needs, updatedNeed]);
    setSelectedNeedType(""); // Reset type selection
    setNewNeed({}); // Clear input fields
  };

  return (
    <div className="event-details-container">
      {/* Event Details Section */}
      <div className="event-info">
        <h2>{event?.eventName || "Event Details"}</h2>
        <p><strong>Start Date:</strong> {event?.dateStart}</p>
        <p><strong>Status:</strong> {event?.status ? "Completed" : "Ongoing"}</p>

        <h3>📌 Needs for This Event</h3>
        
        {/* Needs Display Section */}
        <div className="needs-section">
          {needs.map((need, index) => (
            <div key={index} className="need-card">
              <h3>{need.type.toUpperCase()} Need</h3>
              {need.type === "human" && (
                <>
                  <p><strong>Required People:</strong> {need.requiredPeople}</p>
                  <p><strong>Skill Needed:</strong> {need.skill}</p>
                  <p><strong>Start Time:</strong> {need.startTime}</p>
                  <p><strong>End Time:</strong> {need.endTime}</p>
                </>
              )}
              {need.type === "material" && (
                <>
                  <p><strong>Item:</strong> {need.itemName}</p>
                  <p><strong>Required Quantity:</strong> {need.requiredQuantity}</p>
                </>
              )}
              {need.type === "financial" && (
                <>
                  <p><strong>Amount Required:</strong> ${need.amountRequired}</p>
                </>
              )}
            </div>
          ))}
        </div>
        
        <h3>➕ Add a New Need</h3>
        <select value={selectedNeedType} onChange={handleNeedTypeChange}>
          <option value="">Select Need Type</option>
          <option value="human">Human</option>
          <option value="material">Material</option>
          <option value="financial">Financial</option>
        </select>

        {selectedNeedType && (
          <div className="add-need-form">
            {selectedNeedType === "human" && (
              <>
                <label>Required People:</label>
                <input type="number" name="requiredPeople" onChange={handleInputChange} />
                <label>Skill:</label>
                <select name="skill" onChange={handleInputChange}>
                  <option value="medical">Medical</option>
                  <option value="teaching">Teaching</option>
                </select>
                <label>Start Time:</label>
                <input type="time" name="startTime" onChange={handleInputChange} />
                <label>End Time:</label>
                <input type="time" name="endTime" onChange={handleInputChange} />
              </>
            )}
            {selectedNeedType === "material" && (
              <>
                <label>Item Name:</label>
                <input type="text" name="itemName" onChange={handleInputChange} />
                <label>Required Quantity:</label>
                <input type="number" name="requiredQuantity" onChange={handleInputChange} />
              </>
            )}
            {selectedNeedType === "financial" && (
              <>
                <label>Amount Required:</label>
                <input type="number" name="amountRequired" onChange={handleInputChange} />
              </>
            )}
            <button onClick={addNeed}>Add Need</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
