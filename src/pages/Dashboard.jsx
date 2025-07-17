// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import Notifications from '../components/Notification';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBrands: 0,
    totalNFTs: 0,
    totalCustomers: 0,
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // For now, use dummy data; will be replaced by Go backend API
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats({
        totalBrands: 3,
        totalNFTs: 57,
        totalCustomers: 21,
      });
      setNotifications([
        "Brand 'CoolDrip' signed up",
        "NFT minted for Aamir (0xAbc...123)",
        "Customer saim@xyz.com claimed NFT",
      ]);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Brands Signed Up" value={stats.totalBrands} />
          <StatCard title="NFTs Minted" value={stats.totalNFTs} />
          <StatCard title="Customers with NFT" value={stats.totalCustomers} />
        </div>

        <Notifications notifications={notifications} />
      </main>
    </div>
  );
};

export default Dashboard;
