import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
} from 'react-bootstrap';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import './NotificationsPanel.css';
import { reusableColor } from '../ReusableComponent/reusableColor';

const NotificationsPanel = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const themeColor = reusableColor.customTextColor;

  const adminNotifications = [
    {
      id: 1,
      title: 'System Maintenance',
      message: 'The system will be under maintenance on June 25, 2025 from 2:00 AM to 4:00 AM EST.',
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'New Policy Update',
      message: 'Please review the updated company policy regarding remote work arrangements.',
      time: 'Yesterday',
    },
    {
      id: 3,
      title: 'Quarterly Meeting',
      message: 'The quarterly all-hands meeting is scheduled for June 30, 2025 at 10:00 AM in the main conference room.',
      time: '3 days ago',
    },
  ];

  const reminderNotifications = [
    {
      id: 4,
      title: 'Submit Timesheet',
      message: 'Don\'t forget to submit your timesheet for this week before Friday 5 PM.',
      time: '4 hours left',
    },
    {
      id: 5,
      title: 'License Expiry',
      message: 'Your software license will expire on June 28, 2025. Please renew to avoid disruption.',
      time: '2 days left',
    },
  ];

  const handleOpenModal = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const renderNotifications = (notifications) => {
    return notifications.map((note) => (
      <div key={note.id} className="notification-item mb-4 p-3 rounded bg-light border">
        <div className="d-flex align-items-start">
          <div className="notification-icon text-primary me-3 mt-1">
            <FaEnvelopeOpenText size={20} />
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-1 fw-bold">{note.title}</h6>
            <p className="mb-2 small text-muted">{note.message}</p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">{note.time}</span>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleOpenModal(note)}
                  style={{ color: themeColor, borderColor: themeColor }}
                >
                  Mark as read
                </Button>

                <Button variant="outline-danger" size="sm">Delete</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="notifications-wrapper py-3 mt-2">
      <Container fluid>
        <Row>
          <Col xs={12}>
            <h4 className="text-black">Notifications</h4>
            <p className="text-black-50 mb-4">
              Stay updated with important messages and reminders
            </p>

            {/* Tabs */}
            <div className="bg-light p-1 rounded d-flex mb-3 gap-2 border">
              <Button
                style={{
                  backgroundColor: activeTab === 'admin' ? themeColor : '#f8f9fa',
                  color: activeTab === 'admin' ? 'white' : '#000',
                  borderColor: themeColor,
                }}
                className="tab-btn flex-fill"
                onClick={() => setActiveTab('admin')}
              >
                Messages from Admin
              </Button>
              <Button
                style={{
                  backgroundColor: activeTab === 'reminders' ? themeColor : '#f8f9fa',
                  color: activeTab === 'reminders' ? 'white' : '#000',
                  borderColor: themeColor,
                }}
                className="tab-btn flex-fill"
                onClick={() => setActiveTab('reminders')}
              >
                Due Reminders
              </Button>
            </div>

            {/* Notification Content */}
            <Card className="notification-card shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong>{activeTab === 'admin' ? 'Messages from Admin' : 'Due Reminders'}</strong>
                  <div>
                    <Button variant="link" className="me-3 p-0 text-primary">Mark all as read</Button>
                    <Button variant="link" className="p-0 text-danger">Clear all</Button>
                  </div>
                </div>

                {activeTab === 'admin' && renderNotifications(adminNotifications)}
                {activeTab === 'reminders' && renderNotifications(reminderNotifications)}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal for Notification Detail */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton style={{ backgroundColor: themeColor, color: 'white' }}>
          <Modal.Title>{selectedNotification?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">{selectedNotification?.message}</p>
          <p className="text-muted small mb-0">Time: {selectedNotification?.time}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NotificationsPanel;
