// src/components/TestAPIFetch.js
import React, { useEffect, useState } from "react";
import { getBusLocation } from "../services/busLocationService";

const TestAPIFetch = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const loc = await getBusLocation("BUS-101");
                console.log("Fetched from server:", loc);
                setLocation(loc);
            } catch (err) {
                console.error("❌ API error:", err);
                setError("Failed to fetch location from server.");
            }
        };

        fetchLocation();
    }, []);

    return (
        <div>
            <h2>API Test</h2>
            {error && <p>{error}</p>}
            {location && (
                <div>
                    <p>✅ Bus Number: {location.busNumber}</p>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            )}
        </div>
    );
};

export default TestAPIFetch;
