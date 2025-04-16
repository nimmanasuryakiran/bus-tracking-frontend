// src/components/LeafletMapComponent.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getBusLocation } from "../services/busLocationService";
import "leaflet/dist/leaflet.css";
import './LeafletMapComponent.css';

const WS_URL = "wss://bus-tracking-backend-c5ao.onrender.com/live-location";

//const WS_URL = "ws://localhost:8080/live-location"; // ✅ WebSocket URL

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const ChangeMapView = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords?.latitude && coords?.longitude) {
      console.log("🌀 Flying to new coords", coords);
      map.flyTo([coords.latitude, coords.longitude], 15);
    }
  }, [coords, map]); // Ensure `coords` is updated correctly
  return null;
};

const LeafletMapComponent = () => {
  const [location, setLocation] = useState({
    latitude: 17.385,   // temporary default fallback
    longitude: 78.4867,
  });

  const [error, setError] = useState("");

  // Fetch latest location from REST API as fallback
  const fetchLocation = async () => {
    try {
      const loc = await getBusLocation("BUS-101");
      if (loc?.latitude && loc?.longitude) {
        const parsed = {
          latitude: parseFloat(loc.latitude),
          longitude: parseFloat(loc.longitude),
        };
        console.log("📦 Location updated via API", parsed);
        setLocation(parsed);
      }
    } catch (err) {
      console.error("🌐 Polling error:", err);
      setError("Failed to fetch location from server.");
    }
  };

  // 🔌 WebSocket connection to receive live updates
  useEffect(() => {
    fetchLocation(); // Initial fallback fetch

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("✅ Student WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Live location received via WS:", data);
        if (data?.busNumber === "BUS-101") {
          setLocation({
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
          });
        }
      } catch (err) {
        console.error("❌ Error parsing WS message:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("🚨 WS error:", error);
    };

    socket.onclose = () => {
      console.warn("❌ WS closed");
    };

    return () => socket.close();
  }, []); // Run once when the component mounts

  if (error) return <p>❌ {error}</p>;

  if (isNaN(location.latitude) || isNaN(location.longitude)) {
    return <p>📍 Bus Location: Loading map...</p>;
  }

  console.log("📍 Rendering map with location:", location);

  return (
    <div className="bus-map-container">
      <h3 className="bus-map-title">📍 Bus Location (BUS-101)</h3>

      <div className="bus-coordinates">
        <p>Latitude: {location.latitude.toFixed(5)}</p>
        <p>Longitude: {location.longitude.toFixed(5)}</p>
      </div>

      <div className="map-wrapper">
        <MapContainer
          key={`${location.latitude}-${location.longitude}`}
          center={[location.latitude, location.longitude]}
          zoom={15}
          scrollWheelZoom={true}
          className="leaflet-container"
          style={{ height: "400px", width: "100%" }}
        >
          <ChangeMapView coords={location} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>Bus is here!</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LeafletMapComponent;
