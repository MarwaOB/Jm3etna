"use client";

import SideBar from "../components/SideBar/SideBar";
import FinanceCard2 from "../components/contributeCards/FinanceCard2";
import FoodCard3 from "../components/contributeCards/FoodCard3";
import OrgCard1 from "../components/contributeCards/OrgCard1";
import { useState } from "react";
import searchIcon from "../icons/search.svg";
import notificationsIcon from "../icons/notification.svg";
import PastCard from "@/app/components/ScheduleCards/PastCard";
// Import UpcomingCard if it exists
import UpcomingCard from "@/app/components/ScheduleCards/UpcomingCard";

// Sample Data (replace with API data)
const pastItems = [
  { id: 9, type: "food", title: "Aid", date: "22/03/2025", organization: "La cité restaurant", location: "Bir Khadem", food: "20000DA" },
  { id: 10, type: "food", title: "Donation", date: "23/03/2025", organization: "Food Bank", location: "Bab Ezzouar", food: "20000DA"  },
  { id: 11, type: "human", title: "Transporting Supplies", date: "24/03/2025", organization: "Charity Group", location: "Setif", participants: 12 },
  { id: 12, type: "human", title: "Supervising Donations", date: "25/03/2025", organization: "Relief Organization", location: "Kouba", participants: 18 },
  { id: 13, type: "human", title: "Transporting Supplies", date: "24/03/2025", organization: "Charity Group", location: "Setif", participants: 12 },
  { id: 14, type: "human", title: "Supervising Donations", date: "25/03/2025", organization: "Relief Organization", location: "Kouba", participants: 18 },
];

const upcomingItems = [
    { id: 1, type: "human", title: "Serving & Distributing Food", date: "20/03/2025", time: "16:00 - 20:00", organization: "La cité restaurant", location: "Bir Khadem" },
    { id: 2, type: "human", title: "Serving & Distributing Food", date: "20/03/2025", time: "16:00 - 20:00", organization: "La cité restaurant", location: "Bir Khadem" },
    { id: 4, type: "human", title: "Serving & Distributing Food", date: "20/03/2025", time: "16:00 - 20:00", organization: "La cité restaurant", location: "Bir Khadem" },
    { id: 5, type: "human", title: "Serving & Distributing Food", date: "20/03/2025", time: "16:00 - 20:00", organization: "La cité restaurant", location: "Bir Khadem" },
    { id: 6, type: "human", title: "Serving & Distributing Food", date: "20/03/2025", time: "16:00 - 20:00", organization: "La cité restaurant", location: "Bir Khadem" },
    { id: 3, type: "human", title: "Serving & Distributing Food", date: "20/03/2025", time: "16:00 - 20:00", organization: "La cité restaurant", location: "Bir Khadem" },
];

const SchedulePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("upcoming");

  // Corrected filtering logic
  const filteredItems = selectedCategory === "past" ? pastItems : upcomingItems;

  const renderCard = (item) => {
    switch (selectedCategory) {
      case "past":
        return <PastCard key={item.id} info={item} />;
      case "upcoming":
        return <UpcomingCard key={item.id} info={item} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center ml-4 md:ml-8 lg:ml-15 xl:ml-20 p-4 md:p-6 bg-white font-playfair">
      <div className="w-full max-w-screen-lg flex flex-col items-center">
        <div className="text-left mb-4 w-full">
          <h1 className="text-[15px] md:text-2xl font-semibold text-black">
            Make an Impact in Your Community!
          </h1>
          <p className="text-[15px] text-sm md:text-base">
            Whether it's cooking meals, serving food, donating supplies, or coordinating efforts, there's a way for everyone to help.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center h-auto w-full max-w-lg mb-4">
          <input
            type="text"
            placeholder="Search a name, field..."
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[var(--my-green)] shadow-sm"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
           
          </span>
        </div>

        {/* Category Tabs */}
        <div className="text-xs md:text-sm flex justify-start w-full">
          {[
            { type: "upcoming", label: "Upcoming Contribution" },
            { type: "past", label: "Past Contribution" },
          ].map((tab) => (
            <button
              key={tab.type}
              className={`px-3 py-2 md:px-4 text-xs md:text-sm border border-gray-300 flex align-left rounded-t-lg transition-all duration-200 ${
                selectedCategory === tab.type
                  ? "bg-white text-[var(--my-green)] font-lato border-b-white md:scale-105 font-bold"
                  : "bg-white text-black"
              }`}
              onClick={() => setSelectedCategory(tab.type)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards Container */}
        <div className="w-full flex justify-center mt-0 border border-gray-300 rounded-br-lg rounded-bl-lg rounded-tr-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(renderCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;