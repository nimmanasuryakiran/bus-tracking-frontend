import axios from "axios";



//const API_URL = "http://localhost:8080/bus/location";

//const UPDATE_LOCATION_URL = "http://localhost:8080/bus/update-location";  

const API_URL = "https://bus-tracking-backend-c5ao.onrender.com/bus/location";
const UPDATE_LOCATION_URL = "https://bus-tracking-backend-c5ao.onrender.com/bus/update-location";




// Student Token (for GET request)
const STUDENT_JWT_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsInN1YiI6IjY3OCIsImlhdCI6MTc0NDU0NjI1NywiZXhwIjoxNzQ1MTUxMDU3fQ.qGJQma-ZFj_xcZN_A5dX_i1NO9KhrITK23PoDpTu9MI";  

// Driver Token (for POST request)
const DRIVER_JWT_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiRFJJVkVSIiwic3ViIjoiNjMwMDY3ODkzMiIsImlhdCI6MTc0NDU0NjMxOSwiZXhwIjoxNzQ1MTUxMTE5fQ.vHdqyWL0ZqY4RcKENHJlRLrVSterLS2rF4P7sr6xeH8";

/**
 * Fetch all bus locations.
 */
export const getBusLocation = async (busNumber) => {
    try {
        const response = await axios.get(`${API_URL}/${"BUS-101"}`, {
            headers: {
                Authorization: `Bearer ${STUDENT_JWT_TOKEN}`, // ✅ Use correct JWT token
            }
        });
        return response.data;
    } catch (error) {
        console.error("🚨 Error fetching bus location:", error);
        throw error;
    }
};



/**
 * Update bus location.
 */
export const updateBusLocation = async (busNumber, latitude, longitude) => {
    try {
        const response = await axios.post(
            UPDATE_LOCATION_URL,
            { busNumber, latitude, longitude },
            {
                headers: {
                    Authorization: `Bearer ${DRIVER_JWT_TOKEN}`, // ✅ Use driver token
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("🚨 Error updating bus location:", error);
        throw error;
    }
};

