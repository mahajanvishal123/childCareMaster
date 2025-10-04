import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form
} from 'react-bootstrap';
import './StaffProfile.css';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaUser,
  FaSchool,
  FaClock,
  FaChalkboardTeacher,
  FaMale,
} from 'react-icons/fa';
import { reusableColor } from '../ReusableComponent/reusableColor';
import axiosInstance from '../../utils/axiosInstance';
import { BASE_URL } from '../../utils/config';

const StaffProfile = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Get user_id from localStorage (or Redux if you prefer)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`${BASE_URL}/teachers/${userId}`);
        setStaff(res.data);
        setEditForm(res.data); // prefill edit form
        localStorage.setItem('classroom_id', res.data?.classroom_id);
      } catch (err) {
        setError('Failed to load staff profile.');
        setStaff(null);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchStaff();
  }, [userId]);

  const handleEditOpen = () => setShowEditModal(true);
  const handleEditClose = () => setShowEditModal(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      // Only send editable fields
      const updateFields = {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        phone: editForm.phone,
        cell: editForm.cell,
        address: editForm.address,
        email: editForm.email,
        emergency_contact: editForm.emergency_contact,
        gender: editForm.gender,
        // add more fields as needed
      };
      await axiosInstance.patch(`${BASE_URL}/teachers/${userId}`, updateFields);
      setStaff((prev) => ({ ...prev, ...updateFields }));
      setShowEditModal(false);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!staff) return <div>Staff not found.</div>;

  return (
    <Container fluid className="profile-container py-3 px-4 border rounded">
      {/* Profile Header */}
      <div className="text-center mb-4">
        <div className="profile-avatar mx-auto">
          <FaUser size={40} />
        </div>
        <h5 className="text-dark mt-3">My Profile</h5>
        <div className="underline" />
      </div>

      <Row>
        <Col xs={12}>
          {/* Personal Info */}
          <Card className="profile-card mb-3">
            <Card.Body>
              <h6 className="section-title">Personal Information</h6>
              <Row className="mt-3">
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaUser className="me-2 icon-colored" />
                    <small className="text-muted">Full Name</small>
                  </div>
                  <span>{staff.first_name} {staff.last_name}</span>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaPhone className="me-2 icon-colored" />
                    <small className="text-muted">Phone Number</small>
                  </div>
                  <span>{staff.phone || staff.cell}</span>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaEnvelope className="me-2 icon-colored" />
                    <small className="text-muted">Email Address</small>
                  </div>
                  <span>{staff.email}</span>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaChalkboardTeacher className="me-2 icon-colored" />
                    <small className="text-muted">Role</small>
                  </div>
                  <span>{staff.role_id === 1 ? 'Staff' : staff.role_id}</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Assigned Location */}
          <Card className="profile-card mb-3">
            <Card.Body>
              <h6 className="section-title">Assigned Location</h6>
              <Row className="mt-3">
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaBuilding className="me-2 icon-colored" />
                    <small className="text-muted">Building/Campus</small>
                  </div>
                  <span>{staff.address || '-'}</span>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaSchool className="me-2 icon-colored" />
                    <small className="text-muted">Classroom</small>
                  </div>
                  <span>{staff.classroom_id || '-'}</span>
                </Col>
                {/* <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaMapMarkerAlt className="me-2 icon-colored" />
                    <small className="text-muted">Floor</small>
                  </div>
                  <span>-</span>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaClock className="me-2 icon-colored" />
                    <small className="text-muted">Schedule</small>
                  </div>
                  <span>-</span>
                </Col> */}
              </Row>
            </Card.Body>
          </Card>

          {/* Emergency Contact */}
          <Card className="profile-card mb-3">
            <Card.Body>
              <h6 className="section-title">Emergency Contact</h6>
              <Row className="mt-3">
                {/* <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaUser className="me-2 icon-colored" />
                    <small className="text-muted">Contact Name</small>
                  </div>
                  <span>{staff.emergency_contact || '-'}</span>
                </Col> */}
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaPhone className="me-2 icon-colored" />
                    <small className="text-muted"> Phone</small>
                  </div>
                  <span>{staff.emergency_contact || '-'}</span>
                </Col>
                {/* <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaMale className="me-2 icon-colored" />
                    <small className="text-muted">Relationship</small>
                  </div>
                  <span>-</span>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FaEnvelope className="me-2 icon-colored" />
                    <small className="text-muted">Email</small>
                  </div>
                  <span>{staff.email}</span>
                </Col> */}
              </Row>
            </Card.Body>
          </Card>

          {/* My Documents Section */}
          <Card className="profile-card mb-3">
            <Card.Body>
              <h6 className="section-title">My Documents</h6>
              <Row className="mt-3">
                {[
                  { key: 'medical_form', label: 'Medical Form' },
                  { key: 'credentials', label: 'Credentials' },
                  { key: 'cbc_worksheet', label: 'CBC Worksheet' },
                  { key: 'auth_affirmation_form', label: 'Auth Affirmation Form' },
                  { key: 'mandated_reporter_cert', label: 'Mandated Reporter Cert' },
                  { key: 'preventing_sids_cert', label: 'Preventing SIDS Cert' },
                ].map(doc => (
                  staff[doc.key] ? (
                    <Col md={6} className="mb-3" key={doc.key}>
                      <div className="d-flex align-items-center justify-content-between">
                        <span>{doc.label}</span>
                        <div>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-2"
                            onClick={() => window.open(staff[doc.key], '_blank')}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = staff[doc.key];
                              link.target = '_blank';
                              link.download = doc.label;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ) : null
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Edit Button */}
          {/* <div className="text-center mt-4">
            <Button variant="" onClick={handleEditOpen} style={{ backgroundColor: reusableColor.customTextColor, color: 'white' }}>
              Edit Profile
            </Button>
          </div> */}
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditClose} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: reusableColor.customTextColor, color: 'white' }}>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h6 className="mb-3">Personal Information</h6>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control name="first_name" type="text" value={editForm.first_name || ''} onChange={handleEditChange} />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control name="last_name" type="text" value={editForm.last_name || ''} onChange={handleEditChange} />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control name="phone" type="text" value={editForm.phone || ''} onChange={handleEditChange} />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control name="email" type="email" value={editForm.email || ''} onChange={handleEditChange} />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Control name="gender" type="text" value={editForm.gender || ''} onChange={handleEditChange} />
              </Col>
            </Row>

            <hr />
            <h6 className="mb-3">Assigned Location</h6>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control name="address" type="text" value={editForm.address || ''} onChange={handleEditChange} />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Classroom</Form.Label>
                <Form.Control name="classroom_id" type="text" value={editForm.classroom_id || ''} onChange={handleEditChange} />
              </Col>
            </Row>

            <hr />
            <h6 className="mb-3">Emergency Contact</h6>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Emergency Contact</Form.Label>
                <Form.Control name="emergency_contact" type="text" value={editForm.emergency_contact || ''} onChange={handleEditChange} />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>Cancel</Button>
          <Button variant="" style={{ backgroundColor: reusableColor.customTextColor, color: 'white' }} onClick={handleEditSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StaffProfile;
