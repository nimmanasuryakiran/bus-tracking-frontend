import React, { useEffect, useState, useRef } from "react";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getBusLocation } from "../services/busLocationService";
import "leaflet/dist/leaflet.css";
import "./LeafletMapComponent.css";

const WS_URL = "wss://bus-tracking-backend-c5ao.onrender.com/live-location";

// Fix Leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Component to smoothly move map to new location
const FlyToLocation = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      map.flyTo([location.latitude, location.longitude], 15);
    }
  }, [location, map]);
  return null;
};

const LeafletMapComponent = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const markerRef = useRef(null);

  // Fetch initial location from REST
  const fetchInitialLocation = async () => {
    try {
      const loc = await getBusLocation("BUS-101");
      if (loc?.latitude && loc?.longitude) {
        setLocation({
          latitude: parseFloat(loc.latitude),
          longitude: parseFloat(loc.longitude),
        });
      }
    } catch (err) {
      console.error("Polling error:", err);
      setError("Failed to fetch initial location.");
    }
  };

  useEffect(() => {
    fetchInitialLocation();

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.busNumber === "BUS-101") {
          const newLocation = {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
          };
          if (markerRef.current) {
            markerRef.current.setLatLng([newLocation.latitude, newLocation.longitude]);
          }
          setLocation(newLocation); // ✅ updates marker + flyTo
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => console.warn("WebSocket closed");

    return () => socket.close();
  }, []);

  if (error) return <p>❌ {error}</p>;
  if (!location) return <p>📍 Loading map...</p>;

  return (
    <div className="bus-map-container">
      <h3 className="bus-map-title">📍 Bus Location (BUS-101)</h3>
      <div className="bus-coordinates">
        <p>Latitude: {location.latitude.toFixed(5)}</p>
        <p>Longitude: {location.longitude.toFixed(5)}</p>
      </div>
      <div className="map-wrapper">
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={15}
          scrollWheelZoom={true}
          className="leaflet-container"
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <FlyToLocation location={location} />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>Bus is here!</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LeafletMapComponent;
