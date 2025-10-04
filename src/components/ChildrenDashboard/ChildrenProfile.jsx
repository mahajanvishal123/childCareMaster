import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Button, Form, Card, Nav, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaPhone, FaCamera, FaUserCircle } from 'react-icons/fa';
import { RiBook3Fill, RiFileUploadFill } from 'react-icons/ri';
import { reusableColor } from '../ReusableComponent/reusableColor';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import { getClassroom } from '../../redux/slices/classRoomSlice';

/** Small helper: primary color */
const pc = reusableColor?.customTextColor || '#2ab7a9';

/** Reusable Loading Button */
const LoadingButton = ({ loading, children, ...rest }) => (
  <Button disabled={loading || rest.disabled} {...rest}>
    {loading && (
      <Spinner animation="border" size="sm" className="me-2" role="status" />
    )}
    {loading ? 'Saving...' : children}
  </Button>
);

/** Safely parse a value that might be:
 * - an array of urls
 * - a single string url
 * - a JSON.stringified array of urls
 */
const toUrlArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    // Try JSON parse first
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (_) {
      /* not JSON, fall back to single URL or comma-separated */
    }
    // If comma-separated string, split
    if (value.includes(',')) {
      return value.split(',').map(s => s.trim()).filter(Boolean);
    }
    // Single URL as string
    return [value.trim()];
  }
  return [];
};

/** For saving back: keep server shape stable.
 * If original was an array-like string, send JSON.stringify(array)
 * Else if single string, send string (first item)
 */
const prepareArrayFieldForSave = (originalValue, arr) => {
  const urls = (arr || []).filter(Boolean);
  // If original looked like a JSON array string, keep that format.
  if (typeof originalValue === 'string') {
    const looksJsonArray = originalValue.trim().startsWith('[');
    if (looksJsonArray) return JSON.stringify(urls);
    // else, store single (first) or empty
    return urls[0] || '';
  }
  // If original was actually an array, keep array
  if (Array.isArray(originalValue)) return urls;
  // Fallback: JSON array string (safer)
  return JSON.stringify(urls);
};

const ChildrenProfile = () => {
  const dispatch = useDispatch();
  const { classroom } = useSelector((state) => state.classroom);

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [profile, setProfile] = useState(null); // { child, emergency_contacts, medical_info }
  const [backupProfile, setBackupProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    dispatch(getClassroom());
  }, [dispatch]);

  const user_id = useMemo(() => {
    // store as string or number in localStorage; both ok
    const raw = localStorage.getItem('user_id');
    return raw ? raw : '';
  }, []);

  const fetchChildDetails = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const response = await axios.get(`${BASE_URL}/children/${user_id}`);
      if (response?.data?.child) {
        setProfile(response.data);
        setBackupProfile(response.data);
      } else {
        setProfile({ child: {}, emergency_contacts: [], medical_info: {} });
      }
    } catch (err) {
      console.error('Error fetching child details:', err);
      setMessage({ type: 'danger', text: 'Failed to load profile.' });
      setProfile({ child: {}, emergency_contacts: [], medical_info: {} });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Input handlers */
  const handleChangeChild = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => {
      const next = { ...(prev || {}), child: { ...((prev && prev.child) || {}) } };
      // handle numeric boolean fields (0/1) if checkbox
      if (type === 'checkbox') {
        next.child[name] = checked ? 1 : 0;
      } else {
        next.child[name] = value;
      }
      return next;
    });
  };

  const handleEmergencyChange = (index, field, value) => {
    setProfile((prev) => {
      const list = [...(prev?.emergency_contacts || [])];
      list[index] = { ...(list[index] || {}), [field]: value };
      return { ...(prev || {}), emergency_contacts: list };
    });
  };

  const handleMedicalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => {
      const next = { ...(prev || {}), medical_info: { ...((prev && prev.medical_info) || {}) } };
      if (type === 'checkbox') {
        // for medical_info booleans, API sample shows 0/1 strings or numbers; normalize to 0/1
        next.medical_info[name] = checked ? 1 : 0;
      } else {
        next.medical_info[name] = value;
      }
      return next;
    });
  };

  const startEdit = () => {
    setBackupProfile(profile);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setProfile(backupProfile);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      // Prepare a clean payload matching the server
      const child = { ...(profile.child || {}) };

      // Normalize some document fields that might be arrays / JSON strings
      const lunchArr = toUrlArray(child.lunch_form_url);
      const agreeArr = toUrlArray(child.agreement_docs_url);

      child.lunch_form_url = prepareArrayFieldForSave(profile.child?.lunch_form_url, lunchArr);
      child.agreement_docs_url = prepareArrayFieldForSave(profile.child?.agreement_docs_url, agreeArr);

      const payload = {
        child,
        emergency_contacts: profile.emergency_contacts || [],
        medical_info: profile.medical_info || {},
      };

      await axios.patch(`${BASE_URL}/children/${child.user_id || child.child_id || user_id}`, payload);

      setMessage({ type: 'success', text: 'Profile updated successfully.' });

      // Refresh with latest from server
      await fetchChildDetails();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'danger', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading profile...</span>
      </div>
    );
  }

  const child = profile?.child || {};
  const emergencyContacts = profile?.emergency_contacts || [];
  const medical = profile?.medical_info || {};

  // Derived arrays for documents
  const lunchUrls = toUrlArray(child.lunch_form_url);
  const agreementUrls = toUrlArray(child.agreement_docs_url);

  return (
    <div style={{ minHeight: '80vh', padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <Card className="shadow-sm w-100" style={{ maxWidth: '1200px', borderRadius: '10px' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0" style={{ color: pc }}>Child Profile</h4>
            {!isEditing ? (
              <Button size="sm" style={{ backgroundColor: pc, border: 'none' }} onClick={startEdit}>
                Edit Profile
              </Button>
            ) : (
              <div className="d-flex gap-2">
                <Button size="sm" variant="secondary" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </Button>
                <LoadingButton
                  size="sm"
                  style={{ backgroundColor: pc, border: 'none' }}
                  onClick={handleSave}
                  loading={saving}
                >
                  Save Changes
                </LoadingButton>
              </div>
            )}
          </div>

          {message.text ? (
            <Alert variant={message.type} className="mb-3">
              {message.text}
            </Alert>
          ) : null}

          <Row>
            {/* Left Sidebar */}
            <Col xs={12} md={4} className="border-end mb-4 mb-md-0 text-center">
              <div className="mb-3">
                <div className="position-relative d-inline-block">
                  {child?.photo_url ? (
                    <img
                      src={child.photo_url}
                      alt="Child"
                      className="rounded-circle"
                      style={{ width: 100, height: 100, objectFit: 'cover', border: `3px solid ${pc}` }}
                    />
                  ) : (
                    <FaUserCircle size={90} color={pc} className="border rounded-circle bg-white p-1" />
                  )}
                  <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1" style={{ border: `2px solid ${pc}` }}>
                    <FaCamera size={14} color="#1A2423FF" />
                  </div>
                </div>
                <h6 className="fw-bold mt-2 mb-0">{(child.first_name || '').trim()} {(child.last_name || '').trim()}</h6>
                <p className="text-muted">{child?.role_name || 'Child'}</p>
              </div>

              <Nav className="flex-column">
                {['personal', 'parents', 'emergency', 'medical', 'documents', 'classroom'].map((key) => (
                  <Nav.Link
                    key={key}
                    active={activeSection === key}
                    onClick={() => setActiveSection(key)}
                    className="mb-2 rounded"
                    style={{ backgroundColor: activeSection === key ? pc : '', color: activeSection === key ? 'white' : 'black' }}
                  >
                    {key === 'personal' && <FaUser className="me-2" />}
                    {key === 'parents' && <FaUser className="me-2" />}
                    {key === 'emergency' && <FaPhone className="me-2" />}
                    {key === 'documents' && <RiFileUploadFill className="me-2" />}
                    {key === 'classroom' && <RiBook3Fill className="me-2" />}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Nav.Link>
                ))}
              </Nav>
            </Col>

            {/* Right Content */}
            <Col xs={12} md={8}>
              <Form>

                {/* Personal */}
                {activeSection === 'personal' && (
                  <Card className="mb-3">
                    <Card.Header className="fw-bold" style={{ backgroundColor: pc, color: 'white' }}>
                      Personal Information
                    </Card.Header>
                    <Card.Body>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            name="first_name"
                            value={child.first_name || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            name="last_name"
                            value={child.last_name || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            name="user_email"
                            value={child.user_email || child.email || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            name="user_phone"
                            value={child.user_phone || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={child.gender || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Col>
                        <Col md={6}>
                          <Form.Label>Enrollment Date</Form.Label>
                          <Form.Control
                            name="enrollment_date"
                            value={child.enrollment_date || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}

                {/* Parents */}
                {activeSection === 'parents' && (
                  <Card className="mb-3">
                    <Card.Header className="fw-bold" style={{ backgroundColor: pc, color: 'white' }}>
                      Parent Details
                    </Card.Header>
                    <Card.Body>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Label>Mother's Name</Form.Label>
                          <Form.Control
                            name="mother_name"
                            value={child.mother_name || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Father's Name</Form.Label>
                          <Form.Control
                            name="father_name"
                            value={child.father_name || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            name="address"
                            value={child.address || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}

                {/* Emergency */}
                {activeSection === 'emergency' && (
                  <>
                    {emergencyContacts.length === 0 && (
                      <Card className="mb-3">
                        <Card.Body className="text-muted">No emergency contacts added.</Card.Body>
                      </Card>
                    )}
                    {emergencyContacts.map((c, idx) => (
                      <Card className="mb-3" key={c.id || idx}>
                        <Card.Header className="fw-bold" style={{ backgroundColor: pc, color: 'white' }}>
                          Emergency Contact {idx + 1}
                        </Card.Header>
                        <Card.Body>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                value={c.name || ''}
                                onChange={(e) => handleEmergencyChange(idx, 'name', e.target.value)}
                                disabled={!isEditing}
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Label>Phone</Form.Label>
                              <Form.Control
                                value={c.phone || ''}
                                onChange={(e) => handleEmergencyChange(idx, 'phone', e.target.value)}
                                disabled={!isEditing}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Label>Relationship</Form.Label>
                              <Form.Control
                                value={c.relationship_to_child || ''}
                                onChange={(e) => handleEmergencyChange(idx, 'relationship_to_child', e.target.value)}
                                disabled={!isEditing}
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Label>Address</Form.Label>
                              <Form.Control
                                value={(c.address || '').trim()}
                                onChange={(e) => handleEmergencyChange(idx, 'address', e.target.value)}
                                disabled={!isEditing}
                              />
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </>
                )}

                {/* Medical */}
                {activeSection === 'medical' && (
                  <Card className="mb-3">
                    <Card.Header className="fw-bold" style={{ backgroundColor: pc, color: 'white' }}>
                      Medical Information
                    </Card.Header>
                    <Card.Body>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Label>Physician Name</Form.Label>
                          <Form.Control
                            name="physician_name"
                            value={medical.physician_name || ''}
                            onChange={handleMedicalChange}
                            disabled={!isEditing}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Physician Phone</Form.Label>
                          <Form.Control
                            name="physician_phone"
                            value={medical.physician_phone || ''}
                            onChange={handleMedicalChange}
                            disabled={!isEditing}
                          />
                        </Col>
                      </Row>
                    
                      <Row>
                        <Col md={12}>
                          <Form.Label>Medical Notes</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="medical_notes"
                            value={medical.medical_notes || ''}
                            onChange={handleMedicalChange}
                            disabled={!isEditing}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}

                {/* Documents */}
                {activeSection === 'documents' && (
                  <Card className="mb-3">
                    <Card.Header className="fw-bold" style={{ backgroundColor: pc, color: 'white' }}>
                      Documents
                    </Card.Header>
                    <Card.Body>
                      {/* Single URL docs */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Label>Medical Form URL</Form.Label>
                          <Form.Control
                            name="medical_form_url"
                            value={child.medical_form_url || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                          {child.medical_form_url ? (
                            <div className="mt-2">
                              <a href={child.medical_form_url} target="_blank" rel="noopener noreferrer">
                                View Medical Form
                              </a>
                            </div>
                          ) : null}
                        </Col>
                        <Col md={6}>
                          <Form.Label>Immunization Record URL</Form.Label>
                          <Form.Control
                            name="immunization_record_url"
                            value={child.immunization_record_url || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                          {child.immunization_record_url ? (
                            <div className="mt-2">
                              <a href={child.immunization_record_url} target="_blank" rel="noopener noreferrer">
                                View Immunization Record
                              </a>
                            </div>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Label>Auth Affirmation Form URL</Form.Label>
                          <Form.Control
                            name="auth_affirmation_form_url"
                            value={child.auth_affirmation_form_url || ''}
                            onChange={handleChangeChild}
                            disabled={!isEditing}
                          />
                          {child.auth_affirmation_form_url ? (
                            <div className="mt-2">
                              <a href={child.auth_affirmation_form_url} target="_blank" rel="noopener noreferrer">
                                View Affirmation Form
                              </a>
                            </div>
                          ) : null}
                        </Col>
                      </Row>

                      {/* Array/Multiple docs */}
                      <Row className="mb-3">
                        <Col md={12}>
                          <Form.Label>Lunch Form URLs (comma separated)</Form.Label>
                          <Form.Control
                            name="lunch_form_url"
                            value={lunchUrls.join(', ')}
                            onChange={(e) => {
                              // store as comma-separated for UI; transform on save
                              const val = e.target.value;
                              setProfile(prev => ({
                                ...prev,
                                child: { ...(prev?.child || {}), lunch_form_url: val }
                              }));
                            }}
                            disabled={!isEditing}
                          />
                          {lunchUrls.length > 0 && (
                            <ul className="mt-2 mb-0">
                              {lunchUrls.map((u, i) => (
                                <li key={i}>
                                  <a href={u} target="_blank" rel="noopener noreferrer">View Lunch Form {i + 1}</a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <Form.Label>Agreement Docs URLs (comma separated)</Form.Label>
                          <Form.Control
                            name="agreement_docs_url"
                            value={agreementUrls.join(', ')}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProfile(prev => ({
                                ...prev,
                                child: { ...(prev?.child || {}), agreement_docs_url: val }
                              }));
                            }}
                            disabled={!isEditing}
                          />
                          {agreementUrls.length > 0 && (
                            <ul className="mt-2 mb-0">
                              {agreementUrls.map((u, i) => (
                                <li key={i}>
                                  <a href={u} target="_blank" rel="noopener noreferrer">View Agreement Doc {i + 1}</a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}

                {/* Classroom */}
                {activeSection === 'classroom' && (
                  <Card className="mb-3">
                    <Card.Header className="fw-bold" style={{ backgroundColor: pc, color: 'white' }}>
                      Classroom Assignment
                    </Card.Header>
                    <Card.Body>
                      <Form.Label>Assigned Classroom</Form.Label>
                      <Form.Select
                        name="assigned_classroom"
                        value={child.assigned_classroom || ''}
                        onChange={handleChangeChild}
                        disabled={!isEditing}
                      >
                        <option value="">Select a classroom</option>
                        {Array.isArray(classroom) &&
                          classroom.map((cls) => (
                            <option key={cls.classroom_id} value={cls.classroom_id}>
                              {cls.name}
                            </option>
                          ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                )}

                {/* Save controls (duplicate for bottom visibility on small screens) */}
                {isEditing && (
                  <div className="text-end">
                    <LoadingButton
                      onClick={handleSave}
                      loading={saving}
                      style={{ backgroundColor: pc, border: 'none' }}
                    >
                      Save Changes
                    </LoadingButton>
                  </div>
                )}
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChildrenProfile;
