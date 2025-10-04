import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { reusableColor } from '../ReusableComponent/reusableColor';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Medical Form Reminder",
      message: "Please bring your completed medical form by Friday. This is required for the upcoming field trip to the Science Museum.",
      sender: "Mrs. Johnson (Admin)",
      date: "Today, 9:30 AM",
      isRead: false,
      type: "reminder"
    },
    {
      id: 2,
      title: "Parent-Staff Conference",
      message: "The parent-Staff conferences are scheduled for next week. Please sign up for a time slot through the parent portal.",
      sender: "Mr. Williams (Principal)",
      date: "Yesterday, 2:15 PM",
      isRead: true,
      type: "message"
    },
    {
      id: 3,
      title: "School Closure Notice",
      message: "Due to expected severe weather conditions, school will be closed on Monday, June 23. Stay safe and we'll see you on Tuesday.",
      sender: "School Administration",
      date: "Jun 19, 3:45 PM",
      isRead: true,
      type: "alert"
    },
    {
      id: 4,
      title: "Math Homework Update",
      message: "The deadline for the algebra assignment has been extended to next Wednesday. Please make sure to complete all problems.",
      sender: "Ms. Garcia (Math Staff)",
      date: "Jun 18, 11:20 AM",
      isRead: false,
      type: "message"
    },
    {
      id: 5,
      title: "Sports Day Information",
      message: "Sports Day will be held on July 2nd. Students should wear appropriate athletic clothing and bring water bottles.",
      sender: "Coach Peterson",
      date: "Jun 17, 10:05 AM",
      isRead: true,
      type: "reminder"
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const getIcon = (type) => {
    const iconStyle = { color: reusableColor.customTextColor };
    switch (type) {
      case 'reminder':
        return <i className="fas fa-clock me-2 fs-5" style={iconStyle}></i>;
      case 'message':
        return <i className="fas fa-envelope me-2 fs-5" style={iconStyle}></i>;
      case 'alert':
        return <i className="fas fa-exclamation-triangle text-danger me-2 fs-5"></i>;
      default:
        return <i className="fas fa-bell text-secondary me-2 fs-5"></i>;
    }
  };

  return (
    <div className="min-vh-100 py-4 px-3">
      {/* Inline style for hover border */}
      <style>{`
        .notification-card {
          transition: border 0.3s ease;
          border: 1px solid transparent;
        }
        .notification-card:hover {
          border-color: ${reusableColor.customTextColor} !important;
        }
        .btn-outline-teal {
          border: 1px solid ${reusableColor.customTextColor};
          color: ${reusableColor.customTextColor};
        }
        .btn-outline-teal:hover {
          background-color: ${reusableColor.customTextColor};
          color: white;
        }
      `}</style>

      {/* Page Title */}
      <div className="bg-white rounded-top shadow-sm p-4">
        <h4 className="fw-bold mb-0">
          <i className="fas fa-bell me-2"></i>Notifications
        </h4>
      </div>

      {/* Notifications */}
      <div className="bg-light rounded-bottom shadow-sm p-4">
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div
              key={note.id}
              className="card mb-3 shadow-sm notification-card"
              onClick={() => markAsRead(note.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div className="me-3 mt-1">{getIcon(note.type)}</div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title mb-1">
                        {note.title}
                        {!note.isRead && (
                          <span
                            className="ms-2 rounded-circle p-1"
                            style={{
                              display: 'inline-block',
                              width: '10px',
                              height: '10px',
                              backgroundColor: reusableColor.customTextColor
                            }}
                          ></span>
                        )}
                      </h5>
                      <small className="text-muted">{note.date}</small>
                    </div>
                    <p className="card-text text-muted mb-2">{note.message}</p>
                    <div className="d-flex justify-content-between">
                      <small className="text-secondary">
                        <i className="fas fa-user-circle me-1"></i>{note.sender}
                      </small>
                      <button
                        className="btn btn-link btn-sm p-0 text-decoration-none"
                        style={{ color: reusableColor.customTextColor }}
                      >
                        {note.isRead ? 'Mark as unread' : 'Mark as read'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <div className="text-secondary mb-3" style={{ fontSize: '3rem' }}>
              <i className="fas fa-bell-slash"></i>
            </div>
            <h4 className="fw-bold text-muted">No notifications yet</h4>
            <p className="text-muted">
              When you receive notifications from Staffs or administrators, they will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded shadow-sm p-3 mt-4">
        <div className="row justify-content-between align-items-center">
          <div className="col-auto">
            <button className="btn btn-sm btn-outline-teal me-2">
              <i className="fas fa-check-double me-1"></i> Mark all as read
            </button>
            <button className="btn btn-sm btn-outline-teal">
              <i className="fas fa-filter me-1"></i> Filter
            </button>
          </div>
          <div className="col-auto d-flex align-items-center">
            <span className="me-3 text-muted small">
              {notifications.filter(n => !n.isRead).length} unread
            </span>
            <button className="btn btn-sm btn-outline-teal">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
