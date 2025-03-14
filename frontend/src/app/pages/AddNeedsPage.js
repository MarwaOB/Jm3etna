"use client";
import { useState } from "react";
export default function Need() {
const CreateEvent = () => {
  const [needs, setNeeds] = useState([]);

  const addNeed = (type) => {
    const newNeed = { type, id: Date.now(), data: {} };
    setNeeds([...needs, newNeed]);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold">Create New Event</h2>
      
      {/* Event Details */}
      <input type="text" placeholder="Event Name" className="w-full p-2 border rounded-md mt-2"/>
      <div className="flex gap-4 mt-2">
        <input type="date" className="p-2 border rounded-md"/>
        <input type="date" className="p-2 border rounded-md"/>
      </div>
      
      {/* Add Need */}
      <div className="mt-4">
        <select onChange={(e) => addNeed(e.target.value)} className="p-2 border rounded-md">
          <option value="">Select Need Type</option>
          <option value="human">Human Need</option>
          <option value="material">Material Need</option>
          <option value="financial">Financial Need</option>
        </select>
      </div>

      {/* Display Needs */}
      {needs.map((need) => (
        <div key={need.id} className="p-3 mt-3 border rounded-md bg-gray-100">
          <h3 className="font-semibold">{need.type} Need</h3>
          
          {need.type === "human" && (
            <>
              <input type="number" placeholder="Required People" className="w-full p-2 border rounded-md mt-2"/>
              <input type="text" placeholder="Skill" className="w-full p-2 border rounded-md mt-2"/>
            </>
          )}
          
          {need.type === "material" && (
            <>
              <input type="text" placeholder="Item Name" className="w-full p-2 border rounded-md mt-2"/>
              <input type="number" placeholder="Required Quantity" className="w-full p-2 border rounded-md mt-2"/>
            </>
          )}
          
          {need.type === "financial" && (
            <>
              <input type="number" placeholder="Amount Required ($)" className="w-full p-2 border rounded-md mt-2"/>
            </>
          )}
        </div>
      ))}

      {/* Submit Button */}
      <button className="w-full mt-4 bg-green-500 text-white p-2 rounded-md">Submit Event</button>
    </div>
  );
};}
