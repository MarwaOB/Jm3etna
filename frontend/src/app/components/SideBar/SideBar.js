"use client";
import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import Image from "next/image";
import scheduleIcon from "../../icons/schedule.svg";
import contributeIcon from "../../icons/contribute.svg";
import forumIcon from "../../icons/forum.svg";
import notificationsIcon from "../../icons/notification.svg";
import arrowIcon from "../../icons/arrow.svg";
import arrowRightIcon from "../../icons/VectorRight.svg";
import profilIcon from "../../icons/profil.svg";
import SchedulePage from "../../pages/SchedulePage"
import ContributePage from "../../pages/ContributePage"

const menuItems = [
  { name: "Schedule", icon: scheduleIcon, path: "/schedule", component: SchedulePage },
  { name: "Contribute", icon: contributeIcon, path: "/contribute", component: ContributePage },
  { name: "Forum", icon: forumIcon, path: "/forum" },
  { name: "Notifications", icon: notificationsIcon, path: "/notifications" },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selected, setSelected] = useState("Schedule"); // Set a default selected item
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState("Rainny");

  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);
  
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Responsive behavior: collapse to icons-only on small screens
  const isMobile = windowWidth < 768;
  const sidebarWidth = isOpen ? "200px" : "80px";
  const iconSize = isMobile ? 25 : 20;

  // Create the sidebar content without routing
  const sidebarContent = (
    <div
      style={{
        width: sidebarWidth,
        fontFamily: "Lato, sans-serif",
        fontSize: "15px",
      }}
      className={`h-screen bg-[rgba(30,141,115,0.9)] text-white transition-all duration-300 relative`}
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
            <Image src={contributeIcon} width={30} height={30} alt="Logo" className="invert" />
          </div>
          {!isMobile && isOpen && <h1 className="text-xl font-bold">LOGO</h1>}
        </div>

        {/* Menu Items - we'll conditionally wrap these in Link components when mounted */}
        <nav className="mt-6 flex-1 flex flex-col gap-1">
          {menuItems.map((item) => {
            const isSelected = selected === item.name;
            
            // Create the content that will go inside the Link or button
            const itemContent = (
              <>
                <div className="flex items-center justify-center w-10 h-10">
                  <Image
                    src={item.icon}
                    width={iconSize}
                    height={iconSize}
                    alt={item.name}
                    style={{
                      filter: isSelected 
                        ? "brightness(0) saturate(100%) invert(77%) sepia(54%) saturate(861%) hue-rotate(334deg) brightness(101%) contrast(101%)" // Yellow
                        : "brightness(0) invert(1)", // White
                      transition: "all 0.2s ease",
                    }}
                    className="w-auto h-auto max-w-[40px] max-h-[40px]"
                  />
                </div>
                {isOpen && <span>{item.name}</span>}
              </>
            );
            
            // If not mounted yet, use a button instead of Link (won't cause SSR issues)
            if (!isMounted) {
              return (
                <button
                  key={item.name}
                  className={`flex items-center p-1 w-full rounded-full transition-all duration-200 group
                    ${isMobile ? "justify-start gap-0" : isOpen ? "justify-start gap-3" : "justify-start"}
                    ${isSelected ? "bg-[rgb(255,255,255)] text-[rgb(255,199,40)]" 
                    : "bg-transparent text-[rgb(255,255,255)] hover:bg-[rgba(30,141,115,1)] hover:text-white"}`}
                  onClick={() => setSelected(item.name)}
                >
                  {itemContent}
                </button>
              );
            }
            
            // When mounted, use Links for routing
            return (
              <Link 
                to={item.path}
                key={item.name}
                className={`flex items-center p-1 w-full rounded-full transition-all duration-200 group no-underline
                  ${isMobile ? "justify-start gap-0" : isOpen ? "justify-start gap-3" : "justify-start"}
                  ${isSelected ? "bg-[rgb(255,255,255)] text-[rgb(255,199,40)]" 
                  : "bg-transparent text-[rgb(255,255,255)] hover:bg-[rgba(30,141,115,1)] hover:text-white"}`}
                onClick={() => setSelected(item.name)}
              >
                {itemContent}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="mt-auto py-4 flex items-center space-x-3">
          <Image src={profilIcon} width={30} height={30} alt="Profile" className="rounded-full" />
          {!isMobile && isOpen && <span>{username}</span>}
        </div>
      </div>
    </div>
  );

  // If not mounted, show just the sidebar without any routing components
  if (!isMounted) {
    return (
      <div className="flex h-screen">
        {sidebarContent}
        <div className="flex-1 overflow-auto">
          {/* Show a default content or loading state */}
          <div className="p-4">Loading...</div>
        </div>
      </div>
    );
  }

  // When mounted on the client, use HashRouter instead of BrowserRouter
  return (
    <HashRouter>
      <div className="flex h-screen">
        {sidebarContent}
        
        {/* Content Area with Routes */}
        <div className="flex-1 overflow-auto">
          <Routes>
            {/* Redirect root path to /schedule */}
            <Route path="/" element={<Navigate replace to="/schedule" />} />
            
            {/* Generate routes from menuItems */}
            {menuItems.map((item) => {
              // Only create routes for items with components
              if (item.component) {
                return <Route key={item.name} path={item.path} element={<item.component />} />;
              }
              return null;
            })}
            
            {/* Add placeholder components for menu items without components */}
            <Route path="/forum" element={<div className="p-4">Forum Page - Coming Soon</div>} />
            <Route path="/notifications" element={<div className="p-4">Notifications Page - Coming Soon</div>} />
            
            {/* Fallback route - redirect to schedule if path not found */}
            <Route path="*" element={<Navigate replace to="/schedule" />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default SideBar;