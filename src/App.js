import React from "react";
import StudentMap from "./components/StudentMap";
import AdminDashboard from './components/AdminDashboard';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DriverLogin from "./components/DriverLogin";
import DriverTracker from "./components/DriverTracker";
import LeafletMapComponent from "./components/LeafletMapComponent";
import 'leaflet/dist/leaflet.css';
import "./styles.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DriverLogin />} />
                <Route path="/driver-login" element={<DriverLogin />} />
                <Route path="/driver-tracker" element={
                    <>
                        <DriverTracker busId={"BUS-101"} />
                        <LeafletMapComponent busNumber={"BUS-101"} />
                    </>
                } />
                <Route path="/student-map" element={<StudentMap />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />

            </Routes>

        </Router>
        
    );
}

export default App;


