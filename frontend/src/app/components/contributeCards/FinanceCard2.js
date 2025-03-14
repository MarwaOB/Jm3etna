"use client"; // Make component interactive

import { Playfair_Display, Lato } from "next/font/google";

// Import Google Fonts
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const lato = Lato({ subsets: ["latin"], weight: ["400"] });

const FinanceCard2 = ({ info }) => {
  return (
    <div
      className={`w-auto h-auto min-h-[150px] max-h-[200px] min-w-[250px] max-w-[350px] bg-white border border-[rgb(30,141,115)]  rounded-lg p-5 flex flex-col justify-between gap-3  ${lato.className}`}
    >
      {/* Date */}
      <div className="text-gray-600 text-[12px] flex justify-between w-full">
        <span>{info.date}</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-2 flex-grow overflow-hidden">
        {/* Title */}
        <h2 className={`text-[15px] text-black font-semibold text-left truncate ${playfair.className}`}>
          {info.title}
        </h2>

        {/* Organization */}
        <p className="text-black text-[12px] text-left truncate">
          Organisation: {info.organization}
        </p>
      </div>

      {/* Footer (Amount & Contribute Button) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
        {/* Amount */}
        <div className="flex items-center bg-[rgb(255,199,40)] text-white font-semibold px-2 py-1 rounded-full text-[12px]">
          {info.amount}
        </div>

        {/* Contribute Button */}
        <button
          className="bg-[rgba(30,141,115,0.9)] text-white text-[12px] font-semibold px-2 py-1 rounded-full  hover:bg-green-500 transition"
          onClick={info.onContribute}
        >
          Contribute
        </button>
      </div>
    </div>
  );
};

export default FinanceCard2;
