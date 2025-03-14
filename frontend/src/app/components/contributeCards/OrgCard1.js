import { Playfair_Display, Lato } from "next/font/google";
import Image from "next/image";
import localisationIcon from "../../icons/localisation.svg";
import personIcon from "../../icons/person.svg";

// Importation des polices Google
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const lato = Lato({ subsets: ["latin"], weight: ["400"] });

const OrgCard1 = ({ info }) => {
  return (
    <div
      className={`w-auto h-auto min-h-auto max-h-[200px] min-w-auto max-w-[300px] bg-white border border-[rgb(30,141,115)]  rounded-lg p-5 flex flex-col justify-between gap-3 overflow-hidden ${lato.className}`}
    >
      {/* Date & Heure */}
      <div className="text-gray-600 text-[12px] flex justify-between w-full">
        <span>{info.date}</span>
        <span className="text-green-600 font-semibold">{info.time}</span>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col gap-2 flex-grow overflow-hidden">
        {/* Titre */}
        <h2 className={`text-[15px] text-black font-semibold text-left truncate ${playfair.className}`}>
          {info.title}
        </h2>

        {/* Organisation */}
        <p className="text-black text-[12px] text-left truncate">
          Organisation : {info.organization}
        </p>
      </div>

      {/* Participants, Lieu et Bouton "Join" */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
        <div className="flex flex-wrap items-center justify-between gap-1">
          {/* Nombre de participants */}
          <div className="flex items-center bg-[rgb(255,199,40)] text-white font-semibold px-2 py-1 rounded-full text-[12px] gap-2">
            {info.participants}
            <Image src={personIcon} width={15} height={15} alt="Participants" className="mr-1" />
          </div>

          {/* Lieu */}
          <div className="flex items-center bg-[rgb(255,199,40)] text-white font-semibold px-2 py-1 rounded-full text-[12px] gap-2">
            {info.location}
            <Image src={localisationIcon} width={15} height={15} alt="Location" className="mr-1" />
          </div>
        </div>

        {/* Bouton "Contribute" */}
        <button 
          className="bg-[rgba(30,141,115,0.9)] text-white justify-center text-[12px] font-semibold px-2 py-1 rounded-full text-[12px] hover:bg-green-500 transition"
          onClick={info.onContribute}
        >
          Contribute
        </button>
      </div>
    </div>
  );
};

export default OrgCard1;
