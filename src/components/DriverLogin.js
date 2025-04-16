import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import for redirection
import axios from "axios";
import './DriverLogin.css';

const DriverLogin = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // ✅ Hook for navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("https://bus-tracking-backend-c5ao.onrender.com/auth/login", {

                username: phone,
                password: password,
                role: "DRIVER",
            });

            const token = response.data; // ✅ JWT Token received

            // ✅ Store the token in localStorage
            localStorage.setItem("driverToken", token);

            console.log("✅ Login successful. Token stored.");
            
            // ✅ Redirect to driver tracking page
            navigate("/driver-tracker");

        } catch (err) {
            console.error("🚨 Login failed:", err.response?.data || err.message);
            setError("Invalid phone number or password. Try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Driver Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                    <button type="submit" className="login-button">Login</button>
                    {error && <p className="login-error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default DriverLogin;



