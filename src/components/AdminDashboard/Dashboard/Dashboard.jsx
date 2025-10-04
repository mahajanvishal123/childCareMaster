import React, { useState, useEffect } from "react";
import html2pdf from 'html2pdf.js';
import './Dashboard.css';
// ...rest of your code...
// ...rest of your code...

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  Modal,
} from "react-bootstrap";
import {
  FaUserAlt,
  FaChalkboardTeacher,
  FaChild,
  FaBirthdayCake,
  FaVenusMars,
  FaCalendarAlt,
  FaBell
} from "react-icons/fa";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { reusableColor } from "../reusableColor";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";

const Dashboard = () => {



  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Dynamic data states
  const [childrenStats, setChildrenStats] = useState(null);
  const [teacherStats, setTeacherStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);


  console.log("childrenStats", childrenStats);
  console.log("teacherStats", teacherStats);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [childrenRes, teacherRes] = await Promise.all([
          axios.get(`${BASE_URL}/dashboard/children-stats`),
          axios.get(`${BASE_URL}/dashboard/teacher-stats`)
        ]);

        console.log("childrenRes", childrenRes);
        console.log("teacherRes", teacherRes);
        setChildrenStats(childrenRes.data); // childrenRes.data is the stats object
        setTeacherStats(teacherRes.data.data); // teacherRes.data.data is the stats object
      } catch (err) {
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    // Fetch recent activities
    const fetchActivities = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/dashboard`);
        // Map API response to UI format
        const iconMap = {
          Enrollment: <FaUserAlt className="text-success" />, // You can expand this map as needed
          Training: <FaChalkboardTeacher className="text-primary" />,
          Meeting: <FaCalendarAlt className="text-warning" />,
          Health: <FaBell className="text-info" />
        };
        const activities = res.data.map((item) => ({
          id: item.id,
          date: new Date(item.time).toLocaleString(),
          activity: item.activity,
          type: item.type,
          icon: iconMap[item.type] || <FaUserAlt className="text-secondary" />
        }));
        setRecentActivities(activities);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchActivities();
  }, []);

  // Transform API data for UI
  const getSchoolStats = () => {
    if (!childrenStats || !teacherStats) return [];
    return [
      {
        title: "Total Children",
        value: childrenStats.totalChildren ?? 0,
        change: "", // No change info from API
        icon: <FaChild className="text-primary" />,
        color: "#e8f6f3",
        details: [
          { label: "Boys", value: childrenStats.genderDistribution?.boys ?? 0, color: "#14b8a6" },
          { label: "Girls", value: childrenStats.genderDistribution?.girls ?? 0, color: "#a855f7" }
        ]
      },
      {
        title: "Total Staff",
        value: Array.isArray(teacherStats.genderStats)
          ? teacherStats.genderStats.reduce((acc, g) => acc + (g.count ?? 0), 0)
          : 0,
        change: "", // No change info from API
        icon: <FaChalkboardTeacher className="text-success" />,
        color: "#f4f0fb",
        details: Array.isArray(teacherStats.genderStats)
          ? teacherStats.genderStats.map((g, i) => ({
              label: g.gender ?? 'Unknown',
              value: g.count ?? 0,
              color: i === 0 ? "#14b8a6" : "#a855f7"
            }))
          : []
      },
      {
        title: "Staff Age Distribution",
        value: `Groups: ${Array.isArray(teacherStats.ageGroupStats) ? teacherStats.ageGroupStats.length : 0}`,
        change: "Age Range",
        icon: <FaBirthdayCake className="text-info" />,
        color: "#e0f7fa",
        details: Array.isArray(teacherStats.ageGroupStats)
          ? teacherStats.ageGroupStats.map((a, i) => ({
              label: a.age_group ?? 'Unknown',
              value: a.count ?? 0,
              color: ["#14b8a6", "#a855f7", "#f43f5e"][i % 3]
            }))
          : []
      },
      {
        title: "Staff Gender Distribution",
        value: `${Array.isArray(teacherStats.genderStats) ? teacherStats.genderStats.reduce((acc, g) => acc + (g.count ?? 0), 0) : 0} Staff`,
        change: Array.isArray(teacherStats.genderStats)
          ? teacherStats.genderStats.map(g => `${g.gender ? g.gender[0] : 'U'}:${g.count ?? 0}`).join(", ")
          : '',
        icon: <FaVenusMars className="text-danger" />,
        color: "#fff0f0",
        details: Array.isArray(teacherStats.genderStats)
          ? teacherStats.genderStats.map((g, i) => ({
              label: g.gender ?? 'Unknown',
              value: g.count ?? 0,
              color: i === 0 ? "#14b8a6" : "#a855f7"
            }))
          : []
      }
    ];
  };

  // Children age group pie data
  const getChildrenAgeGroups = () => {
    if (!childrenStats) return [];
    const ageGroups = childrenStats.ageGroups || {};
    const colorArr = ["#14b8a6", "#a855f7", "#f43f5e"];
    return Object.entries(ageGroups).map(([label, value], i) => ({
      label: `${label} years`,
      value: Number(value) || 0,
      color: colorArr[i % colorArr.length]
    }));
  };

  // Children gender pie data
  const getChildrenGender = () => {
    if (!childrenStats) return [];
    return [
      { label: "Boys", value: childrenStats.genderDistribution?.boys ?? 0, color: "#14b8a6" },
      { label: "Girls", value: childrenStats.genderDistribution?.girls ?? 0, color: "#a855f7" }
    ];
  };

  // Staff age group pie data
  const getStaffAgeGroups = () => {
    if (!teacherStats || !Array.isArray(teacherStats.ageGroupStats)) return [];
    const colorArr = ["#14b8a6", "#a855f7", "#f43f5e"];
    return teacherStats.ageGroupStats.map((a, i) => ({
      label: a.age_group ?? 'Unknown',
      value: a.count ?? 0,
      color: colorArr[i % colorArr.length]
    }));
  };

  // Staff gender pie data
  const getStaffGender = () => {
    if (!teacherStats || !Array.isArray(teacherStats.genderStats)) return [];
    return teacherStats.genderStats.map((g, i) => ({
      label: g.gender ?? 'Unknown',
      value: g.count ?? 0,
      color: i === 0 ? "#14b8a6" : "#a855f7"
    }));
  };

  // Handlers
  const handleViewOpen = (activity) => {
    setSelectedActivity(activity);
    setShowViewModal(true);
  };

  const handleEditOpen = (activity) => {
    setSelectedActivity(activity);
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowViewModal(false);
    setShowEditModal(false);
  };
  const generatePDF = () => {
    const element = document.getElementById('dashboard-report');

    const opt = {
      margin: 0.5,
      filename: 'esem_dashboard_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };


  // School Statistics Data
  // const schoolStats = [ ... ]; // REMOVE static data
  // Recent Activities Data
  // const recentActivities = [ ... ]; // REMOVE static data

  if (loading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="text-center text-danger py-5">{error}</div>;
  }
  const schoolStats = getSchoolStats();

  return (

    <div id="dashboard-report">
      <Container fluid className="py-3 px-2 px-md-4">
        {/* Header Section */}
        <Row className="align-items-center justify-content-between mb-3">
          <Col xs={12} md={6}>
            <h4 className="fw-bold mb-1" style={{ color: '#2ab7a9' }}> Dashboard</h4>
            {/* <div className="text-muted small">Wednesday, June 18, 2025</div> */}
          </Col>
          <Col xs={12} md={6} className="mt-2 mt-md-0 d-flex justify-content-md-end">
            {/* <Button
              style={{ backgroundColor: reusableColor.customTextColor }}
              className="px-3 px-md-4"
              onClick={generatePDF}
            >
              <i className="bi bi-download me-2"></i>
              <span className="d-none d-sm-inline">Generate Report</span>
              <span className="d-inline d-sm-none">Report</span>
            </Button> */}

          </Col>
        </Row>

        {/* School Statistics Cards */}
        <Row className="g-3 mb-4">
          {schoolStats.map((stat, index) => (
            <Col xs={12} sm={6} md={6} lg={3} key={index}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body
                  className="d-flex flex-column justify-content-between p-3"
                  style={{ backgroundColor: stat.color }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="fs-4">{stat.icon}</div>
                    <div className="text-end">
                      <h5 className="fw-bold mb-0">{stat.value}</h5>
                      <small className={`${stat.change && stat.change.includes('+') ? 'text-success' : 'text-muted'}`}>
                        {stat.change}
                      </small>
                    </div>
                  </div>
                  <h6 className="fw-semibold mb-3">{stat.title}</h6>

                  {/* Pie Chart for Details */}
                  <div style={{ height: '120px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stat.details}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={2}
                          dataKey="value"
                          label={false} 
                        >
                          {stat.details.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={entry.color} />
                          ))}
                        </Pie>
                                   <Tooltip
    formatter={(value, name, { payload }) => [`${value}`, payload.label || name]}
  />

                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                    {stat.details.map((detail, i) => (
                      <div key={i} className="d-flex align-items-center">
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: detail.color,
                            borderRadius: '50%',
                            marginRight: 5
                          }}
                        />
                        <small className="text-muted">{detail.label}</small>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-3 mb-4">
          {/* Children Breakdown */}
          <Col xs={12} lg={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold mb-3">Children Statistics</Card.Title>

                <Row className="g-3">
                  {/* By Age Group */}
                  <Col xs={12} md={6} className="d-flex">
                    <div className="bg-light p-3 rounded h-100 w-100 d-flex flex-column">
                      <h6 className="fw-semibold text-muted mb-3">By Age Group</h6>
                      <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                           <Pie
  data={getChildrenAgeGroups()}
  cx="50%"
  cy="50%"
  outerRadius={70}
  dataKey="value"
 label={({ name, percent }) => ` ${(percent * 100).toFixed(0)}%`}
>
  {getChildrenAgeGroups().map((entry, index) => (
    <Cell key={`cell-${index}`} fill={entry.color} />
  ))}
</Pie>
       

                    <Tooltip
    formatter={(value, name, { payload }) => [`${value}`, payload.label || name]}
  />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Legend */}
                      <div className="mt-auto pt-3 d-flex flex-wrap justify-content-center gap-2">
                        {getChildrenAgeGroups().map((item, i) => (
                          <div key={i} className="d-flex align-items-center">
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                backgroundColor: item.color,
                                borderRadius: '50%',
                                marginRight: 5
                                
                              }}
                            />
                            <small className="text-muted">{item.label}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>

                  {/* By Gender */}
                  <Col xs={12} md={6} className="d-flex">
                    <div className="bg-light p-3 rounded h-100 w-100 d-flex flex-column">
                      <h6 className="fw-semibold text-muted mb-3">By Gender</h6>
                      <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getChildrenGender()}
                              cx="50%"
                              cy="50%"
                              outerRadius={70}
                              dataKey="value"
                              label={({ name, percent }) => ` ${(percent * 100).toFixed(0)}%`}
                            >
                              {getChildrenGender().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                                              <Tooltip
    formatter={(value, name, { payload }) => [`${value}`, payload.label || name]}
  />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Legend */}
                      <div className="mt-auto pt-3 d-flex flex-wrap justify-content-center gap-2">
                        {getChildrenGender().map((item, i) => (
                          <div key={i} className="d-flex align-items-center">
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                backgroundColor: item.color,
                                borderRadius: '50%',
                                marginRight: 5
                              }}
                            />
                            <small className="text-muted">{item.label}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Staff Breakdown */}
          <Col xs={12} lg={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold mb-3">Staff Statistics</Card.Title>

                <Row className="g-3">
                  {/* By Age Group */}
                  <Col xs={12} md={6} className="d-flex">
                    <div className="p-3 rounded h-100 w-100 d-flex flex-column" style={{ backgroundColor: schoolStats[2]?.color }}>
                      <h6 className="fw-semibold text-muted mb-3">By Age Group</h6>
                      <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getStaffAgeGroups()}
                              cx="50%"
                              cy="50%"
                              outerRadius={70}
                              dataKey="value"
                              label={({  percent }) => ` ${(percent * 100).toFixed(0)}%`}
                            >
                              {getStaffAgeGroups().map((entry, index) => (
                                <Cell key={`cell`} fill={entry.color} />
                              ))}
                            </Pie>
                                               <Tooltip
    formatter={(value, name, { payload }) => [`${value}`, payload.label || name]}
  />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Legend */}
                      <div className="mt-auto pt-3 d-flex flex-wrap justify-content-center gap-2">
                        {getStaffAgeGroups().map((item, i) => (
                          <div key={i} className="d-flex align-items-center">
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                backgroundColor: item.color,
                                borderRadius: '50%',
                                marginRight: 5
                              }}
                            />
                            <small className="text-muted">{item.label}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>

                  {/* By Gender */}
                  <Col xs={12} md={6} className="d-flex">
                    <div className="p-3 rounded h-100 w-100 d-flex flex-column" style={{ backgroundColor: schoolStats[3]?.color }}>
                      <h6 className="fw-semibold text-muted mb-3">By Gender</h6>
                      <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getStaffGender()}
                              cx="50%"
                              cy="50%"
                              outerRadius={70}
                              dataKey="value"
                              label={({  percent }) => ` ${(percent * 100).toFixed(0)}%`}
                            >
                              {getStaffGender().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                           <Tooltip
    formatter={(value, name, { payload }) => [`${value}`, payload.label || name]}
  />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Legend */}
                      <div className="mt-auto pt-3 d-flex flex-wrap justify-content-center gap-2">
                        {getStaffGender().map((item, i) => (
                          <div key={i} className="d-flex align-items-center">
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                backgroundColor: item.color,
                                borderRadius: '50%',
                                marginRight: 5
                              }}
                            />
                            <small className="text-muted">{item.label}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>


        {/* Recent Activities Section */}
        <Row>
          <Col xs={12}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold mb-3">Recent Activities</Card.Title>

                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th className="small">TIME</th>
                        <th className="small">ACTIVITY</th>
                        <th className="small">TYPE</th>
                        <th className="small text-center">ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentActivities.map((activity) => (
                        <tr key={activity.id}>
                          <td className="small">{activity.date}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                {activity.icon}
                              </div>
                              <span>{activity.activity}</span>
                            </div>
                          </td>
                          <td>
                            <Badge bg="light" text="dark" className="small">
                              {activity.type}
                            </Badge>
                          </td>

                          {/* ➕ New Action Buttons Column */}
                          <td className="text-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="me-1"
                              title="View"
                              onClick={() => handleViewOpen(activity)}
                            >
                              <FaEye size={14} />
                            </Button>
                            {/* <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1"
                              title="Edit"
                              onClick={() => handleEditOpen(activity)}
                            >
                              <FaEdit size={14} />
                            </Button> */}
                            {/* <Button
                              variant="outline-danger"
                              size="sm"
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </Button> */}
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </Table>


                  <Modal show={showEditModal} onHide={handleModalClose} centered>
                    <Modal.Header closeButton style={{ backgroundColor: reusableColor.customTextColor, color: "white" }}>
                      <Modal.Title>Edit Activity</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {selectedActivity && (
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Time</Form.Label>
                            <Form.Control type="text" defaultValue={selectedActivity.date} />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Activity</Form.Label>
                            <Form.Control type="text" defaultValue={selectedActivity.activity} />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Control type="text" defaultValue={selectedActivity.type} />
                          </Form.Group>
                        </Form>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                      <Button variant="primary" onClick={handleModalClose}>Save</Button>
                    </Modal.Footer>
                  </Modal>


                  <Modal show={showViewModal} onHide={handleModalClose} centered>
                    <Modal.Header closeButton style={{ backgroundColor: reusableColor.customTextColor, color: "white" }}>
                      <Modal.Title>View Activity</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {selectedActivity && (
                        <>
                          <p><strong>Time:</strong> {selectedActivity.date}</p>
                          <p><strong>Activity:</strong> {selectedActivity.activity}</p>
                          <p><strong>Type:</strong> {selectedActivity.type}</p>
                        </>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    </Modal.Footer>
                  </Modal>



                </div>







              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>





  );
};

export default Dashboard;
