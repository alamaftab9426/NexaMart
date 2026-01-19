import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { FaLaptop, FaShoppingCart, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    payments: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [salesChart, setSalesChart] = useState({ categories: [], data: [] });
  const [profitChart, setProfitChart] = useState({ categories: [], series: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!token) return;

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        /* ================= ORDERS (ADMIN) ================= */
        const orderRes = await axios.get(
          `${BASE_URL}/api/orders`,
          { headers }
        );

        const orders = Array.isArray(orderRes.data)
          ? orderRes.data
          : orderRes.data.orders || [];

        const ordered = orders.slice().reverse();
        setRecentOrders(ordered.slice(0, 10));

        /* ================= PRODUCTS ================= */
        const productRes = await axios.get(
          `${BASE_URL}/api/products`,
          { headers }
        );

        const products = Array.isArray(productRes.data)
          ? productRes.data
          : productRes.data.products || [];

        /* ================= CUSTOMERS ================= */
        const userRes = await axios.get(
          `${BASE_URL}/api/admin/customers`,
          { headers }
        );

        const users = Array.isArray(userRes.data)
          ? userRes.data
          : userRes.data.users || [];

        /* ================= STATS ================= */
        setStats({
          products: products.length,
          orders: orders.length,
          customers: users.length,
          payments: 0,
        });

        /* ================= CHART DATA ================= */
        const monthly = {};
        ordered.forEach((o) => {
          const d = new Date(o.createdAt);
          const mon = d.toLocaleString("default", { month: "short" });
          monthly[mon] = (monthly[mon] || 0) + (o.amount || 0);
        });

        const months = Object.keys(monthly);
        const values = Object.values(monthly);

        setSalesChart({ categories: months, data: values });
        setProfitChart({
          categories: months,
          series: [
            { name: "Revenue", data: values },
            { name: "Profit", data: values.map(v => Math.round(v * 0.8)) },
          ],
        });
      } catch (err) {
        console.error("Dashboard error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  /* ================= CHART CONFIG ================= */
  const salesData = {
    options: {
      chart: { id: "sales" },
      xaxis: { categories: salesChart.categories },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
    },
    series: [{ name: "Sales", data: salesChart.data }],
  };

  const profitData = {
    options: {
      chart: { type: "bar" },
      xaxis: { categories: profitChart.categories },
      dataLabels: { enabled: false },
    },
    series: profitChart.series,
  };

  const cards = [
    { name: "Products", value: stats.products, icon: <FaLaptop size={28} />, color: "bg-blue-600" },
    { name: "Orders", value: stats.orders, icon: <FaShoppingCart size={28} />, color: "bg-yellow-600" },
    { name: "Customers", value: stats.customers, icon: <FaUsers size={28} />, color: "bg-pink-600" },
    { name: "Payments", value: "—", icon: <FaMoneyBillWave size={28} />, color: "bg-green-600" },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* ===== STATS CARDS (OLD DESIGN) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center bg-white"
          >
            <div className={`mb-4 p-5 rounded-full ${c.color}`}>
              {React.cloneElement(c.icon, { color: "white", size: 32 })}
            </div>

            <div className="text-lg font-semibold text-gray-600 mb-2">
              {c.name}
            </div>

            <div className="text-3xl font-bold text-gray-800">
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* ===== CHARTS (OLD DESIGN) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Sales Overview
          </h2>
          <Chart {...salesData} type="line" height={320} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Profit Overview
          </h2>
          <Chart {...profitData} type="bar" height={320} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "Customer", "Status", "Amount", "Date"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">

                    <td className="px-6 py-3 font-medium">
                      {o._id.slice(-6)}
                    </td>

                    <td className="px-6 py-3">
                      {o.userId?.name || "N/A"}
                    </td>

                    <td className="px-6 py-3">
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                        {o.orderStatus || "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-3 font-semibold">
                      ₹{o.pricing?.totalAmount?.toLocaleString() || 0}
                    </td>

                    <td className="px-6 py-3 text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </td>

                  </tr>
                ))
              )}
            </tbody>


          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
