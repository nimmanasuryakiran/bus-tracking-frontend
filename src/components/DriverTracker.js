import React, { useEffect, useState } from "react";
import axios from "axios";
import './DriverTracker.css';

//const API_URL = "http://localhost:8080/bus/update-location";

//const WS_URL = "ws://localhost:8080/live-location";
const API_URL = "https://bus-tracking-backend-c5ao.onrender.com/bus/update-location";
const WS_URL = "wss://bus-tracking-backend-c5ao.onrender.com/live-location";



const DriverTracker = ({ busId }) => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("driverToken"); // Fetch JWT token
        if (!token) {
            console.error("🚨 No token found! Redirecting to login...");
            window.location.href = "/driver-login";
            return;
        }
        

        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        busNumber: busId,
                    };
    
    console.log("📤 Sending location with busNumber:", newLocation.busNumber);

                    setLocation(newLocation);

                    // Send location via WebSocket
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify(newLocation));
                    } else {
                        // Fallback to API polling
                        try {
                            await axios.post(API_URL, newLocation, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                            });
                            console.log("✅ Location updated via API");
                            
                        } catch (error) {
                            console.error("🚨 Error updating location:", error);
                        }
                    }
                },
                (error) => console.error("🚨 Error getting location:", error),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            console.error("🚨 Geolocation is not supported.");
        }
    }, [busId, ws]);


    // Initialize WebSocket connection
    useEffect(() => {
        const socket = new WebSocket(WS_URL);
        socket.onopen = () => console.log("✅ WebSocket connected!");
        socket.onerror = (error) => console.error("🚨 WebSocket error:", error);
        setWs(socket);
        return () => socket.close();
    }, []);

    return (
        <div className="driver-tracker-container">
            <h2>Driver's Live Location</h2>
            <p>Latitude: {location.latitude || "Fetching..."}</p>
            <p>Longitude: {location.longitude || "Fetching..."}</p>
        </div>

    );
};

export default DriverTracker;

