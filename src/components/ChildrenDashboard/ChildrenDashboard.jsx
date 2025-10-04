import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { reusableColor } from '../ReusableComponent/reusableColor';
import { BASE_URL } from '../../utils/config';

const ChildrenDashboard = () => {
  const [childName, setChildName] = useState('');
  const [napDuration, setNapDuration] = useState('0 min');
  const [napStartEnd, setNapStartEnd] = useState('--');
  const [activities, setActivities] = useState([]);
  const [meals, setMeals] = useState([]);
  const [attendance, setAttendance] = useState({
    signIn: '--',
    signOut: '--',
    status: '--'
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        setChildName(`${user.first_name} ${user.last_name}`);

        // Fetch nap logs
        const napRes = await axios.get(`${BASE_URL}/safety/sleep-logs`);
        if (napRes.data.success && Array.isArray(napRes.data.data)) {
          const userNaps = napRes.data.data
            .filter(nap => nap.child_id === user.user_id)
            .sort((a, b) => new Date(b.nap_start) - new Date(a.nap_start));

          if (userNaps.length > 0) {
            const latestNap = userNaps[0];
            if (latestNap.duration) {
              const [hours, minutes] = latestNap.duration.split(':');
              let durationText = '';
              if (parseInt(hours) > 0) durationText += `${parseInt(hours)} hr `;
              if (parseInt(minutes) > 0) durationText += `${parseInt(minutes)} min`;
              if (!durationText) durationText = '0 min';
              setNapDuration(durationText);
            } else {
              setNapDuration('0 min');
            }

            if (latestNap.nap_start && latestNap.nap_end) {
              const startTime = new Date(latestNap.nap_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const endTime = new Date(latestNap.nap_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              setNapStartEnd(`${startTime} - ${endTime}`);
            } else {
              setNapStartEnd('--');
            }
          } else {
            setNapDuration('0 min');
            setNapStartEnd('--');
          }
        }

        // Attendance
        const today = new Date().toISOString().split('T')[0];
        const attRes = await axios.get(`${BASE_URL}/attendance/${user.user_id}?from=${today}&to=${today}`);
        if (attRes.data && Array.isArray(attRes.data.attendance) && attRes.data.attendance.length > 0) {
          const todayAtt = attRes.data.attendance[0];
          setAttendance({
            signIn: todayAtt.sign_in_time || '--',
            signOut: todayAtt.sign_out_time || '--',
            status: todayAtt.status || '--'
          });
        } else {
          setAttendance({
            signIn: '--',
            signOut: '--',
            status: 'Absent'
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setAttendance({
          signIn: '--',
          signOut: '--',
          status: '--'
        });
        setNapDuration('0 min');
        setNapStartEnd('--');
      }
    };

    fetchChildData();
  }, []);

  useEffect(() => {
    const fetchActivitiesAndMeals = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        // Fetch activities
        const actRes = await axios.get(`${BASE_URL}/activities/${user.user_id}`);
        if (Array.isArray(actRes.data)) {
          setActivities(actRes.data);
        }

        // Fetch meals
        const mealRes = await axios.get(`${BASE_URL}/meal/child/${user.user_id}`);
        if (Array.isArray(mealRes.data)) {
          const childMeals = mealRes.data.filter(meal => meal.child_id === user.user_id);
          setMeals(childMeals);
        }
      } catch (err) {
        console.error("Error fetching activities or meals:", err);
      }
    };

    fetchActivitiesAndMeals();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'text-success';
      case 'absent': return 'text-danger';
      case 'late': return 'text-warning';
      default: return 'text-muted';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'bg-success';
      case 'absent': return 'bg-danger';
      case 'late': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="container-fluid px-4 py-4">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div 
              className="card border-0 shadow-lg overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, #2AB7A3 0%, #2AB7A9 100%)',
                borderRadius: '20px'
              }}
            >
              <div className="card-body text-white py-5">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h1 className="display-5 fw-bold mb-2">
                      Welcome back, {childName}!
                    </h1>
                    <p className="fs-5 mb-0 opacity-90">{currentDate}</p>
                  </div>
                  <div className="col-md-4 text-end d-none d-md-block">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <i className="fas fa-user-graduate" style={{ fontSize: '3rem' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="row g-4 mb-4">
          {/* Attendance Status */}
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: attendance.status?.toLowerCase() === 'present' ? '#e8f5e8' : '#fee',
                      color: attendance.status?.toLowerCase() === 'present' ? '#28a745' : '#dc3545'
                    }}
                  >
                    <i className="fas fa-check-circle fs-5"></i>
                  </div>
                  <span className={`badge ${getStatusBadgeColor(attendance.status)} fs-6 px-3 py-2`}>
                    {attendance.status}
                  </span>
                </div>
                <h6 className="text-muted mb-1">Today's Status</h6>
                <div className="small text-muted">
                  <div className="mb-1">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    In: <strong>{attendance.signIn}</strong>
                  </div>
                  <div>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Out: <strong>{attendance.signOut}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rest Time */}
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#f3e8ff',
                      color: '#8b5cf6'
                    }}
                  >
                    <i className="fas fa-bed fs-5"></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-0">Rest Time</h6>
                    <h4 className="mb-0 fw-bold" style={{ color: '#8b5cf6' }}>
                      {napDuration}
                    </h4>
                  </div>
                </div>
                <div className="small text-muted">
                  <i className="fas fa-clock me-2"></i>
                  {napStartEnd !== '--' ? napStartEnd : 'No nap recorded'}
                </div>
              </div>
            </div>
          </div>

          {/* Activities Count */}
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#e3f2fd',
                      color: '#2196f3'
                    }}
                  >
                    <i className="fas fa-running fs-5"></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-0">Activities</h6>
                    <h4 className="mb-0 fw-bold" style={{ color: '#2196f3' }}>
                      {activities.length}
                    </h4>
                  </div>
                </div>
                <div className="small text-muted">
                  <i className="fas fa-list me-2"></i>
                  {activities.length > 0 ? 'Activities completed' : 'No activities yet'}
                </div>
              </div>
            </div>
          </div>

          {/* Meals Count */}
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#fff3e0',
                      color: '#ff9800'
                    }}
                  >
                    <i className="fas fa-utensils fs-5"></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-0">Meals</h6>
                    <h4 className="mb-0 fw-bold" style={{ color: '#ff9800' }}>
                      {meals.length}
                    </h4>
                  </div>
                </div>
                <div className="small text-muted">
                  <i className="fas fa-apple-alt me-2"></i>
                  {meals.length > 0 ? 'Meals logged' : 'No meals logged'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Activities Section */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-header bg-transparent border-0 py-4 px-4">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#e3f2fd',
                      color: '#2196f3'
                    }}
                  >
                    <i className="fas fa-list-alt"></i>
                  </div>
                  <h3 className="mb-0 fw-bold">Today's Activities</h3>
                </div>
              </div>
              <div className="card-body px-4 pb-4">
                {activities.length > 0 ? (
                  <div className="row g-3">
                    {activities.map((act, idx) => (
                      <div className="col-md-6" key={idx}>
                        <div 
                          className="p-3 border-0 h-100"
                          style={{ 
                            backgroundColor: '#f8fafc',
                            borderRadius: '12px',
                            borderLeft: '4px solid #2196f3'
                          }}
                        >
                          <div className="d-flex align-items-start">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                              style={{
                                width: '35px',
                                height: '35px',
                                backgroundColor: '#2196f3',
                                color: 'white'
                              }}
                            >
                              <i className="fas fa-play fs-6"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 fw-bold text-capitalize">
                                {act.activity}
                              </h6>
                              <p className="mb-1 text-muted small">
                                <i className="fas fa-clock me-1"></i>
                                {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {act.notes && (
                                <p className="mb-0 small text-muted">
                                  <i className="fas fa-sticky-note me-1"></i>
                                  {act.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#f3f4f6',
                        color: '#9ca3af'
                      }}
                    >
                      <i className="fas fa-calendar-check fs-2"></i>
                    </div>
                    <h5 className="text-muted mb-2">No Activities Yet</h5>
                    <p className="text-muted mb-0">Activities will appear here once they're logged.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Meals Section */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-header bg-transparent border-0 py-4 px-4">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#fff3e0',
                      color: '#ff9800'
                    }}
                  >
                    <i className="fas fa-apple-alt"></i>
                  </div>
                  <h3 className="mb-0 fw-bold">Today's Meals</h3>
                </div>
              </div>
              <div className="card-body px-4 pb-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {meals.length > 0 ? (
                  <div className="space-y-3">
                    {[...new Set(meals.map(m => m.meal_type))].map((type, idx) => {
                      const groupedMeals = meals.filter(m => m.meal_type === type);
                      const mealTypeColors = {
                        breakfast: { bg: '#fff8e1', color: '#f57c00' },
                        lunch: { bg: '#e8f5e8', color: '#388e3c' },
                        dinner: { bg: '#f3e5f5', color: '#7b1fa2' },
                        snack: { bg: '#e3f2fd', color: '#1976d2' }
                      };
                      const typeColor = mealTypeColors[type.toLowerCase()] || { bg: '#f5f5f5', color: '#666' };
                      
                      return (
                        <div key={idx} className="mb-4">
                          <div 
                            className="p-3 rounded-3"
                            style={{ backgroundColor: typeColor.bg }}
                          >
                            <div className="d-flex align-items-center mb-2">
                              <div 
                                className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                style={{
                                  width: '25px',
                                  height: '25px',
                                  backgroundColor: typeColor.color,
                                  color: 'white'
                                }}
                              >
                                <i className="fas fa-utensils" style={{ fontSize: '10px' }}></i>
                              </div>
                              <h6 className="mb-0 fw-bold text-capitalize" style={{ color: typeColor.color }}>
                                {type}
                              </h6>
                            </div>
                            {groupedMeals.map((meal, i) => (
                              <div key={i} className="ms-3">
                                <div className="small text-muted mb-1">
                                  <i className="fas fa-clock me-1"></i>
                                  {meal.meal_time
                                    ? new Date(meal.meal_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {meal.notes && (
                                  <div className="small text-muted">
                                    <i className="fas fa-sticky-note me-1"></i>
                                    {meal.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#f3f4f6',
                        color: '#9ca3af'
                      }}
                    >
                      <i className="fas fa-utensils fs-4"></i>
                    </div>
                    <h6 className="text-muted mb-1">No Meals Yet</h6>
                    <p className="text-muted small mb-0">Meals will be shown here when logged.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildrenDashboard;