import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FaArrowRight, FaFileMedical, FaCertificate, FaFingerprint, FaPlus, FaFileAlt } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { BASE_URL } from '../../utils/config';
import './DocumentsPanel.css';

const documentFields = [
  { key: 'medical_form', label: 'Medical Form', icon: <FaFileMedical /> },
  { key: 'credentials', label: 'Credentials', icon: <FaCertificate /> },
  { key: 'cbc_worksheet', label: 'CBC Worksheet', icon: <FaFileAlt /> },
  { key: 'auth_affirmation_form', label: 'Auth Affirmation Form', icon: <FaFileAlt /> },
  { key: 'mandated_reporter_cert', label: 'Mandated Reporter Cert', icon: <FaFileAlt /> },
  { key: 'preventing_sids_cert', label: 'Preventing SIDS Cert', icon: <FaFileAlt /> },
];

const DocumentsPanel = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user_id from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.user_id;

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`${BASE_URL}/teachers/${userId}`);
        setStaff(res.data);
      } catch (err) {
        setStaff(null);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchStaff();
  }, [userId]);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.esem')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        console.log('File content:', content);
        // You can parse/display the file content here
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid .esem file');
    }
  };
  return (
    <div className="documents-container text-black">
      <Container>
        <h4 className="mb-1">My Documents</h4>
        <p className="text-black-50 mb-4">Manage and view your important documents</p>

        {/* Document Categories */}
        {/* <Card className="doc-card border">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="doc-icon bg-primary-subtle">
                <FaFileMedical />
              </div>
              <div>
                <h6 className="fw-semibold mb-2">Medical Certificate</h6>
                <small className="text-muted">View your uploaded medical documents and certificates</small>
              </div>
            </div>
            <FaArrowRight />
          </Card.Body>
        </Card> */}

        {/* <Card className="doc-card border">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="doc-icon bg-info-subtle">
                <FaCertificate />
              </div>
              <div>
                <h6 className="fw-semibold mb-2">Training/Certification</h6>
                <small className="text-muted">Access your training records and professional certifications</small>
              </div>
            </div>
            <FaArrowRight />
          </Card.Body>
        </Card> */}

        {/* <Card className="doc-card border">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="doc-icon bg-success-subtle">
                <FaFingerprint />
              </div>
              <div>
                <h6 className="fw-semibold mb-2">Fingerprint/ID</h6>
                <small className="text-muted">View your identification documents and biometric data</small>
              </div>
            </div>
            <FaArrowRight />
          </Card.Body>
        </Card> */}

        {/* Staff Documents Section */}
        <Card className="doc-card border mb-3">
          <Card.Body>
            <h6 className="fw-bold mb-3">Available Documents</h6>
            {loading && <div>Loading...</div>}
            {!loading && staff && (
              <Row>
                {documentFields.map(doc =>
                  staff[doc.key] ? (
                    <Col md={6} className="mb-3" key={doc.key}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <span>{doc.icon}</span>
                          <span>{doc.label}</span>
                        </div>
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
                )}
                {!documentFields.some(doc => staff[doc.key]) && (
                  <Col>
                    <div className="text-muted">No documents available.</div>
                  </Col>
                )}
              </Row>
            )}
          </Card.Body>
        </Card>

        {/* Recent Activity */}
        {/* <Card className="doc-card border">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Recent Activity</h6>
              <a href="#" className="text-primary small">View All</a>
            </div>
            <ul className="recent-list">
              <li>
                <h6 className="mb-1 fw-normal">Medical Certificate uploaded</h6>
                <small className="text-muted">June 18, 2025</small>
              </li>
              <li>
                <h6 className="mb-1 fw-normal">Training Certificate updated</h6>
                <small className="text-muted">June 15, 2025</small>
              </li>
              <li>
                <h6 className="mb-1 fw-normal">ID document viewed</h6>
                <small className="text-muted">June 10, 2025</small>
              </li>
            </ul>
          </Card.Body>
        </Card> */}

        {/* Upload Button */}
        {/* Upload Button - Small & Centered */}
        {/* <Card className="upload-box text-center mt-1 ">
          <Card.Body>
            <Form.Group controlId="formFile" className="d-flex flex-column align-items-center gap-1">
              <Form.Label className="fw-semibold mb-1">Upload New Document</Form.Label>
              <Form.Control
                type="file"
                accept=".esem"
                onChange={handleFileChange}
                size="sm" // Small input size
                style={{ maxWidth: '300px' }} // Limit width
              />
            </Form.Group>
          </Card.Body>
        </Card> */}

      </Container>
    </div>
  );
};

export default DocumentsPanel;
