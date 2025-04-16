

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import "./styles.css";

import Home from "./components/Home";
import DriverLogin from "./components/DriverLogin";
import StudentLogin from "./components/StudentLogin";
import DriverTracker from "./components/DriverTracker";
import LeafletMapComponent from "./components/LeafletMapComponent";
import StudentMap from "./components/StudentMap";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/driver-login" element={<DriverLogin />} />
                <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/driver-tracker" element={
                    <>
                        <DriverTracker busId={"BUS-101"} />
                        <LeafletMapComponent busNumber={"BUS-101"} />
                    </>
                } />
                <Route path="/student-map" element={<StudentMap />} />
            </Routes>
        </Router>
    );
}

export default App;
