"use client";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
  const [sourceType, setSourceType] = useState("manual"); // "manual" or "current"
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState(null);
  const [sourceCoords, setSourceCoords] = useState(center);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [selectedAction, setSelectedAction] = useState(""); // "search" or "find_nearest"

  // Convert address to coordinates
  const getCoordinates = async (place) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${place}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [position.coords.latitude, position.coords.longitude];
          setSourceCoords(userCoords);
          setSource("Your Current Location"); // Auto-fill input
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

    if (action === "find_nearest") {
      if (!source) {
        alert("You have to enter your location!");
        return;
      }

      // Logic to find the nearest restaurant (assuming it exists)
      alert("Finding the nearest Mat3am...");
    } else if (action === "search") {
      handleSearch();
    }
  };

  // Handle source type selection
  const handleSourceTypeChange = (event) => {
    const type = event.target.value;
    setSourceType(type);

    if (type === "current") {
      getCurrentLocation();
    } else {
      setSource(""); // Clear field when switching back to manual
    }
  };

  // Handle search function (FIXED)
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
          const coordinates = data.routes[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]);
          setRoute(coordinates);
        } else {
          alert("No route found.");
        }
      })
      .catch((error) => console.error("Error fetching route:", error));
  };

  // Handle button click based on selected action
  const handleButtonClick = () => {
    if (selectedAction === "find_nearest") {
      if (!sourceCoords || source === "") {
        alert("You have to enter your location.");
        return;
      }
      console.log("Finding the nearest Mat3am...");
      // Call your logic to find the nearest restaurant here
    } else if (selectedAction === "search") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-start gap-8 mb-8">
        <div className="flex flex-row items-center justify-between gap-4 px-12">
          {/* Dropdown to switch source type */}


          <select
            value={sourceType}
            onChange={handleSourceTypeChange}
            className="p-2 border border-[var(--my-green)] rounded-3xl focus:border-[var(--my-green)] focus:outline-none"
          >
            <option value="manual">Type your position</option>
            <option value="current">Use my current position</option>
          </select>

          {/* Source input */}
          <input
            type="text"
            placeholder="Enter source location"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={sourceType === "current"}
            className="w-80 min-w-[300px] px-8 py-2 font-[var(--my-lato)] rounded-3xl border-2 border-[var(--my-green)] cursor-pointer focus:border-[var(--my-yellow)] focus:text-[var(--my-green)] focus:outline-none transition-colors duration-200"
          />

          {/* Destination input */}
          <input
            type="text"
            placeholder="Enter destination location"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-80 min-w-[300px] px-8 py-2 font-[var(--my-lato)] rounded-3xl border-2 border-[var(--my-green)] cursor-pointer focus:border-[var(--my-yellow)] focus:text-[var(--my-green)] focus:outline-none transition-colors duration-200"
          />
        </div>

        {/* Unified Button with Dropdown */}
        <div className="relative">
          {/* Dropdown Button */}
          <select
            value={selectedAction}
            onChange={handleActionChange}
            className="p-2 border border-[var(--my-green)] rounded-3xl focus:border-[var(--my-green)] focus:outline-none"
          >
            <option value="">Choose: </option>
            <option value="search">Search</option>
            <option value="find_nearest">Find Nearest Mat3am</option>
          </select>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer center={center} zoom={13} className="h-[500px] w-[80%] border-2 border-[var(--my-yellow)] p-4 mx-auto rounded-lg">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ChangeView coords={sourceCoords} />
        {sourceCoords && <Marker position={sourceCoords} />}
        {destinationCoords && <Marker position={destinationCoords} />}
        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default Maps;
