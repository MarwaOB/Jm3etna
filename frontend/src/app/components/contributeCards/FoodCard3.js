"use client"; 

import { Playfair_Display, Lato } from "next/font/google";
import Image from "next/image";
import localisationIcon from "../../icons/localisation.svg";

// Importation des polices Google
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const lato = Lato({ subsets: ["latin"], weight: ["400"] });

const FoodCard3 = ({ info }) => {
  return (
    <div
      className={`w-auto h-auto min-h-[150px] max-h-[200px] min-w-[150px] max-w-[350px] bg-white border border-[rgb(30,141,115)]  rounded-lg p-5 flex flex-col justify-between gap-3 overflow-hidden ${lato.className}`}
    >
      {/* Date */}
      <div className="text-gray-600 text-[12px] flex justify-between w-full">
        <span>{info.date}</span>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col gap-2 flex-grow overflow-hidden">
        {/* Titre */}
        <h2 className={`text-[15px] text-black font-semibold text-left truncate ${playfair.className}`}>
          {info.title}
        </h2>

        {/* Organisation */}
        <p className="text-black text-sm text-left truncate">
          Organisation : {info.organization}
        </p>
      </div>

      {/* Food, Location, and Contribute Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
        <div className="flex flex-wrap items-center justify-between gap-1">
          {/* Food Amount */}
          <div className="flex items-center bg-[rgb(255,199,40)] text-white font-semibold px-2 py-1 rounded-full text-[12px]">
            {info.food}
          </div>

          {/* Location */}
          <div className="flex items-center bg-[rgb(255,199,40)] text-white font-semibold px-2 py-1 rounded-full text-[12px] gap-2">
            {info.location}
            <Image src={localisationIcon} width={15} height={15} alt="Location" className="mr-1" />
          </div>
        </div>

        {/* Bouton "Contribute" */}
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

export default FoodCard3;
