"use client";

import { useState } from "react";
import { FaPlus, FaThumbtack } from "react-icons/fa";

export default function CreateEvent() {
  const [needs, setNeeds] = useState([]);
  const [newNeedType, setNewNeedType] = useState("human");
  const [newNeedData, setNewNeedData] = useState({});
  
  const searchParams = useSearchParams();
  const eventName = searchParams.get("event");


  const addNeed = () => {
    if (!newNeedType) return;
    const newNeed = { type: newNeedType, id: Date.now(), data: newNeedData };
    setNeeds([...needs, newNeed]);
    setNewNeedData({});
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-100 p-4">
      <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-center">Charity Food Drive</h2>
        <p className="text-gray-600 mt-2">
          <strong>Start Date:</strong> 2025-03-20 <br />
          <strong>Status:</strong> <span className="text-green-500">Ongoing</span>
        </p>

        {/* Needs Section */}
        <h3 className="mt-6 flex items-center gap-2 text-lg font-semibold">
          <FaThumbtack className="text-red-500" /> Needs for This Event
        </h3>

        {/* Grid Layout for Needs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {needs.map((need) => (
            <div key={need.id} className="p-4 border rounded-md bg-blue-100">
              <h4 className="font-semibold uppercase text-blue-600">{need.type} Need</h4>
              {need.type === "human" && (
                <p>
                  <strong>Required People:</strong> {need.data.people || "N/A"} <br />
                  <strong>Skill Needed:</strong> {need.data.skill || "N/A"} <br />
                  <strong>Start Time:</strong> {need.data.startTime || "--:--"} <br />
                  <strong>End Time:</strong> {need.data.endTime || "--:--"}
                </p>
              )}
              {need.type === "material" && (
                <p>
                  <strong>Item:</strong> {need.data.item || "N/A"} <br />
                  <strong>Required Quantity:</strong> {need.data.quantity || "N/A"}
                </p>
              )}
              {need.type === "financial" && (
                <p>
                  <strong>Amount Required ($):</strong> {need.data.amount || "N/A"}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Add New Need */}
        <h3 className="mt-6 flex items-center gap-2 text-lg font-semibold">
          <FaPlus /> Add a New Need
        </h3>
        <select
          value={newNeedType}
          onChange={(e) => setNewNeedType(e.target.value)}
          className="w-full p-2 border rounded-md mt-2"
        >
          <option value="human">Human</option>
          <option value="material">Material</option>
          <option value="financial">Financial</option>
        </select>

        {newNeedType === "human" && (
          <>
            <input
              type="number"
              placeholder="Required People"
              className="w-full p-2 border rounded-md mt-2"
              onChange={(e) => setNewNeedData({ ...newNeedData, people: e.target.value })}
            />
            <input
              type="text"
              placeholder="Skill"
              className="w-full p-2 border rounded-md mt-2"
              onChange={(e) => setNewNeedData({ ...newNeedData, skill: e.target.value })}
            />
            <input
              type="time"
              className="w-full p-2 border rounded-md mt-2"
              onChange={(e) => setNewNeedData({ ...newNeedData, startTime: e.target.value })}
            />
            <input
              type="time"
              className="w-full p-2 border rounded-md mt-2"
              onChange={(e) => setNewNeedData({ ...newNeedData, endTime: e.target.value })}
            />
          </>
        )}

        {newNeedType === "material" && (
          <>
            <input
              type="text"
              placeholder="Item Name"
              className="w-full p-2 border rounded-md mt-2"
              onChange={(e) => setNewNeedData({ ...newNeedData, item: e.target.value })}
            />
            <input
              type="number"
              placeholder="Required Quantity"
              className="w-full p-2 border rounded-md mt-2"
              onChange={(e) => setNewNeedData({ ...newNeedData, quantity: e.target.value })}
            />
          </>
        )}

        {newNeedType === "financial" && (
          <input
            type="number"
            placeholder="Amount Required ($)"
            className="w-full p-2 border rounded-md mt-2"
            onChange={(e) => setNewNeedData({ ...newNeedData, amount: e.target.value })}
          />
        )}

        <button
          onClick={addNeed}
          className="w-full mt-4 bg-blue-600 text-white p-2 rounded-md"
        >
          Add Need
        </button>
      </div>
    </div>
  );
}