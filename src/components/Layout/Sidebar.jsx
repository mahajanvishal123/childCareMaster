

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import './Sidebar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Sidebar = ({ isMobile, onLinkClick }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "");
    setIsLoading(false);
  }, []);

  const handleCloseSidebar = () => {
    if (isMobile) {
      const sidebar = document.getElementById('mobileSidebar');
      if (sidebar) {
        const offcanvas = window.bootstrap?.Offcanvas.getInstance(sidebar);
        if (offcanvas) {
          offcanvas.hide();
        }
      }
    }
  };

  const handleMenuClick = (path) => {
    setActivePath(path);
    handleCloseSidebar();
    if (onLinkClick) onLinkClick();
  };

  const navItem = (to, icon, label) => (
    <li
      className={`nav-item ${activePath.startsWith(to) ? "active" : ""}`}
      key={to}
    >
      <Link
        to={to}
        onClick={() => handleMenuClick(to)}
        className="nav-link d-flex gap-2 align-items-center sidebar-link px-3 py-2"
        aria-current={activePath === to ? "page" : undefined}
      >
        <i className={`me-2 text-white fa-xl ${icon}`}></i>
        <h5>{label}</h5>
      </Link>
    </li>
  );

  const getMenuItems = () => {
    if (isLoading) return null;

    const menuConfig = {

      // Admin
      "3": [
        {
          category: "Dashboard", items: [
            { to: "/admin/dashboard", icon: "fas fa-gauge", label: "Dashboard" },
          ]
        },
        {
          category: "Management", items: [
            { to: "/admin/children", icon: "fas fa-child", label: "Children" },
            { to: "/admin/staff", icon: "fas fa-user-tie", label: "Staff" },
            { to: "/admin/signin", icon: "fas fa-sign-in", label: "Sign-in" },
            { to: "/admin/document", icon: "fas fa-folder-open", label: "Documents" },
            { to: "/admin/location", icon: "fas fa-headset", label: "Location" },
            { to: "/admin/autodailerivr", icon: "fas fa-headset", label: "Call Center" },
            { to: "/admin/outstandingrequirement", icon: "fas fa-triangle-exclamation", label: "OutStanding Requirements" },
            { to: "/admin/setting", icon: "fas fa-gear", label: "Settings" },
          ]
        },
        {
          category: "Finance", items: [
            { to: "/admin/payroll", icon: "fas fa-money-bill", label: "Payroll" },
            { to: "/admin/accounting", icon: "fas fa-file-invoice-dollar", label: "Accounting" },
            { to: "/admin/reports", icon: "fas fa-file-alt", label: "Reports" },
          ]
        },
      ],

      // Secretary
      "4": [
        {
          category: "Dashboard", items: [
            { to: "/secretary/dashboard", icon: "fas fa-gauge", label: "Dashboard" },
          ]
        },
        {
          category: "Management", items: [
            { to: "/secretary/children", icon: "fas fa-child", label: "Children" },
            { to: "/secretary/staff", icon: "fas fa-user-tie", label: "Staff" },
            { to: "/secretary/signin", icon: "fas fa-sign-in", label: "Sign-in" },
            { to: "/secretary/document", icon: "fas fa-folder-open", label: "Documents" },
            { to: "/secretary/location", icon: "fa-solid fa-location-dot", label: "Location" },
            { to: "/secretary/callcenter", icon: "fas fa-headset", label: "Call Center" },
            { to: "/secretary/outstandingrequirement", icon: "fas fa-triangle-exclamation", label: "OutStanding Requirements" },
            // { to: "/secretary/setting", icon: "fas fa-gear", label: "Settings" },

          ]
        },
         {
          category: "Finance", items: [
            // { to: "/secretary/payroll", icon: "fas fa-money-bill", label: "Payroll" },
            { to: "/secretary/accounting", icon: "fas fa-file-invoice-dollar", label: "Accounting" },
            // { to: "/admin/reports", icon: "fas fa-file-alt", label: "Reports" },
          ]
        },
      ],

      // Staff
      "1": [
        {
          category: "Dashboard", items: [
            { to: "/Staff/dashboard", icon: "fas fa-gauge", label: "Dashboard" },
          ]
        },
        {
          category: "Profile", items: [
            { to: "/Staff/profile", icon: "fas fa-user", label: "My Profile" },
            { to: "/teacher/documents", icon: "fas fa-folder-open", label: "My Documents" },
          
            { to: "/staff/callcenter", icon: "fas fa-headset", label: "Call Center" },
          ]
        },
        {
          category: "Management", items: [
            { to: "/staff/children", icon: "fas fa-child", label: "Children" },
            { to: "/staff/signin", icon: "fas fa-sign-in", label: "Sign-in" },
            // { to: "/staff/location", icon: "fas fa-headset", label: "Location" }
          ]
        },
        {
          category: "Attendance", items: [
            { to: "/teacher/attendance", icon: "fas fa-calendar-check", label: "Attendance" },
            // { to: "/teacher/notifications", icon: "fas fa-bell", label: "Notifications" },
          ]
        },
      ],

      // Children
      "2": [
        {
          category: "Dashboard", items: [
            { to: "/children/dashboard", icon: "fas fa-user", label: "Dashboard" },
          ]
        },
        {
          category: "Profile", items: [
            { to: "/children/myprofile", icon: "fas fa-tasks", label: "My Profile" },
            { to: "/children/myform", icon: "fas fa-file-signature", label: "My Forms" },
            { to: "/children/mynotes", icon: "fas fa-sticky-note", label: "My Notes" },
            { to: "/children/callcenter", icon: "fas fa-headset", label: "Call Center" },
          ]
        },
        {
          category: "Attendance", items: [
            { to: "/children/attendence", icon: "fas fa-calendar-check", label: "Attendance" },
            // { to: "/children/notifications", icon: "fas fa-bell", label: "Notifications" },
          ]
        },
      ],
    };

    const items = menuConfig[role] || [];
    return items.map(category => (
      <>
      <div key={category.category} className="m-2">
        <h6 className="text-uppercase mt-3 category"><u><b>{category.category}</b></u></h6>
        <ul className="nav flex-column gap-2 pb-3">
          {category.items.map(item => navItem(item.to, item.icon, item.label))}
        </ul>
      </div>
        {/* Yahan pe sabko common dikhega */}
    
      </>
    ));
  };

  return (
    <div
      className="sidebar d-flex flex-column vh-100 position-relative text-white"
      id="sidebar"
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center py-3 px-3 border-bottom" style={{ marginTop: "100px" }}>
        <h5 className="mb-0">Menu</h5>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-grow-1 overflow-auto">
        <nav className="py-3">
          {getMenuItems()}
        </nav>
      </div>

      {/* Fixed Footer */}
      <div
        className="p-3 border-top small text-center"
        style={{ position: "sticky", bottom: 0, backgroundColor: "#2ab7a9", zIndex: 1, fontSize: "1rem" }}
      >
        {role ? `Logged in ` : "Please log in"}
      </div>
    </div>
  );
};

export default Sidebar;
