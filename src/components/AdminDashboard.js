import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [newBus, setNewBus] = useState({ busNumber: '', capacity: '' });
  const [newRoute, setNewRoute] = useState({ routeName: '', stops: '' });
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', licenseNumber: '' });

  const adminToken = localStorage.getItem('adminToken');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  };

  useEffect(() => {
    const fetchData = () => {
      fetch('https://your-backend-url/buses', { headers })
        .then(res => res.json())
        .then(setBuses)
        .catch(console.error);

      fetch('https://your-backend-url/routes', { headers })
        .then(res => res.json())
        .then(setRoutes)
        .catch(console.error);

      fetch('https://your-backend-url/drivers', { headers })
        .then(res => res.json())
        .then(setDrivers)
        .catch(console.error);
    };

    fetchData();
  }, []);

  const handleAddBus = e => {
    e.preventDefault();
    fetch('https://your-backend-url/buses/add', {
      method: 'POST',
      headers,
      body: JSON.stringify(newBus)
    }).then(() => {
      setNewBus({ busNumber: '', capacity: '' });
      window.location.reload();
    });
  };

  const handleAddRoute = e => {
    e.preventDefault();
    fetch('https://your-backend-url/routes/add', {
      method: 'POST',
      headers,
      body: JSON.stringify(newRoute)
    }).then(() => {
      setNewRoute({ routeName: '', stops: '' });
      window.location.reload();
    });
  };

  const handleAddDriver = e => {
    e.preventDefault();
    fetch('https://your-backend-url/drivers/add', {
      method: 'POST',
      headers,
      body: JSON.stringify(newDriver)
    }).then(() => {
      setNewDriver({ name: '', phone: '', licenseNumber: '' });
      window.location.reload();
    });
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* View Buses */}
      <section>
        <h2>All Buses</h2>
        <ul>
          {Array.isArray(buses) && buses.map(bus => (
            <li key={bus.id}>Bus #{bus.busNumber} - Capacity: {bus.capacity}</li>
          ))}
        </ul>
      </section>

      {/* Add Bus */}
      <section>
        <h2>Add New Bus</h2>
        <form onSubmit={handleAddBus}>
          <input
            type="text"
            placeholder="Bus Number"
            value={newBus.busNumber}
            onChange={e => setNewBus({ ...newBus, busNumber: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newBus.capacity}
            onChange={e => setNewBus({ ...newBus, capacity: e.target.value })}
            required
          />
          <button type="submit">Add Bus</button>
        </form>
      </section>

      {/* Add Route */}
      <section>
        <h2>Add New Route</h2>
        <form onSubmit={handleAddRoute}>
          <input
            type="text"
            placeholder="Route Name"
            value={newRoute.routeName}
            onChange={e => setNewRoute({ ...newRoute, routeName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Stops (comma separated)"
            value={newRoute.stops}
            onChange={e => setNewRoute({ ...newRoute, stops: e.target.value })}
            required
          />
          <button type="submit">Add Route</button>
        </form>
      </section>

      {/* Add Driver */}
      <section>
        <h2>Add New Driver</h2>
        <form onSubmit={handleAddDriver}>
          <input
            type="text"
            placeholder="Driver Name"
            value={newDriver.name}
            onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={newDriver.phone}
            onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="License Number"
            value={newDriver.licenseNumber}
            onChange={e => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
            required
          />
          <button type="submit">Add Driver</button>
        </form>
      </section>
    </div>
  );
};

export default AdminDashboard;
