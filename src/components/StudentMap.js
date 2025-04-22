// src/components/StudentMap.js
import React from "react";
import LeafletMapComponent from "./LeafletMapComponent";

const StudentMap = () => {
  return (
    <div>

      <h2 style={{ color: "white" }}>🧑‍🎓 Student Bus Tracker</h2>

      <LeafletMapComponent />
      

    </div>
    
  );
};

export default StudentMap;
