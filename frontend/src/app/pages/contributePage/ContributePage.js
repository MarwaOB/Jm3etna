"use client";

import SideBar from "../../components/SideBar/SideBar";
import FinanceCard2 from "../../components/contributeCards/FinanceCard2";
import FoodCard3 from "../../components/contributeCards/FoodCard3";
import OrgCard1 from "../../components/contributeCards/OrgCard1";
import { useState } from "react";
import searchIcon from "../../icons/search.svg";
import notificationsIcon from "../../icons/notification.svg";

// Sample Data (replace with API data)
const foodItems = [
  { id: 1, type: "material", title: "Water Bottles", date: "20/03/2025", organization: "La cité restaurant", location: "Bir Khadem", food: 20 + " UA" },
  { id: 2, type: "material", title: "Rice Bags", date: "21/03/2025", organization: "Food Bank", location: "Bab Ezzouar", food: 50 + " KG" },
  { id: 3, type: "material", title: "Canned Food", date: "22/03/2025", organization: "Charity Group", location: "Algiers ", food: 100 + " UA" },
  { id: 4, type: "material", title: "Pomme de terre", date: "23/03/2025", time: "14:00 - 18:00", organization: "La cité restaurant", location: "Bir Khadem", food: 15 + " UA" },
  { id: 5, type: "material", title: "Cooking Oil", date: "24/03/2025", organization: "Community Kitchen", location: "El Harrach", food: 30 + " L" },
  { id: 6, type: "material", title: "Flour Bags", date: "25/03/2025", organization: "Relief Organization", location: "Kouba", food: 40 + " KG" },
  { id: 7, type: "human", title: "Serving & Distributing Food", date: "20/03/2025", time: "16:00 - 20:00", organization: "La cité restaurant", location: "Bir Khadem", participants: 20 },
  { id: 8, type: "human", title: "Cooking Assistance", date: "21/03/2025", time: "10:00 - 14:00", organization: "Community Kitchen", location: "El Harrach", participants: 10 },
  { id: 9, type: "human", title: "Cleaning Spaces", date: "22/03/2025", organization: "La cité restaurant", location: "Bir Khadem", participants: 15 },
  { id: 10, type: "human", title: "Packing Food Boxes", date: "23/03/2025", time: "12:00 - 16:00", organization: "Food Bank", location: "Bab Ezzouar", participants: 25 },
  { id: 11, type: "human", title: "Transporting Supplies", date: "24/03/2025", time: "08:00 - 12:00", organization: "Charity Group", location: "Setif", participants: 12 },
  { id: 12, type: "human", title: "Supervising Donations", date: "25/03/2025", time: "15:00 - 19:00", organization: "Relief Organization", location: "Kouba", participants: 18 },
  { id: 13, type: "financial", title: "Financial Aid", date: "20/03/2025", organization: "La cité restaurant", amount: 20000 + " DA" },
  { id: 14, type: "financial", title: "Medical Aid Fund", date: "21/03/2025", organization: "Health Support", amount: 50000 + " DA" },
  { id: 15, type: "financial", title: "School Supplies Fund", date: "22/03/2025", organization: "Education Initiative", amount: 30000 + " DA" },
  { id: 16, type: "financial", title: "Orphanage Support", date: "23/03/2025", organization: "Children's Care", amount: 45000 + " DA" },
  { id: 17, type: "financial", title: "Elderly Care Support", date: "24/03/2025", organization: "Senior Assistance", amount: 25000 + " DA" },
  { id: 18, type: "financial", title: "Community Renovation Fund", date: "25/03/2025", organization: "Urban Development", amount: 60000 + " DA" },
];

const ContributePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("human");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const filteredItems = foodItems.filter(item => selectedCategory === "all" || item.type === selectedCategory);
  const renderCard = (item) => {
    switch (item.type) {
      case "material": return <FoodCard3 key={item.id} info={item} />;
      case "human": return <OrgCard1 key={item.id} info={item} />;
      case "financial": return <FinanceCard2 key={item.id} info={item} />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-playfair">
      <div className="fixed top-0 left-0 h-full w-64 bg-white">
        <SideBar />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 ml-64">
        <div className="w-full max-w-screen-lg flex flex-col items-center">
          <div className="text-left mb-4 w-full">
            <h1 className="text-xl md:text-2xl font-semibold text-black">
              Make an Impact in Your Community!
            </h1>
            <p className="text-black text-sm md:text-base">
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
    <img src={searchIcon} alt="Search Icon" className="w-[50px] h-[50px]" />
  </span>
</div>


        {/* Category Tabs */}
<div className="text-xs md:text-sm flex justify-start w-full">
  {[
    { type: "human", label: "Organizational Assistance" },
    { type: "financial", label: "Financial Support" },
    { type: "material", label: "Materials & Food Support" }
  ].map(tab => (
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
    </div>
  );
};

export default ContributePage;
