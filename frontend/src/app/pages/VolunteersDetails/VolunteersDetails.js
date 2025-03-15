"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import Next.js router
import { Button } from "@/components/ui/button";
import { FaEye, FaEnvelope } from "react-icons/fa";
import SideBar1 from "../../components/SideBar1";
import Forum from "../Forum";
import Profil from "../Profil";






const volunteersData = [
  { name: "Ahmed", email: "ahmed@email.com", skills: "Cooking" },
  { name: "Sara", email: "sara@email.com", skills: "Cooking" },
  { name: "Khaled", email: "khaled@email.com", skills: "Cooking" },
  { name: "Hassan", email: "hassan@email.com", skills: "Teaching" },
  { name: "Fatima", email: "fatima@email.com", skills: "Nursing" },
  { name: "Omar", email: "omar@email.com", skills: "Engineering" },
  { name: "Nour", email: "nour@email.com", skills: "Marketing" },
  { name: "Youssef", email: "youssef@email.com", skills: "Photography" },
];

export default function VolunteerList() {
  const [visibleCount, setVisibleCount] = useState(6); // Show 6 initially
  const router = useRouter(); // ✅ Next.js router

  // Function to load more volunteers
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Load 3 more each time
  };

  return (
    <div className="p-0 bg-white min-h-screen flex flex-row">
      

      <div className="p-6 bg-white min-h-screen flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-12">List of Volunteers</h2>

        {/* Grid Layout with wider gaps matching the CSS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-20 w-full max-w-6xl mx-auto">
          {volunteersData.slice(0, visibleCount).map((volunteer, index) => (
            <div
              key={index}
              className="p-6 rounded-xl shadow-lg flex flex-col items-center w-[280px] h-[220px] bg-[rgba(30,141,115,0.2)] mb-16"
            >
              <p className="font-bold text-2xl">{volunteer.name}</p>
              <p className="text-gray-700 text-lg">{volunteer.email}</p>
              <p className="text-gray-500 text-lg">{volunteer.skills}</p>

              {/* Buttons with routing */}
              <div className="flex justify-center items-center gap-5 mt-auto">
                <Button
                  onClick={() => router.push("Forum")} // ✅ Navigate to message page
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-lg flex items-center gap-2"
                >
                  <FaEnvelope />
                </Button>
                <Button
                  onClick={() => router.push("../Forum.js")} // ✅ Navigate to view page
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-lg flex items-center gap-2"
                >
                  <FaEye />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < volunteersData.length && (
          <div className="w-full max-w-6xl flex justify-center">
            <Button
              onClick={loadMore}
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-1 flex items-center justify-center max-w-[150px]"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
