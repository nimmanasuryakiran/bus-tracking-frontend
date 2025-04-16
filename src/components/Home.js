import React from "react";
import DriverLogin from "./DriverLogin";
import StudentLogin from "./StudentLogin";
import './Home.css'; // make sure styles match below

const Home = () => {
    return (
        <div className="home-wrapper">
            <h1 className="home-title">College Bus Tracking System</h1>
            <div className="login-cards-container">
                <div className="login-card-wrapper">
                    <DriverLogin />
                </div>
                <div className="login-card-wrapper">
                    <StudentLogin />
                </div>
            </div>
        </div>
    );
};

export default Home;
