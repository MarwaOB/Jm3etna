"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaTimes } from "react-icons/fa";
import DonutChart from "../components/DonutChart";
import CreateEvent from "./AddNeedsPage";

export default function EventsPage() {
  const router = useRouter();

  const handleRowClick = (eventName) => {
    console.log("ani hnaaaaaaaaaaaaaa");
    router.push(CreateEvent); // Redirects to /schedule
  };
  

  const initialEvents = [ 
    { name: "Nelsa Web Development", startDate: "2023-05-01", endDate: "2023-05-25", progress: 100 },
    { name: "Datascale AI App", startDate: "2023-06-01", endDate: "2023-06-20", progress: 35 },
    { name: "Media Channel Branding", startDate: "2023-07-01", endDate: "2023-07-13", progress: 65 },
    { name: "Corlax iOS App Development", startDate: "2023-12-01", endDate: "2023-12-20", progress: 100 },
    { name: "Website Builder Development", startDate: "2024-03-01", endDate: "2024-03-15", progress: 50 },
  ];

  const statusColors = {
    Completed: "bg-green-200 text-green-800",
    "Not Yet": "bg-blue-200 text-blue-800",
    Ongoing: "bg-orange-200 text-orange-800",
  };

  const [events, setEvents] = useState(initialEvents);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", startDate: "", endDate: "", progress: 0 });

  const today = new Date();

  const getStatus = (event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    if (today < start) return "Not Yet";
    if (today > end) return "Completed";
    return "Ongoing";
  };

  const filteredEvents = events
    .map(event => ({ ...event, status: getStatus(event) }))
    .filter(event => selectedStatus === "All" || event.status === selectedStatus);

  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.startDate || !newEvent.endDate) {
      alert("Please fill in all fields!");
      return;
    }
    setEvents([...events, newEvent]);
    setIsAdding(false);
    setNewEvent({ name: "", startDate: "", endDate: "", progress: 0 });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6">Events Summary</h2>
        <div className="mb-4">
          <select className="p-3 border rounded-lg w-52" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Not Yet">Not Yet</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </div>
        <div className="flex gap-6">
          <div className="w-3/4">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <table className="w-full border-collapse text-lg">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-4">Name</th>
                    <th className="p-4">Start Date</th>
                    <th className="p-4">End Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, index) => (
                    <tr key={index} className="border-b cursor-pointer" onClick={() => handleRowClick(event.name)}>
                      <td className="p-4">{event.name}</td>
                      <td className="p-4">{event.startDate}</td>
                      <td className="p-4">{event.endDate}</td>
                      <td className={`p-3 rounded-lg text-lg ${statusColors[event.status]}`}>{event.status}</td>
                      <td className="p-4">{event.progress}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isAdding && (
              <div className="relative mt-10 bg-gray-100 p-6 rounded-lg shadow-md">
                <Button onClick={() => setIsAdding(false)} className="w-full my-5 py-2 text-white font-semibold" style={{ backgroundColor: "#F3F4F6" }}>
                  <FaTimes className="text-black" />
                </Button>
                <h3 className="text-2xl font-semibold mb-4">Add New Event</h3>
                <input type="text" placeholder="Event Name" className="w-full p-3 border rounded-lg mb-4" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} />
                <input type="date" className="w-full p-3 border rounded-lg mb-4" value={newEvent.startDate} onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })} />
                <input type="date" className="w-full p-3 border rounded-lg mb-4" value={newEvent.endDate} onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })} />
                <input type="number" placeholder="Progress (%)" className="w-full p-3 border rounded-lg mb-4" value={newEvent.progress} onChange={(e) => setNewEvent({ ...newEvent, progress: Number(e.target.value) })} />
                <div className="flex justify-end">
                  <Button onClick={handleAddEvent} className='w-full my-5 py-2 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg' style={{ backgroundColor: '#1B7F67' }}>Save Event</Button>
                </div>
              </div>
            )}
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md text-lg">Add New Event</Button>
            )}
          </div>
          <div className="w-1/4 ml-12 flex flex-col items-center justify-start">
            <div className="w-full flex justify-center">
              <DonutChart className="w-64 h-64" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}