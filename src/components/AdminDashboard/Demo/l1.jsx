import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Dropdown,
  Pagination,
} from 'react-bootstrap';
import {
  FaEdit,
  FaTrash,
  FaFileAlt,
  FaFireAlt,
  FaDownload,
  FaCog,
  FaUserCircle,
  FaRunning,
  FaChevronDown,
} from 'react-icons/fa';
import { MdOutlineNightlight } from 'react-icons/md';
import { MdOutlineCheckroom } from 'react-icons/md';
import { FaCheckCircle, FaClock, FaExclamationCircle, FaSearch, FaPlus } from 'react-icons/fa';

const LocationManagement = () => {
  const themeColor = '#2ab7a9';
  const [activeTab, setActiveTab] = useState('Fire Drills');

  const tabs = [
    'Fire Drills',
    'Evacuation',
    'Epipen Tracker',
    'Sleep Logs',
    'Diaper Logs',
    'Maintenance',
  ];

  const fireDrillRecords = [
    {
      date: 'January 10, 2025',
      by: 'Sophia Allen',
      remark: 'Fire drill completed in 3 minutes. Smooth execution and compliance by all staff.',
    },
    {
      date: 'July 5, 2024',
      by: 'Lucas Johnson',
      remark: 'Evacuation took slightly longer than expected. Improvement in toddler room response needed.',
    },
    {
      date: 'November 21, 2023',
      by: 'Olivia Smith',
      remark: 'Overall successful drill. Emergency exits clear and used correctly.',
    },
  ];

  const evacuationRecords = [
    {
      date: 'March 15, 2025',
      by: 'Daniel Rodriguez',
      remark: 'All children safely moved to designated safe zone. Procedure completed in 4 minutes.',
    },
    {
      date: 'September 22, 2024',
      by: 'Rachel Williams',
      remark: 'Successful evacuation. Staff performed exceptionally well under simulated emergency.',
    },
    {
      date: 'March 18, 2024',
      by: 'Benjamin Taylor',
      remark: 'Evacuation completed successfully. Minor improvements needed in communication.',
    },
  ];

  const epipenRecords = [
    {
      name: 'Ethan Anderson',
      id: 'EP-2025-001',
      expiry: 'August 15, 2025',
      status: { label: 'Valid', type: 'valid' },
    },
    {
      name: 'Lily Chen',
      id: 'EP-2025-002',
      expiry: 'July 10, 2025',
      status: { label: 'Valid', type: 'valid' },
    },
    {
      name: 'Noah Williams',
      id: 'EP-2024-015',
      expiry: 'July 05, 2025',
      status: { label: 'Expires in 17 days', type: 'warning' },
    },
    {
      name: 'Sophia Garcia',
      id: 'EP-2024-010',
      expiry: 'June 30, 2025',
      status: { label: 'Expires in 12 days', type: 'warning' },
    },
    {
      name: 'Mason Brown',
      id: 'EP-2024-008',
      expiry: 'June 01, 2025',
      status: { label: 'Expired', type: 'expired' },
    },
  ];

  const sleepLogs = [
    {
      name: 'Emma Wilson',
      classroom: 'Toddlers',
      napStart: '12:30 PM',
      napEnd: '2:15 PM',
      duration: '1h 45m',
      notes: 'Slept well, woke up happy',
    },
    {
      name: 'Oliver Smith',
      classroom: 'Toddlers',
      napStart: '12:45 PM',
      napEnd: '2:30 PM',
      duration: '1h 45m',
      notes: 'Needed help falling asleep',
    },
    {
      name: 'Ava Johnson',
      classroom: 'Preschool',
      napStart: '1:00 PM',
      napEnd: '2:45 PM',
      duration: '1h 45m',
      notes: 'Restless sleep today',
    },
    {
      name: 'Liam Martinez',
      classroom: 'Preschool',
      napStart: '12:30 PM',
      napEnd: '2:15 PM',
      duration: '1h 45m',
      notes: 'Slept with favorite toy',
    },
    {
      name: 'Sophia Davis',
      classroom: 'Pre-K',
      napStart: '1:00 PM',
      napEnd: '2:30 PM',
      duration: '1h 30m',
      notes: 'Did not want to nap initially',
    },
  ];

  const diaperLogs = [
    {
      name: 'Noah Thompson',
      classroom: 'Infants',
      time: '11:30 AM',
      changedBy: 'Sarah Johnson',
      type: 'Wet',
      notes: 'No rash observed',
    },
    {
      name: 'Charlotte Lee',
      classroom: 'Infants',
      time: '10:45 AM',
      changedBy: 'Michael Rodriguez',
      type: 'Wet & Soiled',
      notes: 'Applied diaper cream',
    },
    {
      name: 'Ethan Williams',
      classroom: 'Toddlers',
      time: '9:30 AM',
      changedBy: 'Jessica Taylor',
      type: 'Wet',
      notes: 'No issues',
    },
    {
      name: 'Amelia Garcia',
      classroom: 'Infants',
      time: '8:45 AM',
      changedBy: 'David Wilson',
      type: 'Wet',
      notes: 'Slight redness, monitoring',
    },
    {
      name: 'Lucas Brown',
      classroom: 'Toddlers',
      time: '8:15 AM',
      changedBy: 'Emily Martinez',
      type: 'Soiled',
      notes: 'Changed without issues',
    },
  ];

  const maintenanceRequests = [
    {
      title: 'Broken light fixture',
      location: 'Toddler Room 2',
      date: 'June 15, 2025',
      priority: 'Medium',
      status: 'Open',
      assigned: 'Robert Jenkins',
    },
    {
      title: 'Leaking faucet in bathroom',
      location: 'Pre-K Bathroom',
      date: 'June 14, 2025',
      priority: 'Medium',
      status: 'Open',
      assigned: 'Thomas Garcia',
    },
    {
      title: 'AC not cooling properly',
      location: 'Infant Room 1',
      date: 'June 12, 2025',
      priority: 'High',
      status: 'Open',
      assigned: 'HVAC Specialists',
    },
    {
      title: 'Playground equipment repair',
      location: 'Outdoor Playground',
      date: 'June 10, 2025',
      priority: 'High',
      status: 'Open',
      assigned: 'PlaySafe Inc.',
    },
    {
      title: 'Replace carpet in reading area',
      location: 'Pre-K Room',
      date: 'June 8, 2025',
      priority: 'Low',
      status: 'Open',
      assigned: 'Floor Solutions',
    },
    {
      title: 'Door handle replacement',
      location: 'Staff Room',
      date: 'June 5, 2025',
      priority: 'Low',
      status: 'Closed',
      assigned: 'Robert Jenkins',
    },
  ];

  const getPriorityBadge = (priority) => {
    if (priority === 'High')
      return <span className="maint-badge maint-badge-high">High</span>;
    if (priority === 'Medium')
      return <span className="maint-badge maint-badge-medium">Medium</span>;
    return <span className="maint-badge maint-badge-low">Low</span>;
  };

  const getStatusBadge = (status) => {
    if (status === 'Open')
      return <span className="maint-badge maint-badge-status maint-badge-open">Open</span>;
    return <span className="maint-badge maint-badge-status maint-badge-closed">Closed</span>;
  };

  return (
    <Container fluid className="p-2 p-md-4 bg-light min-vh-100">
      {/* Header */}
      <Row className="mb-3 mb-md-4 align-items-center justify-content-between flex-column flex-md-row">
        <Col xs="auto">
          <h4 className="fw-bold mb-2 mb-md-0" style={{ color: themeColor }}>
            Location Management
          </h4>
        </Col>
        <Col xs="auto" className="d-flex align-items-center gap-3">
          <FaDownload className="fs-5 text-muted" />
          <FaCog className="fs-5 text-muted" />
          <FaUserCircle className="fs-5 text-muted" />
        </Col>
      </Row>

      {/* Tabs */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex gap-3 gap-md-4 border-bottom pb-2 flex-wrap">
            {tabs.map((tab) => (
              <span
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`fw-semibold pb-1 cursor-pointer ${
                  activeTab === tab ? 'border-bottom' : 'text-muted'
                }`}
                style={
                  activeTab === tab
                    ? {
                        color: themeColor,
                        borderBottom: `2px solid ${themeColor}`,
                        cursor: 'pointer',
                      }
                    : { cursor: 'pointer' }
                }
              >
                {tab === 'Fire Drills' && <FaFireAlt className="me-1" />}
                {tab === 'Evacuation' && <FaRunning className="me-1" />}
                {tab}
              </span>
            ))}
          </div>
        </Col>
      </Row>

      {/* Fire Drills Tab Content */}
      {activeTab === 'Fire Drills' && (
        <>
          <Row className="mb-3 align-items-center justify-content-between">
            <Col md={6}>
              <h5 className="fw-semibold">Fire Drill Records</h5>
              <p className="text-muted small">Regular fire safety drills and documentation</p>
            </Col>
            <Col md={6} className="d-flex justify-content-end align-items-center gap-2">
              <InputGroup style={{ maxWidth: '250px' }}>
                <Form.Control placeholder="Search fire drills..." />
              </InputGroup>
              <Button style={{ backgroundColor: themeColor, borderColor: themeColor }}>
                + Add Fire Drill
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <FaFireAlt style={{ color: themeColor }} />
                  <strong className="text-dark">Fire Drill History</strong>
                </div>
                <div className="small" style={{ color: themeColor }}>
                  Last conducted: January 10, 2025
                </div>
              </div>

              <Table responsive bordered hover className="align-middle">
                <thead style={{ backgroundColor: '#e6f7f5' }}>
                  <tr className="small text-dark">
                    <th className="text-center"><Form.Check /></th>
                    <th>Date</th>
                    <th>Conducted By</th>
                    <th>Remarks</th>
                    <th>Document</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fireDrillRecords.map((item, idx) => (
                    <tr key={idx} className="text-dark">
                      <td className="text-center"><Form.Check /></td>
                      <td>{item.date}</td>
                      <td>{item.by}</td>
                      <td>{item.remark}</td>
                      <td style={{ color: themeColor, fontWeight: '600' }}>
                        <FaFileAlt className="me-1" /> View Report
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-3">
                          <FaEdit style={{ color: themeColor, cursor: 'pointer' }} title="Edit" />
                          <FaTrash style={{ color: '#dc3545', cursor: 'pointer' }} title="Delete" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-muted small">Showing 3 of 6 records</span>
                <Pagination className="mb-0">
                  <Pagination.Prev />
                  <Pagination.Next />
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Evacuation Tab Content */}
      {activeTab === 'Evacuation' && (
        <>
          <Row className="mb-3 align-items-center justify-content-between">
            <Col md={6}>
              <h5 className="fw-semibold">Evacuation In-Place</h5>
              <p className="text-muted small">Bi-annual evacuation drills and records</p>
            </Col>
            <Col md={6} className="d-flex justify-content-end align-items-center gap-2">
              <InputGroup style={{ maxWidth: '250px' }}>
                <Form.Control placeholder="Search evacuations..." />
              </InputGroup>
              <Button style={{ backgroundColor: themeColor, borderColor: themeColor }}>
                + Add New Record
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <FaRunning style={{ color: themeColor }} />
                  <strong className="text-dark">Evacuation Records</strong>
                </div>
                <div className="small" style={{ color: themeColor }}>
                  Next evacuation due: September 15, 2025
                </div>
              </div>

              <Table responsive bordered hover className="align-middle">
                <thead style={{ backgroundColor: '#e6f7f5' }}>
                  <tr className="small text-dark">
                    <th className="text-center"><Form.Check /></th>
                    <th>Date</th>
                    <th>Conducted By</th>
                    <th>Remarks</th>
                    <th>Document</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {evacuationRecords.map((item, idx) => (
                    <tr key={idx} className="text-dark">
                      <td className="text-center"><Form.Check /></td>
                      <td>{item.date}</td>
                      <td>{item.by}</td>
                      <td>{item.remark}</td>
                      <td style={{ color: themeColor, fontWeight: '600' }}>
                        <FaFileAlt className="me-1" /> View Report
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-3">
                          <FaEdit style={{ color: themeColor, cursor: 'pointer' }} title="Edit" />
                          <FaTrash style={{ color: '#dc3545', cursor: 'pointer' }} title="Delete" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-muted small">Showing 3 of 6 records</span>
                <Pagination className="mb-0">
                  <Pagination.Prev />
                  <Pagination.Next />
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Epipen Tracker Tab Content */}
      {activeTab === 'Epipen Tracker' && (
        <>
          <Row className="mb-3 align-items-center justify-content-between">
            <Col md={6}>
              <h5 className="fw-semibold">Epipen Expiration Tracker</h5>
              <p className="text-muted small">Monitor and manage epipens for all children</p>
            </Col>
            <Col md={6} className="d-flex justify-content-end align-items-center gap-2">
              <InputGroup style={{ maxWidth: '250px' }}>
                <Form.Control placeholder="Search by child name..." />
              </InputGroup>
              <Button style={{ backgroundColor: themeColor, borderColor: themeColor }}>
                + Add New Epipen
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="epipen-card-icon d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10" style={{ width: 38, height: 38 }}>
                    <i className="ri-capsule-line text-success" style={{ fontSize: 20 }}></i>
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: 16 }}>Epipen Inventory</div>
                    <div className="text-danger small">2 epipens expiring soon</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                  <button className="btn btn-light epipen-filter-btn" title="Filter">
                    <i className="ri-filter-3-line"></i>
                  </button>
                  <button className="btn btn-light epipen-export-btn" title="Export">
                    <i className="ri-download-2-line"></i>
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle epipen-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>
                        <input type="checkbox" />
                      </th>
                      <th>Child Name</th>
                      <th>Epipen ID</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {epipenRecords.map((rec, idx) => (
                      <tr key={idx}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>{rec.name}</td>
                        <td>{rec.id}</td>
                        <td>{rec.expiry}</td>
                        <td>
                          {rec.status.type === 'valid' && (
                            <span className="badge epipen-badge-valid">{rec.status.label}</span>
                          )}
                          {rec.status.type === 'warning' && (
                            <span className="badge epipen-badge-warning">{rec.status.label}</span>
                          )}
                          {rec.status.type === 'expired' && (
                            <span className="badge epipen-badge-expired">{rec.status.label}</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-3">
                            <FaEdit
                              style={{ color: '#2ab7a9', cursor: 'pointer', fontSize: 18 }}
                              title="Edit"
                            />
                            <FaTrash
                              style={{ color: '#dc3545', cursor: 'pointer', fontSize: 18 }}
                              title="Delete"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 mt-3">
                <div className="text-secondary small">Showing 5 of 15 records</div>
                <nav>
                  <ul className="pagination pagination-sm mb-0 epipen-pagination">
                    <li className="page-item">
                      <button className="page-link epipen-page-btn">Previous</button>
                    </li>
                    <li className="page-item active">
                      <button className="page-link epipen-page-btn">Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Sleep Logs Tab Content */}
      {activeTab === 'Sleep Logs' && (
        <>
          <Row className="mb-3 align-items-center justify-content-between">
            <Col xs={12} md={8}>
              <h4 className="sleeplogs-title fw-bold mb-1">Sleep Logs</h4>
              <div className="sleeplogs-subtitle text-muted mb-3">Track children's nap times and patterns</div>
            </Col>
            <Col xs={12} md={4} className="d-flex justify-content-md-end align-items-center mb-3 mb-md-0">
              <InputGroup className="sleeplogs-search-group me-2">
                <Form.Control placeholder="Search by child name..." className="sleeplogs-search" />
              </InputGroup>
              <Button className="sleeplogs-add-btn d-flex align-items-center">
                + Add Sleep Log
              </Button>
            </Col>
          </Row>
          <Card className="sleeplogs-card border-0 shadow-sm">
            <Card.Body className="p-0">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center p-3 pb-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="sleeplogs-records-icon d-flex align-items-center justify-content-center rounded-circle">
                    <MdOutlineNightlight size={20} color="#2ab7a9" /> {/* size 28 -> 20 */}
                  </div>
                  <div>
                    <div className="fw-bold sleeplogs-records-title">Sleep Records</div> {/* fw-semibold -> fw-bold */}
                    <div className="text-muted sleeplogs-records-date">Today: June 18, 2025</div>
                  </div>
                </div>
                <div className="d-flex flex-column flex-md-row gap-2 mt-3 mt-md-0">
                  <Form.Select className="sleeplogs-filter">
                    <option>All Classrooms</option>
                    <option>Toddlers</option>
                    <option>Preschool</option>
                    <option>Pre-K</option>
                  </Form.Select>
                  <Form.Select className="sleeplogs-filter">
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </Form.Select>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center px-3 pt-2 pb-0">
                <Button variant="link" className="sleeplogs-export-btn p-0">
                  <FaChevronDown size={18} />
                </Button>
              </div>
              <div className="table-responsive">
                <Table className="sleeplogs-table mb-0">
                  <thead>
                    <tr>
                      <th>
                        <Form.Check type="checkbox" />
                      </th>
                      <th>Child Name</th>
                      <th>Classroom</th>
                      <th>Nap Start</th>
                      <th>Nap End</th>
                      <th>Duration</th>
                      <th>Notes</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sleepLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td>
                          <Form.Check type="checkbox" />
                        </td>
                        <td>{log.name}</td>
                        <td>{log.classroom}</td>
                        <td>{log.napStart}</td>
                        <td>{log.napEnd}</td>
                        <td>{log.duration}</td>
                        <td>{log.notes}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <FaEdit className="sleeplogs-action-edit" size={16} title="Edit" />
                            <FaTrash className="sleeplogs-action-delete" size={16} title="Delete" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3 pt-2">
                <div className="text-muted small">Showing 5 of 18 records</div>
                <Pagination className="mb-0 sleeplogs-pagination">
                  <Pagination.Prev className="sleeplogs-page-btn">Previous</Pagination.Prev>
                  <Pagination.Next className="sleeplogs-page-btn">Next</Pagination.Next>
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Diaper Logs Tab Content */}
      {activeTab === 'Diaper Logs' && (
        <>
          <Row className="mb-3 align-items-center justify-content-between">
            <Col md={6}>
              <h5 className="fw-semibold">Diaper Change Records</h5>
              <p className="text-muted small">Track diaper changes for infants and toddlers</p>
            </Col>
            <Col md={6} className="d-flex justify-content-end align-items-center gap-2">
              <InputGroup style={{ maxWidth: '250px' }}>
                <Form.Control placeholder="Search by child name..." />
              </InputGroup>
              <Button style={{ backgroundColor: themeColor, borderColor: themeColor }}>
                + Add Diaper Log
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="diaperlogs-records-icon d-flex align-items-center justify-content-center rounded-circle">
                    <MdOutlineCheckroom size={22} color="#2ab7a9" />
                  </div>
                  <div>
                    <div className="fw-bold diaperlogs-records-title">
                      Diaper Change Records
                    </div>
                    <div className="text-muted diaperlogs-records-date">
                      Today: June 18, 2025
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                  <button className="btn btn-light diaperlogs-filter-btn" title="Filter">
                    <i className="ri-filter-3-line"></i>
                  </button>
                  <button className="btn btn-light diaperlogs-export-btn" title="Export">
                    <i className="ri-download-2-line"></i>
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <Table className="diaperlogs-table mb-0">
                  <thead>
                    <tr>
                      <th>
                        <Form.Check type="checkbox" />
                      </th>
                      <th>Child Name</th>
                      <th>Classroom</th>
                      <th>Time</th>
                      <th>Changed By</th>
                      <th>Type</th>
                      <th>Notes</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diaperLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td>
                          <Form.Check type="checkbox" />
                        </td>
                        <td>{log.name}</td>
                        <td>{log.classroom}</td>
                        <td>{log.time}</td>
                        <td>{log.changedBy}</td>
                        <td>{log.type}</td>
                        <td>{log.notes}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <FaEdit
                              className="diaperlogs-action-edit"
                              size={16}
                              title="Edit"
                            />
                            <FaTrash
                              className="diaperlogs-action-delete"
                              size={16}
                              title="Delete"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3 pt-2">
                <div className="text-muted small">
                  Showing 5 of 22 records
                </div>
                <Pagination className="mb-0 diaperlogs-pagination">
                  <Pagination.Prev>Previous</Pagination.Prev>
                  <Pagination.Next>Next</Pagination.Next>
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Maintenance Tab Content */}
      {activeTab === 'Maintenance' && (
        <>
          <Row className="mb-3 align-items-center justify-content-between">
            <Col md={6}>
              <h5 className="fw-semibold">Maintenance Requests</h5>
              <p className="text-muted small">All facility maintenance tasks</p>
            </Col>
            <Col md={6} className="d-flex justify-content-end align-items-center gap-2">
              <InputGroup style={{ maxWidth: '250px' }}>
                <Form.Control placeholder="Search requests..." />
              </InputGroup>
              <Button style={{ backgroundColor: themeColor, borderColor: themeColor }}>
                <FaPlus className="me-1" /> New Request
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="maint-table-title-icon">
                    <FaCheckCircle size={22} color="#2ab7a9" />
                  </div>
                  <div>
                    <div className="fw-bold maint-table-title">Maintenance Requests</div>
                    <div className="text-muted maint-table-subtitle">All facility maintenance tasks</div>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <Table className="align-middle maint-table mb-0">
                  <thead>
                    <tr>
                      <th>
                        <Form.Check type="checkbox" />
                      </th>
                      <th>Request Title</th>
                      <th>Location/Room</th>
                      <th>Date Reported</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceRequests.map((req, idx) => (
                      <tr key={idx}>
                        <td>
                          <Form.Check type="checkbox" />
                        </td>
                        <td>{req.title}</td>
                        <td>{req.location}</td>
                        <td>{req.date}</td>
                        <td>{getPriorityBadge(req.priority)}</td>
                        <td>{getStatusBadge(req.status)}</td>
                        <td>{req.assigned}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <FaEdit className="maint-action-edit" size={16} title="Edit" />
                            <FaTrash className="maint-action-delete" size={16} title="Delete" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 pt-3">
                <div className="text-muted small">Showing 6 of 17 records</div>
                <Pagination className="mb-0 maint-pagination">
                  <Pagination.Prev className="maint-page-btn">Previous</Pagination.Prev>
                  <Pagination.Next className="maint-page-btn">Next</Pagination.Next>
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </>
      )}

    

      {/* Inline CSS for unique classes */}
      <style>{`
        .epipen-title {
          font-size: 1.3rem;
        }
        .epipen-card {
          border: 1px solid #f1f3f6;
        }
        .epipen-card-icon {
          width: 38px;
          height: 38px;
        }
        .epipen-add-btn {
          min-width: 140px;
        }
        .epipen-table th, .epipen-table td {
          vertical-align: middle;
        }
        .epipen-badge-valid {
          background: #e6f7ec;
          color: #34c77b;
          font-weight: 500;
        }
        .epipen-badge-warning {
          background: #fff9db;
          color: #f7b731;
          font-weight: 500;
        }
        .epipen-badge-expired {
          background: #ffe6e6;
          color: #ff6b6b;
          font-weight: 500;
        }
        .epipen-action-btn i {
          font-size: 1.2rem;
        }
        .epipen-pagination .page-link {
          border-radius: 20px;
          min-width: 80px;
          color: #20bfa9;
          border: 1px solid #20bfa9;
          background: #fff;
        }
        .epipen-pagination .active .page-link {
          background: #20bfa9;
          color: #fff;
          border: 1px solid #20bfa9;
        }
        .sleeplogs-bg {
          background: #f7f8fa;
        }
        .sleeplogs-title {
          font-size: 1.3rem;
        }
        .sleeplogs-subtitle {
          font-size: 1rem;
        }
        .sleeplogs-card {
          border-radius: 16px;
          background: #fff;
        }
        .sleeplogs-records-icon {
          width: 44px;
          height: 44px;
          background: #e6f7f5;
        }
        .sleeplogs-records-title {
          font-size: 1.08rem;
        }
        .sleeplogs-records-date {
          font-size: 0.95rem;
        }
        .sleeplogs-search-group {
          max-width: 220px;
        }
        .sleeplogs-search {
          border-radius: 8px;
          font-size: 0.98rem;
        }
        .sleeplogs-add-btn {
          background: #2ab7a9;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.45rem 1.1rem;
        }
        .sleeplogs-add-btn:hover {
          background: #229e93;
        }
        .sleeplogs-filter {
          min-width: 140px;
          border-radius: 8px;
          font-size: 0.97rem;
        }
        .sleeplogs-export-btn {
          color: #2ab7a9;
        }
        .sleeplogs-table th, .sleeplogs-table td {
          vertical-align: middle;
          font-size: 0.98rem;
        }
        .sleeplogs-table th {
          background: #f7f8fa;
          font-weight: 600;
        }
        .sleeplogs-action-edit {
          color: #2ab7a9;
          cursor: pointer;
        }
        .sleeplogs-action-delete {
          color: #dc3545;
          cursor: pointer;
        }
        .sleeplogs-pagination .page-link {
          border-radius: 20px;
          min-width: 80px;
          color: #2ab7a9;
          border: 1px solid #2ab7a9;
          background: #fff;
        }
        .sleeplogs-pagination .active .page-link,
        .sleeplogs-pagination .page-link:focus {
          background: #2ab7a9;
          color: #fff;
          border: 1px solid #2ab7a9;
        }
        .sleeplogs-pagination .sleeplogs-page-btn:hover {
          background: #20bfa9 !important;
          color: #fff !important;
          border-color: #20bfa9 !important;
        }
        .diaperlogs-bg {
          background: #f7f8fa;
        }
        .diaperlogs-title {
          font-size: 1.3rem;
        }
        .diaperlogs-subtitle {
          font-size: 1rem;
        }
        .diaperlogs-card {
          border-radius: 16px;
          background: #fff;
        }
        .diaperlogs-records-icon {
          width: 44px;
          height: 44px;
          background: #e6f7f5;
        }
        .diaperlogs-records-title {
          font-size: 1.08rem;
        }
        .diaperlogs-records-date {
          font-size: 0.95rem;
        }
        .diaperlogs-search-group {
          max-width: 220px;
        }
        .diaperlogs-search {
          border-radius: 8px;
          font-size: 0.98rem;
        }
        .diaperlogs-add-btn {
          background: #2ab7a9;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.45rem 1.1rem;
        }
        .diaperlogs-add-btn:hover {
          background: #229e93;
        }
        .diaperlogs-filter {
          min-width: 140px;
          border-radius: 8px;
          font-size: 0.97rem;
        }
        .diaperlogs-export-btn {
          color: #2ab7a9;
        }
        .diaperlogs-table th, .diaperlogs-table td {
          vertical-align: middle;
          font-size: 0.98rem;
        }
        .diaperlogs-table th {
          background: #f7f8fa;
          font-weight: 600;
        }
        .diaperlogs-action-edit {
          color: #2ab7a9;
          cursor: pointer;
        }
        .diaperlogs-action-delete {
          color: #dc3545;
          cursor: pointer;
        }
        .diaperlogs-pagination .diaperlogs-page-btn {
          border-radius: 12px !important;
          min-width: 80px;
          font-size: 1.08rem;
          font-weight: 500;
          border: 2px solid #e6e6e6 !important;
          background: #fff !important;
          color: #2ab7a9 !important;
          margin-right: 8px;
          transition: background 0.2s, color 0.2s;
        }
        .diaperlogs-pagination .diaperlogs-page-next {
          background: #2ab7a9 !important;
          color: #fff !important;
          border: 2px solidrgb(182, 228, 224) !important;
          margin-right: 0;
        }
        .diaperlogs-pagination .diaperlogs-page-btn:hover {
          background: #20bfa9 !important;
          color: #fff !important;
          border-color: #20bfa9 !important;
        }
        .diaperlogs-pagination .page-link {
          background: #2ab7a9 !important;
          color: #fff !important;
          border: 1px solid #2ab7a9 !important;
          border-radius: 20px !important;
        }
        .diaperlogs-pagination .page-link:hover,
        .diaperlogs-pagination .page-link:focus {
          background: #229e93 !important;
          color: #fff !important;
          border-color: #229e93 !important;
        }
        .maintenance-tab-bg {
          background: #f8fafb;
          min-height: 100vh;
          padding-bottom: 2rem;
        }
        .maint-summary-card {
          border-radius: 16px;
          background: #fff;
          min-height: 90px;
        }
        .maint-summary-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .maint-summary-icon-open {
          background: #e6f7f5;
          color: #2ab7a9;
        }
        .maint-summary-icon-completed {
          background: #e6f7ec;
          color: #34c77b;
        }
        .maint-summary-icon-urgent {
          background: #fff9db;
          color: #f7b731;
        }
        .maint-summary-value {
          font-size: 1.4rem;
          font-weight: 700;
        }
        .maint-summary-label {
          font-size: 1rem;
          color: #7b8a99;
        }
        .maint-summary-bar {
          height: 6px;
          border-radius: 4px;
          margin-top: 8px;
          width: 100%;
          background: #f1f3f6;
        }
        .maint-summary-bar-open {
          background: linear-gradient(90deg, #2ab7a9 70%, #f1f3f6 70%);
        }
        .maint-summary-bar-completed {
          background: linear-gradient(90deg, #34c77b 85%, #f1f3f6 85%);
        }
        .maint-summary-bar-urgent {
          background: linear-gradient(90deg, #f7b731 40%, #f1f3f6 40%);
        }
        .maint-table-card {
          border-radius: 16px;
          background: #fff;
          margin-top: 1.5rem;
        }
        .maint-table-title-icon {
          background: #e6f7f5;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
        }
        .maint-table-title {
          font-size: 1.1rem;
        }
        .maint-table-subtitle {
          font-size: 0.97rem;
        }
        .maint-search-group {
          max-width: 220px;
        }
        .maint-search-input {
          border-radius: 8px;
          font-size: 0.98rem;
        }
        .maint-add-btn {
          background: #2ab7a9;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.45rem 1.1rem;
        }
        .maint-add-btn:hover {
          background: #229e93;
        }
        .maint-table th, .maint-table td {
          vertical-align: middle;
          font-size: 0.98rem;
        }
        .maint-table th {
          background: #f7f8fa;
          font-weight: 600;
        }
        .maint-badge {
          display: inline-block;
          padding: 0.25em 0.7em;
          border-radius: 12px;
          font-size: 0.93em;
          font-weight: 500;
        }
        .maint-badge-high {
          background: #ffe6e6;
          color: #ff6b6b;
        }
        .maint-badge-medium {
          background: #fff9db;
          color: #f7b731;
        }
        .maint-badge-low {
          background: #e6f7ec;
          color: #34c77b;
        }
        .maint-badge-status {
          background: #e6f7f5;
          color: #2ab7a9;
        }
        .maint-badge-open {
          background: #e6f7f5;
          color: #2ab7a9;
        }
        .maint-badge-closed {
          background: #f1f3f6;
          color: #7b8a99;
        }
        .maint-action-edit {
          color: #2ab7a9;
          cursor: pointer;
        }
        .maint-action-delete {
          color: #dc3545;
          cursor: pointer;
        }
        .maint-pagination .page-link {
          border-radius: 20px;
          min-width: 80px;
          color: #2ab7a9;
          border: 1px solid #2ab7a9;
          background: #fff;
        }
        .maint-pagination .active .page-link,
        .maint-pagination .page-link:focus {
          background: #2ab7a9;
          color: #fff;
          border: 1px solid #2ab7a9;
        }
        .maint-pagination .maint-page-btn:hover {
          background: #20bfa9 !important;
          color: #fff !important;
          border-color: #20bfa9 !important;
        }
        @media (max-width: 768px) {
          .sleeplogs-title,
          .diaperlogs-title,
          .maint-table-title {
            font-size: 1.1rem;
          }
          .sleeplogs-subtitle,
          .diaperlogs-subtitle,
          .maint-table-subtitle {
            font-size: 0.95rem;
          }
          .sleeplogs-card,
          .diaperlogs-card,
          .maint-table-card {
            border-radius: 10px;
            padding: 0.5rem !important;
          }
          .sleeplogs-records-icon,
          .diaperlogs-records-icon {
            width: 36px;
            height: 36px;
          }
          .sleeplogs-add-btn,
          .diaperlogs-add-btn,
          .maint-add-btn {
            font-size: 0.95rem;
            padding: 0.35rem 0.8rem;
            width: 100%;
            margin-top: 0.5rem;
          }
          .sleeplogs-search-group,
          .diaperlogs-search-group,
          .maint-search-group {
            max-width: 100%;
            margin-bottom: 0.5rem;
          }
          .sleeplogs-filter,
          .diaperlogs-filter {
            min-width: 100px;
            font-size: 0.93rem;
          }
          .table-responsive {
            overflow-x: auto;
          }
          .epipen-table,
          .sleeplogs-table,
          .diaperlogs-table,
          .maint-table {
            font-size: 0.93rem;
          }
          .epipen-pagination .page-link,
          .sleeplogs-pagination .page-link,
          .maint-pagination .page-link {
            min-width: 60px;
            font-size: 0.95rem;
          }
          .d-flex.gap-4 {
            gap: 1rem !important;
          }
        }
        @media (max-width: 480px) {
          .sleeplogs-title,
          .diaperlogs-title,
          .maint-table-title {
            font-size: 1rem;
          }
          .sleeplogs-subtitle,
          .diaperlogs-subtitle,
          .maint-table-subtitle {
            font-size: 0.9rem;
          }
          .sleeplogs-add-btn,
          .diaperlogs-add-btn,
          .maint-add-btn {
            font-size: 0.9rem;
            padding: 0.3rem 0.6rem;
          }
          .table th, .table td {
            font-size: 0.9rem;
          }
        }
      `}</style>
      {/* Remix Icon CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
        rel="stylesheet"
      />
    </Container>
  );
};

export default LocationManagement;
