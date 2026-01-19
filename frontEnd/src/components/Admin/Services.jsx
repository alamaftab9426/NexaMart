import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_URL;

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "accepted", label: "Accepted", color: "bg-green-500" },
  { value: "completed", label: "Completed", color: "bg-blue-500" },
  { value: "rejected", label: "Rejected", color: "bg-red-500" },
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch service requests from backend
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("adminToken");
    
      const res = await axios.get(`${BASE_URL}/api/service`, {
        
        headers: { Authorization: `Bearer ${token}` },

      });
        setServices(res.data);
     

    } catch (error) {
      console.error("Error fetching services:", error);
      Swal.fire("Error", "Failed to fetch services", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);


 
const handleStatusChange = async (id, newStatus) => {
  try {
    const token = localStorage.getItem("adminToken");
    await axios.put(
      `${BASE_URL}/api/service/${id}`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${token}` }, 
      }
    );
    setServices((prev) =>
      prev.map((srv) => (srv._id === id ? { ...srv, status: newStatus } : srv))
    );
    Swal.fire("Success", `Status updated to "${newStatus}"`, "success");
  } catch (error) {
    console.error("Error updating status:", error);
    Swal.fire("Error", "Failed to update status", "error");
  }
};

// Delete request in backend
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the service request permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete ",
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${BASE_URL}/api/service/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // 
      });
      setServices((prev) => prev.filter((srv) => srv._id !== id));
      Swal.fire("Deleted!", "Service request has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting service:", error);
      Swal.fire("Error", "Failed to delete service", "error");
    }
  }
};


  const getStatusColor = (status) => {
    const found = STATUS_OPTIONS.find((opt) => opt.value === status);
    return found ? found.color : "bg-gray-500";
  };

  if (loading) return <p className="p-5">Loading services...</p>;

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Service Requests</h1>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Service</th>
            <th className="p-3">Address</th>
            <th className="p-3">Problem</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? (
            services.map((srv) => (
              <tr key={srv._id} className="border-b">
                <td className="p-3">{srv.name}</td>
                <td className="p-3">{srv.email}</td>
                <td className="p-3">{srv.service}</td>
                <td className="p-3">{srv.address}</td>
                <td className="p-3">{srv.problem}</td>
                <td className="p-3 flex items-center gap-2">
                  <span
                    className={`px-4 py-2 text-white text-sm rounded-full font-semibold ${getStatusColor(
                      srv.status
                    )}`}
                  >
                    {STATUS_OPTIONS.find((opt) => opt.value === srv.status)?.label}
                  </span>
                  <select
                    value={srv.status}
                    onChange={(e) => handleStatusChange(srv._id, e.target.value)}
                    className="border rounded p-1 text-md py-2 font-semibold"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(srv._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-5 text-gray-600">
                No service requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Services;
