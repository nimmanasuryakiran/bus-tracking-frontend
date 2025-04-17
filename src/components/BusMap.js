import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 17.385044, // Default location (Hyderabad)
  lng: 78.486671,
};

const BusMap = () => {
  const [busLocations, setBusLocations] = useState([]);

  // Fetch bus locations from backend
  const fetchBusLocations = async () => {
    try {
      const response = await fetch("https://bus-tracking-backend-c5ao.onrender.com/api/bus-location");
      const data = await response.json();
      setBusLocations(data);
    } catch (error) {
      console.error("Error fetching bus locations:", error);
    }
  };

  // Fetch locations every 5 seconds
  useEffect(() => {
    fetchBusLocations();
    const interval = setInterval(fetchBusLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={12}>
        {busLocations.map((bus) => (
          <Marker
            key={bus.id}
            position={{ lat: bus.latitude, lng: bus.longitude }}
            title={`Bus ${bus.id}`}
            icon="https://maps.google.com/mapfiles/ms/icons/bus.png"
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default BusMap;
