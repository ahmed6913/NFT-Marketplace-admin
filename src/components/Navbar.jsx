// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import Notifications from "./Notification";

const Navbar = ({ notifications = [] }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const bellRef = useRef();
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex justify-between items-center mb-6 relative">
      <h1 className="text-xl font-bold text-blue-600">Lazarus Mint Admin</h1>
      <div className="flex items-center space-x-4 relative">
        <button
          ref={bellRef}
          onClick={() => setOpen((prev) => !prev)}
          className="relative focus:outline-none"
          aria-label="Show notifications"
        >
          {/* Bell Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-600 hover:text-indigo-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <div ref={dropdownRef}>
          <Notifications notifications={notifications} open={open} />
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
