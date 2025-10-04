import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { reusableColor } from "../ReusableComponent/reusableColor";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev); // ✅ toggle on every click
  };

  return (
    <div className="d-flex vh-100 overflow-hidden position-fixed w-100">
      {/* Sidebar for large screen */}
      <div
        className={`col-lg-2 p-0 d-none d-lg-block`}
        style={{ width: "250px", backgroundColor: reusableColor.customTextColor }}
      >
        <Sidebar />
      </div>

      {/* Sidebar for small screen (toggle based) */}
      {isSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 vh-100 bg-dark bg-opacity-75 w-100 d-lg-none"
          onClick={() => setIsSidebarOpen(false)} // close if backdrop clicked
          style={{ zIndex: 500 }}
        >
          <div
            className="position-absolute top-0 start-0 h-100"
            style={{ width: "250px", backgroundColor: reusableColor.customTextColor }}
            onClick={(e) => e.stopPropagation()} // prevent close on inner click
          >
            <Sidebar isMobile={true} onLinkClick={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow-1 w-100">
        <Navbar toggleSidebar={toggleSidebar} />
        <div
          className="overflow-auto p-3 w-100 bg-light"
          style={{
            marginTop: "4.5rem",   // For fixed header offset
            height: "calc(100vh - 4.5rem)", // Full height minus header
            overflowY: "auto"
          }}
        >
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;
