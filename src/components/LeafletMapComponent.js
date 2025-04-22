// src/components/LeafletMapComponent.js
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getBusLocation } from "../services/busLocationService";
import "leaflet/dist/leaflet.css";
import './LeafletMapComponent.css';

const WS_URL = "wss://bus-tracking-backend-c5ao.onrender.com/live-location";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LeafletMapComponent = () => {
  const [location, setLocation] = useState({
    latitude: 17.385,
    longitude: 78.4867,
  });
  const [error, setError] = useState("");

  const markerRef = useRef(null);
  const mapRef = useRef(null);

  const fetchLocation = async () => {
    try {
      const loc = await getBusLocation("BUS-101");
      if (loc?.latitude && loc?.longitude) {
        const parsed = {
          latitude: parseFloat(loc.latitude),
          longitude: parseFloat(loc.longitude),
        };
        setLocation(parsed);
      }
    } catch (err) {
      console.error("🌐 Polling error:", err);
      setError("Failed to fetch location from server.");
    }
  };

  useEffect(() => {
    fetchLocation();

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
          setLocation(newLocation);

          // Move marker and fly map
          if (markerRef.current) {
            markerRef.current.setLatLng([newLocation.latitude, newLocation.longitude]);
          }
          if (mapRef.current) {
            mapRef.current.flyTo([newLocation.latitude, newLocation.longitude], 15);
          }
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    socket.onerror = (error) => console.error("WS error:", error);
    socket.onclose = () => console.warn("WS closed");

    return () => socket.close();
  }, []);

  if (error) return <p>❌ {error}</p>;
  if (isNaN(location.latitude) || isNaN(location.longitude)) return <p>📍 Loading map...</p>;

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
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker
            position={[location.latitude, location.longitude]}
            ref={markerRef}
          >
            <Popup>Bus is here!</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LeafletMapComponent;
