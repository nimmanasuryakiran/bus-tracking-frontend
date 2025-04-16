import React, { useEffect, useState } from "react"; 
import { getAllBusLocations, getLatestBusLocation } from "../services/busLocationService";

const BusTracker = () => {
    const [busLocations, setBusLocations] = useState([]);
    const [latestLocation, setLatestLocation] = useState(null);

    useEffect(() => {
        fetchBusLocations();
        fetchLatestLocation();

        // Fetch updated locations every 5 seconds
        const interval = setInterval(() => {
            fetchBusLocations();
            fetchLatestLocation();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchBusLocations = async () => {
        try {
            const response = await getAllBusLocations();
            setBusLocations(response.data || []); // Prevents errors if API fails
        } catch (error) {
            console.error("❌ Error fetching bus locations:", error);
        }
    };

    const fetchLatestLocation = async () => {
        try {
            const response = await getLatestBusLocation();
            setLatestLocation(response.data || null);
        } catch (error) {
            console.error("❌ Error fetching latest bus location:", error);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>🚌 Bus Locations (Live Updates)</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {busLocations.length > 0 ? (
                    busLocations.map((bus) => (
                        <li key={bus.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
                            <strong>🏷 Bus ID:</strong> {bus.id} <br />
                            <strong>📍 Location:</strong> {bus.latitude}, {bus.longitude} <br />
                            <strong>🕒 Time:</strong> {bus.timestamp}
                        </li>
                    ))
                ) : (
                    <p>⏳ No bus location data available...</p>
                )}
            </ul>

            {latestLocation && (
                <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                    <h3>📍 Latest Bus Location (Updated Every 5s):</h3>
                    <p>
                        <strong>🚌 ID:</strong> {latestLocation.id} <br />
                        <strong>📍 Coordinates:</strong> {latestLocation.latitude}, {latestLocation.longitude}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BusTracker;
