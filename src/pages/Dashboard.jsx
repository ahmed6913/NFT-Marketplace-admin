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

  // Mint NFT form state
  const [mintWallet, setMintWallet] = useState("");
  const [mintName, setMintName] = useState("");
  const [mintDesc, setMintDesc] = useState("");

  // Dummy data useEffect removed

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar notifications={notifications} />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard title="Brands Signed Up" value={stats.totalBrands} />
          <StatCard title="NFTs Minted" value={stats.totalNFTs} />
          <StatCard title="Customers with NFT" value={stats.totalCustomers} />
        </div>

        {/* 🆕 Mint NFT to Customer Section */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center gap-2">
              <span role="img" aria-label="wrench">🔧</span> Mint NFT to Customer
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Wallet Address</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-slate-400"
                  placeholder="0x..."
                  value={mintWallet}
                  onChange={e => setMintWallet(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NFT Name or ID</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-slate-400"
                  placeholder="NFT Name or ID"
                  value={mintName}
                  onChange={e => setMintName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description / Metadata (optional)</label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-slate-400"
                  placeholder="Description or metadata (optional)"
                  value={mintDesc}
                  onChange={e => setMintDesc(e.target.value)}
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
              >
                Mint Now
              </button>
            </form>
          </div>
        </div>

        {/* Notifications section removed from here */}
      </main>
    </div>
  );
};

export default Dashboard;
