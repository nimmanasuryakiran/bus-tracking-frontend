import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './StudentLogin.css'; // You can style similarly to DriverLogin.css

const StudentLogin = () => {
    const [regNumber, setRegNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("https://bus-tracking-backend-c5ao.onrender.com/auth/login", {
                username: regNumber,
                password: password,
                role: "STUDENT",
            });

            const token = response.data;
            localStorage.setItem("studentToken", token);
            console.log("✅ Student login successful");

            navigate("/student-map");
        } catch (err) {
            console.error("🚨 Student login failed:", err.response?.data || err.message);
            setError("Invalid registration number or password.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Student Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Registration Number"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                    {error && <p className="login-error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default StudentLogin;
