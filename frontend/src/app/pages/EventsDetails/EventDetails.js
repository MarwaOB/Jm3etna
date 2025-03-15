"use client";
import { useState } from "react";

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

  const handleNeedTypeChange = (e) => {
    setSelectedNeedType(e.target.value);
  };

  const handleInputChange = (e) => {
    setNewNeed({
      ...newNeed,
      [e.target.name]: e.target.value,
    });
  };

  const addNeed = () => {
    if (!selectedNeedType) return;

    let updatedNeed = { ...newNeed, type: selectedNeedType };

    setNeeds([...needs, updatedNeed]);
    setSelectedNeedType(""); // Reset type selection
    setNewNeed({}); // Clear input fields
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 rounded-lg bg-white shadow-lg font-sans">
      {/* Event Details Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{event?.eventName || "Event Details"}</h2>
        <p className="text-lg text-gray-600"><strong>Start Date:</strong> {event?.dateStart}</p>
        <p className="text-lg text-gray-600"><strong>Status:</strong> {event?.status ? "Completed" : "Ongoing"}</p>
      </div>

      {/* Needs Section */}
      <h3 className="text-xl font-semibold text-gray-700 mt-6">📌 Needs for This Event</h3>
      <div className="flex flex-wrap justify-between mt-4">
        {needs.length > 0 ? (
          needs.map((need, index) => (
            <div key={index} className="bg-green-100 w-[48%] p-4 my-2 rounded-lg border-l-4 border-green-600 shadow-md text-center">
              <h3 className="text-green-700 text-lg font-semibold">{need.type.toUpperCase()} Need</h3>
              {need.type === "human" && (
                <>
                  <p className="text-gray-700"><strong>Required People:</strong> {need.requiredPeople}</p>
                  <p className="text-gray-700"><strong>Skill Needed:</strong> {need.skill}</p>
                  <p className="text-gray-700"><strong>Start Time:</strong> {need.startTime}</p>
                  <p className="text-gray-700"><strong>End Time:</strong> {need.endTime}</p>
                </>
              )}
              {need.type === "material" && (
                <>
                  <p className="text-gray-700"><strong>Item:</strong> {need.itemName}</p>
                  <p className="text-gray-700"><strong>Required Quantity:</strong> {need.requiredQuantity}</p>
                </>
              )}
              {need.type === "financial" && (
                <p className="text-gray-700"><strong>Amount Required:</strong> ${need.amountRequired}</p>
              )}
            </div>
          ))
        ) : (
          <div className="w-full p-6 text-center border-2 border-dashed border-gray-400 bg-gray-100 rounded-lg text-gray-500 italic">
            No needs added yet.
          </div>
        )}
      </div>

      {/* Add New Need */}
      <h3 className="text-xl font-semibold text-gray-700 mt-6">➕ Add a New Need</h3>
      <select 
        value={selectedNeedType} 
        onChange={handleNeedTypeChange} 
        className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Select Need Type</option>
        <option value="human">Human</option>
        <option value="material">Material</option>
        <option value="financial">Financial</option>
      </select>

      {selectedNeedType && (
        <div className="bg-green-100 p-4 mt-4 rounded-lg">
          {selectedNeedType === "human" && (
            <>
              <label className="block font-semibold mt-2">Required People:</label>
              <input type="number" name="requiredPeople" onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" />
              <label className="block font-semibold mt-2">Skill:</label>
              <select name="skill" onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1">
                <option value="medical">Medical</option>
                <option value="teaching">Teaching</option>
              </select>
              <label className="block font-semibold mt-2">Start Time:</label>
              <input type="time" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" />
              <label className="block font-semibold mt-2">End Time:</label>
              <input type="time" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" />
            </>
          )}
          {selectedNeedType === "material" && (
            <>
              <label className="block font-semibold mt-2">Item Name:</label>
              <input type="text" name="itemName" onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" />
              <label className="block font-semibold mt-2">Required Quantity:</label>
              <input type="number" name="requiredQuantity" onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" />
            </>
          )}
          {selectedNeedType === "financial" && (
            <>
              <label className="block font-semibold mt-2">Amount Required:</label>
              <input type="number" name="amountRequired" onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" />
            </>
          )}
          <button onClick={addNeed} className="bg-yellow-400 text-white py-2 px-4 rounded-lg mt-4 w-full hover:bg-green-300 transition">
            Add Need
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
