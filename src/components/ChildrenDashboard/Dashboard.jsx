import React, { useState } from 'react';



const Dashboard = () => {
  const [childName] = useState("Emma Johnson");

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const activities = [
    { id: 1, name: "Morning Circle", timeSlot: "08:30 AM - 09:00 AM", description: "Group activities and daily introduction", type: "education", icon: "fas fa-users" },
    { id: 2, name: "Reading Time", timeSlot: "09:15 AM - 10:00 AM", description: "Reading session with age-appropriate books", type: "education", icon: "fas fa-book-open" },
    { id: 3, name: "Outdoor Play", timeSlot: "10:15 AM - 11:00 AM", description: "Supervised playground activities", type: "physical", icon: "fas fa-running" },
    { id: 4, name: "Lunch", timeSlot: "11:30 AM - 12:15 PM", description: "Healthy meal and social interaction", type: "meal", icon: "fas fa-utensils" },
    { id: 5, name: "Nap Time", timeSlot: "12:30 PM - 02:00 PM", description: "Rest period in quiet environment", type: "rest", icon: "fas fa-bed" },
    { id: 6, name: "Arts & Crafts", timeSlot: "02:15 PM - 03:15 PM", description: "Creative activities with various materials", type: "creative", icon: "fas fa-paint-brush" },
    { id: 7, name: "Snack Time", timeSlot: "03:30 PM - 04:00 PM", description: "Healthy afternoon snack", type: "meal", icon: "fas fa-apple-alt" }
  ];

  const attendance = { signIn: "07:45 AM", signOut: "05:15 PM", status: "Present" };

  const getBgClass = (type) => {
    switch (type) {
      case 'education': return 'border-start border-primary';
      case 'physical': return 'border-start border-success';
      case 'meal': return 'border-start border-warning';
      case 'rest': return 'border-start border-purple';
      case 'creative': return 'border-start border-danger';
      default: return 'border-start border-secondary';
    }
  };

  return (
    <div className="container-fluid bg-light py-4">
      <div className="container">
        {/* Header */}
        <div className="bg-primary text-white text-center p-4 rounded mb-4">
          <h1 className="display-5">Welcome, {childName}</h1>
          <p className="lead">{currentDate}</p>
        </div>

        <div className="row">
          {/* Activities */}
          <div className="col-lg-8 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="mb-4"><i className="fas fa-calendar-day me-2 text-primary"></i>Today's Activities</h2>
              {activities.map((act) => (
                <div key={act.id} className={`mb-3 p-3 bg-light rounded ${getBgClass(act.type)} border-4`}>
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      <i className={`${act.icon} text-primary fs-4`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-1">{act.name}</h5>
                        <small className="text-muted">{act.timeSlot}</small>
                      </div>
                      <p className="mb-0 text-muted">{act.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance */}
          <div className="col-lg-4 mb-4">
            <div className="bg-white p-4 rounded shadow h-100">
              <h2 className="mb-4"><i className="fas fa-clock me-2 text-primary"></i>Attendance</h2>
              <div className="mb-4 d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle p-3 me-3 ">
                  <i className="fas fa-sign-in-alt"></i>
                </div>
                <div>
                  <h6 className="mb-0">Sign-in Time</h6>
                  <p className="fw-bold text-primary mb-0">{attendance.signIn}</p>
                </div>
              </div>
              <div className="mb-4 d-flex align-items-center">
                <div className="bg-secondary text-white rounded-circle p-3 me-3">
                  <i className="fas fa-sign-out-alt"></i>
                </div>
                <div>
                  <h6 className="mb-0">Sign-out Time</h6>
                  <p className="fw-bold text-secondary mb-0">{attendance.signOut}</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle p-3 me-3">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div>
                  <h6 className="mb-0">Status</h6>
                  <p className="fw-bold text-success mb-0">{attendance.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="mb-4"><i className="fas fa-chart-pie me-2 text-primary"></i>Daily Summary</h2>
          <div className="row text-center">
            <div className="col-md-4 mb-3">
              <div className="bg-light p-3 rounded border">
                <i className="fas fa-apple-alt text-primary fs-2 mb-2"></i>
                <h5>Meals</h5>
                <p className="fw-bold fs-4 mb-0">2</p>
                <small>Lunch and Afternoon Snack</small>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="bg-light p-3 rounded border">
                <i className="fas fa-running text-success fs-2 mb-2"></i>
                <h5>Physical Activity</h5>
                <p className="fw-bold fs-4 mb-0">45 min</p>
                <small>Outdoor playground time</small>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="bg-light p-3 rounded border">
                <i className="fas fa-bed text-purple fs-2 mb-2"></i>
                <h5>Rest Time</h5>
                <p className="fw-bold fs-4 mb-0">90 min</p>
                <small>Afternoon nap</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;