"use client";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from
"react-leaflet";
import "leaflet/dist/leaflet.css";
import logo from "../icons/logo.png"
import home from "../icons/home.svg"

import Image from "next/image";
import restaurants from "./ExportMaps"
import { FaMapMarkerAlt, FaLocationArrow, FaClock } from "react-icons/fa";




const center = [36.7528, 3.0422]; // Default center (Algiers)

// Component to change map view
const ChangeView = ({ coords }) => {
  const map = useMap();
  if (coords) {
    map.setView(coords, 13);
  }
  return null;
};

const Maps = () => {
  const [sourceType, setSourceType] = useState("manual");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState(null);
  const [sourceCoords, setSourceCoords] = useState(center);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");

  // Convert address to coordinates
  const getCoordinates = async (place) => {
    const url =
`https://nominatim.openstreetmap.org/search?format=json&q=${place}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.length > 0 ? [parseFloat(data[0].lat),
parseFloat(data[0].lon)] : null;
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [position.coords.latitude,
position.coords.longitude];
          setSourceCoords(userCoords);
          setSource("Your Current Location");
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to retrieve location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Handle action selection
  const handleActionChange = async (event) => {
    const action = event.target.value;
    setSelectedAction(action);
    if (action === "find_nearest" && !source) {
      alert("You have to enter your location!");
    } else if (action === "search") {
      handleSearch();
    }
  };

  // Handle source type selection
  const handleSourceTypeChange = (event) => {
    const type = event.target.value;
    setSourceType(type);
    type === "current" ? getCurrentLocation() : setSource("");
  };

  // Handle search function
  const handleSearch = async () => {
    if (!destination) {
      alert("Please enter a destination.");
      return;
    }
    const destCoords = await getCoordinates(destination);
    if (!sourceCoords || !destCoords) {
      alert("Invalid locations, please try again.");
      return;
    }
    setDestinationCoords(destCoords);

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${sourceCoords[1]},${sourceCoords[0]};${destCoords[1]},${destCoords[0]}?geometries=geojson`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.routes.length > 0) {
          setRoute(data.routes[0].geometry.coordinates.map((coord) =>
[coord[1], coord[0]]));
        } else {
          alert("No route found.");
        }
      })
      .catch((error) => console.error("Error fetching route:", error));
  };

  return (
    <div className="bg-white">
      <nav className="bg-[var(--my-green)] text-white py-2 px-12 flex
justify-between items-center shadow-md mb-8">
        <Image
          src={logo}
          alt="Logo"
          width={80}
          height={80}
          className="object-contain"
        />
        <ul className="flex gap-8">
          <Image
            src={home}
            alt="Home"
            width={32}
            height={32}
            className="object-contain"
          />
        </ul>
      </nav>

      <div className="flex flex-row items-center justify-start gap-8 mb-8">
        <div className="flex flex-row items-center justify-between gap-4 px-12">
          {/* Source Type Dropdown */}
          <select
            value={sourceType}
            onChange={handleSourceTypeChange}
            className="p-2 border border-[var(--my-green)] rounded-3xl
focus:border-[var(--my-green)] focus:outline-none"
          >
            <option value="manual">Type your position</option>
            <option value="current">Use my current position</option>
          </select>

          {/* Source Input */}
          <input
            type="text"
            placeholder="Enter source location"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={sourceType === "current"}
            className="w-80 min-w-[300px] px-8 py-2 rounded-3xl
border-2 border-[var(--my-green)] focus:border-[var(--my-yellow)]
focus:text-[var(--my-green)] focus:outline-none transition-colors
duration-200"
          />

          {/* Destination Input */}
          <input
            type="text"
            placeholder="Enter destination location"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-80 min-w-[300px] px-8 py-2 rounded-3xl
border-2 border-[var(--my-green)] focus:border-[var(--my-yellow)]
focus:text-[var(--my-green)] focus:outline-none transition-colors
duration-200"
          />
        </div>

        {/* Action Dropdown */}
        <div className="relative">
          <select
            value={selectedAction}
            onChange={handleActionChange}
            className="text-white p-2 border border-[var(--my-green)]
rounded-3xl focus:border-[var(--my-green)] focus:outline-none
bg-[var(--my-green)]"
          >
            <option value="">Choose: </option>
            <option value="search">Search</option>
            <option value="find_nearest">Find Nearest Mat3am</option>
          </select>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer center={center} zoom={13} className="h-[500px]
w-[80%] border-2 border-[var(--my-yellow)] p-4 mx-auto rounded-lg">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ChangeView coords={sourceCoords} />
        {sourceCoords && <Marker position={sourceCoords} />}
        {destinationCoords && <Marker position={destinationCoords} />}
        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>


      <div className="grid grid-cols-3 gap-8 border-2 rounded-3xl
mx-30 my-10 p-4">
      {restaurants.map((rest, index) => (
  <div key={index} className="p-4 border-2 rounded-3xl flex flex-col
h-full shadow-md">
    {/* Image */}
    <div className="w-full flex justify-center">
      <Image
        src={rest.image}
        alt={rest.name}
        width={120}
        height={120}
        className="object-cover rounded-lg w-full pb-2"
      />
    </div>

    {/* Restaurant Details */}
    <div className="flex flex-col flex-grow mt-3 space-y-2">
      <h3 className="text-black font-[var(--my-lato)] text-lg flex
items-center">
        <FaMapMarkerAlt className="text-[var(--my-green)] inline-block mr-2" />
        {rest.name}
      </h3>

      <p className="text-black font-[var(--my-lato)] text-lg flex items-center">
        <FaLocationArrow className="text-[var(--my-green)] inline-block mr-2" />
        {rest.distance}
      </p>

      <p className="text-black font-[var(--my-lato)] text-lg flex items-center">
        <FaClock className="text-[var(--my-green)] inline-block mr-2" />
        {rest.openHour} <span className="mx-1">-</span> {rest.closeHour}
      </p>
    </div>

    {/* Google Maps Button */}
    <div className="mt-auto pt-3">
      <button
        className="bg-[var(--my-green)] rounded-xl text-white p-2
w-full transition-transform transform hover:scale-105"
        onClick={() =>
window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rest.name)}`,
"_blank")}
      >
        Open in Google Maps
      </button>
    </div>
  </div>
))}

</div>

    </div>
  );
};

export default Maps;