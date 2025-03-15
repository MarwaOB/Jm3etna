"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import scheduleIcon from "../../icons/schedule.svg";
import contributeIcon from "../../icons/contribute.svg";
import forumIcon from "../../icons/forum.svg";
import notificationsIcon from "../../icons/notification.svg";
import arrowIcon from "../../icons/arrow.svg";
import arrowRightIcon from "../../icons/VectorRight.svg";
import profilIcon from "../../icons/profil.svg";

const menuItems = [
  { name: "Schedule", icon: scheduleIcon, path: "/SchedulePage" },
  { name: "Contribute", icon: contributeIcon, path: "/ContributePage" },
  { name: "Forum", icon: forumIcon, path: "/forum" },
  { name: "Notifications", icon: notificationsIcon, path: "/notifications" },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selected, setSelected] = useState("");
  const [windowWidth, setWindowWidth] = useState(0);
  const [username, setUsername] = useState("Rainny");

  const router = useRouter();

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const sidebarWidth = isOpen ? "200px" : "80px";
  const iconSize = isMobile ? 25 : 20;

  return (
    <div
      style={{
        width: sidebarWidth,
        fontFamily: "Lato, sans-serif",
        fontSize: "15px",
      }}
      className="h-screen bg-[rgba(30,141,115,0.9)] text-white transition-all duration-300 relative"
    >
      {/* Toggle Button */}
      <button
        className="absolute top-4 -right-3 bg-white p-2 rounded-full shadow-md z-10"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Image
          src={!isOpen ? arrowRightIcon : arrowIcon}
          width={10}
          height={10}
          alt="Toggle menu"
        />
      </button>

      <div className="p-4 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Image src={contributeIcon} width={30} height={30} alt="Logo" />
          </div>
          {!isMobile && isOpen && <h1 className="text-xl font-bold">LOGO</h1>}
        </div>

        {/* Menu Items */}
        <nav className="mt-6 flex-1 flex flex-col gap-1">
          {menuItems.map((item) => {
            const isSelected = selected === item.name;

            return (
              <button
                key={item.name}
                className={`flex items-center p-1 w-full rounded-full transition-all duration-200 group
                ${isMobile ? "justify-start gap-0" : isOpen ? "justify-start gap-3" : "justify-start"}
                ${
                  isSelected
                    ? "bg-white text-[rgb(255,199,40)]"
                    : "bg-transparent text-white hover:bg-[rgba(30,141,115,1)]"
                }`}
                onClick={() => {
                  setSelected(item.name);
                  router.push(item.path);
                }}
              >
                <div className="flex items-center justify-center w-10 h-10">
                  <Image
                    src={item.icon}
                    width={iconSize}
                    height={iconSize}
                    alt={item.name}
                    className="w-auto h-auto max-w-[40px] max-h-[40px]"
                  />
                </div>
                {isOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="mt-auto py-4 flex items-center space-x-3">
          <Image
            src={profilIcon}
            width={30}
            height={30}
            alt="Profile"
            className="rounded-full"
          />
          {!isMobile && isOpen && <span>{username}</span>}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
