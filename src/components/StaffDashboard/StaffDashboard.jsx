import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Container, Modal, Form } from 'react-bootstrap';
import axiosInstance from '../../utils/axiosInstance';
import { BASE_URL } from '../../utils/config';
import './StaffDashboard.css';
import { reusableColor } from '../ReusableComponent/reusableColor';

const StaffDashboard = () => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showAllReminders, setShowAllReminders] = useState(false);
  const [showAllChildren, setShowAllChildren] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  
  // Dynamic data states
  const [children, setChildren] = useState([]);
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reminderData, setReminderData] = useState([]);
  const [activityData, setActivityData] = useState([]);

  // Get logged-in user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = localStorage.getItem('role');
  const userId = user.user_id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Always fetch all children first
        const childrenRes = await axiosInstance.get(`${BASE_URL}/children`);
        
        // Get staff data to get classroom_id
        const staffRes = await axiosInstance.get(`${BASE_URL}/teachers/${userId}`);
        const staff = staffRes.data;
        setStaffData(staff);

        if (userRole === '1') {
          // Filter children by classroom - NOTE: use childrenRes.data.data
          const filteredChildren = childrenRes.data.data.filter(
            child => child.teacher_id === staff.user_id
          );
          setChildren(filteredChildren);
        } else {
          // For admin/other roles, show all children
          setChildren(childrenRes.data.data);
        }   

        // TODO: Fetch real reminder data
        // For now, keeping static data but you can replace with API call
        setReminderData([
          {
            date: 'June 21, 2025 • 10:30 AM',
            title: 'Quarterly fire evacuation practice',
            tag: 'FireDrill',
            color: 'red',
          },
          {
            date: 'June 23, 2025 • 2:00 PM',
            title: 'Child development workshop',
            tag: 'Training',
            color: 'yellow',
          },
          {
            date: 'June 25, 2025 • 4:30 PM',
            title: 'End of month progress review',
            tag: 'ParentMeeting',
            color: 'green',
          },
          {
            date: 'June 28, 2025 • 9:00 AM',
            title: 'Visit to the local zoo',
            tag: 'Field Trip',
            color: 'blue',
          },
          {
            date: 'June 30, 2025 • 1:00 PM',
            title: 'Staff feedback session',
            tag: 'Meeting',
            color: 'orange',
          },
          {
            date: 'July 2, 2025 • 11:00 AM',
            title: 'Health check-up camp',
            tag: 'Health',
            color: 'teal',
          }
        ]);

        // TODO: Fetch real activity data
        // For now, keeping static data but you can replace with API call
        setActivityData([
          { time: '9:15 AM', detail: 'Emma signed in by parent', user: 'Sarah J.' },
          { time: '9:08 AM', detail: 'Noah signed in by parent', user: 'Sarah J.' },
          { time: '9:02 AM', detail: 'Completed morning health check', user: 'Sarah J.' },
          { time: '8:55 AM', detail: 'Olivia signed in by parent', user: 'Sarah J.' },
          { time: '8:50 AM', detail: 'Liam signed in by parent', user: 'Sarah J.' },
          { time: '8:45 AM', detail: 'Ava completed breakfast', user: 'Sarah J.' },
          { time: '8:40 AM', detail: 'Ethan signed in by parent', user: 'Sarah J.' },
          { time: '8:30 AM', detail: 'Emma completed hand wash routine', user: 'Sarah J.' },
        ]);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userRole, userId]);

  const handleReminderOpen = () => setShowReminderModal(true);
  const handleReminderClose = () => setShowReminderModal(false);

  const formatDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const timeOptions = { 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    
    return {
      date: now.toLocaleDateString('en-US', options),
      time: now.toLocaleTimeString('en-US', timeOptions)
    };
  };

  const { date, time } = formatDate();

  if (loading) {
    return (
      <div className="dashboard-container py-4 px-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div fluid className="dashboard-container py-4 px-4">
      <div className="welcome-header">
        <div>
          <h5>Welcome back, {staffData?.first_name} {staffData?.last_name}</h5>
          <small>{date} | {time}</small>
        </div>
        <img
          src={staffData?.photo || "https://cdn-icons-png.flaticon.com/512/219/219969.png"}
          alt="User"
          className="user-avatar"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <Row className="g-3">
        <Col md={12}>
          <Card className="shadow-sm h-100 small-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="assigned-number">{children.length}</h1>
                  <p className="mb-0">children in your care </p>
                </div>
                <span className="text-muted">
                  {staffData?.classroom_id ? `Classroom ${staffData.classroom_id}` : 'Unassigned'}
                </span>
              </div>

              {children.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-child fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No children assigned to your classroom yet.</p>
                </div>
              ) : (
                <>
                  <Row className="g-3">
                    {(showAllChildren ? children : children.slice(0, 6)).map((child) => (
                      <Col key={child.child_id} xs={4} sm={2} className="text-center">
                        {child.photo_url ? (
                          <img
                            src={child.photo_url}
                            alt={child.full_name}
                            className="child-avatar"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="child-avatar bg-secondary d-flex align-items-center justify-content-center text-white">
                            <i className="fas fa-user"></i>
                          </div>
                        )}
                        <p className="small mt-1 mb-0">
                          {child.full_name || `${child.first_name} ${child.last_name}`}
                        </p>
                      </Col>
                    ))}
                  </Row>

                  {children.length > 6 && (
                    <div className="text-center mt-3">
                      <Button
                        size="sm"
                        onClick={() => setShowAllChildren(!showAllChildren)}
                        style={{ backgroundColor: reusableColor.customTextColor, borderColor: reusableColor.customTextColor, color: '#fff' }}
                      >
                        {showAllChildren ? 'View Less' : 'View All'}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* <Col md={4}>
          <Card className="shadow-sm h-100 small-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Upcoming Reminders</h6>
                <Button
                  size="sm"
                  style={{ backgroundColor: reusableColor.customTextColor, borderColor: reusableColor.customTextColor, color: '#fff' }}
                  onClick={handleReminderOpen}
                >
                  + Add
                </Button>
              </div>

              {reminderData.length === 0 ? (
                <div className="text-center py-3">
                  <i className="fas fa-bell fa-2x text-muted mb-2"></i>
                  <p className="text-muted small">No reminders scheduled</p>
                </div>
              ) : (
                <>
                  <ul className="reminder-list">
                    {(showAllReminders ? reminderData : reminderData.slice(0, 4)).map((item, index) => (
                      <li key={index}>
                        <span className="reminder-date">{item.date}</span>
                        <p className="mb-1">{item.title}</p>
                        <span className={`tag ${item.color}`}>{item.tag}</span>
                      </li>
                    ))}
                  </ul>

                  {reminderData.length > 4 && (
                    <p
                      className="text-end mt-2 small text-primary mb-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowAllReminders(!showAllReminders)}
                    >
                      {showAllReminders ? 'View less ←' : 'View all reminders →'}
                    </p>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
{/* 
      <Card className="shadow-sm mt-3 small-card">
        <Card.Body>
          <h6 className="fw-bold mb-3">Recent Activity</h6>

          {activityData.length === 0 ? (
            <div className="text-center py-3">
              <i className="fas fa-clock fa-2x text-muted mb-2"></i>
              <p className="text-muted small">No recent activity</p>
            </div>
          ) : (
            <>
              <ul className="activity-list">
                {(showAllActivity ? activityData : activityData.slice(0, 5)).map((item, idx) => (
                  <li key={idx}>
                    <span className="activity-time">{item.time}</span>
                    <span className="activity-detail">{item.detail}</span>
                    <span className="activity-user">by {item.user}</span>
                  </li>
                ))}
              </ul>

              {activityData.length > 5 && (
                <div className="text-center mt-3">
                  <Button
                    size="l"
                    onClick={() => setShowAllActivity(!showAllActivity)}
                    style={{ backgroundColor: reusableColor.customTextColor, borderColor: reusableColor.customTextColor, color: '#fff' }}
                  >
                    {showAllActivity ? 'View Less' : 'View Complete Activity Log'}
                  </Button>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card> */}

      <Modal show={showReminderModal} onHide={handleReminderClose} centered>
        <Modal.Header closeButton style={{ backgroundColor: reusableColor.customTextColor, color: 'white' }}>
          <Modal.Title>Add New Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control type="datetime-local" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reminder Title</Form.Label>
              <Form.Control type="text" placeholder="e.g. Monthly PTM Meeting" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tag</Form.Label>
              <Form.Select>
                <option value="FireDrill">FireDrill</option>
                <option value="Training">Training</option>
                <option value="ParentMeeting">ParentMeeting</option>
                <option value="FieldTrip">Field Trip</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: '#ccc', borderColor: '#ccc', color: '#000' }}
            onClick={handleReminderClose}
          >
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: reusableColor.customTextColor, borderColor: reusableColor.customTextColor, color: '#fff' }}
          >
            Add Reminder
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffDashboard;

