import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL

const Address = () => {
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);

  // Fetch all users addresses
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token"); // admin token
      

      const res = await axios.get(`${BASE_URL}/api/user/placeorder`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Group addresses by user
      const groupedUsers = {};
      res.data.addresses.forEach(addr => {
        const userId = addr.user_id._id;
        if (!groupedUsers[userId]) {
          groupedUsers[userId] = {
            _id: userId,
            name: addr.user_id.name,
            mobile:addr.user_id.mobile,
            addresses: [],
          };
        }
        groupedUsers[userId].addresses.push(addr);
      });

      setUsers(Object.values(groupedUsers));
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const toggleUser = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const deleteAddress = async (userId, addressId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/user/placeorder/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(prev =>
        prev.map(user =>
          user._id === userId
            ? { ...user, addresses: user.addresses.filter(addr => addr._id !== addressId) }
            : user
        )
      );
    } catch (err) {
      console.error("Failed to delete address:", err);
      alert("Failed to delete address.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Customers Addresses</h1>

      <div className="space-y-6">
        {users.map(user => (
          <div
            key={user._id}
            className="border rounded-xl shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300"
          >
            {/* User Header */}
            <div
              className="cursor-pointer px-6 py-4 bg-zinc-950 text-white font-semibold flex justify-between items-center rounded-t-xl hover:opacity-90 transition-opacity duration-200"
              onClick={() => toggleUser(user._id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  {user.name} <span className="text-sm font-normal text-gray-200"></span>
                </div>
              </div>
              <span className="text-lg">{expandedUser === user._id ? '▲' : '▼'}</span>
            </div>

            {/* Addresses Cards */}
            {expandedUser === user._id && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-b-xl">
                {user.addresses.length > 0 ? (
                  user.addresses.map(addr => (
                    <div
                      key={addr._id}
                      className="relative bg-white border rounded-lg p-5 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
                    >
                      <div className="flex items-center justify-between mb-3 border-b pb-2">
                        <p className="font-semibold text-gray-800 text-lg">{addr.fullname}</p>
                        <button
                          className="text-red-600 hover:text-red-800 hover:scale-110 transition-transform duration-200"
                          onClick={() => deleteAddress(user._id, addr._id)}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>

                      <div className="text-gray-700 space-y-1">
                        <p>{addr.address}, {addr.city}, {addr.state}, {addr.country}</p>
                        <p>Pincode: {addr.pincode}</p>
                        <p>Mobile: {addr.mobile}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Added: {moment(addr.createdAt).format('DD MMM YYYY, hh:mm A')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-2 text-center">No addresses available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Address;
