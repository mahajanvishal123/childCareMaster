import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Alert,
  Spinner
} from 'react-bootstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FaUserCircle } from 'react-icons/fa';
import './ChildrenAttendance.css';
import { reusableColor } from '../ReusableComponent/reusableColor';
import axiosInstance from '../../utils/axiosInstance';
import { BASE_URL } from '../../utils/config';

// Logged-in child
const user = {
  name: 'Emma',
  id: 30, // Using the user ID from the API example
  dateOfBirth: '2009-03-12',
};

const itemsPerPage = 5;

const ChildrenAttendance = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attendanceData, setAttendanceData] = useState({
    totalDays: 0,
    totalPresent: 0,
    totalAbsent: 0,
    attendance: []
  });

  // Get current week dates
  const getCurrentWeekDates = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay())); // Saturday
    
    // Ensure end date doesn't exceed current date
    const currentDate = new Date();
    if (endOfWeek > currentDate) {
      endOfWeek.setTime(currentDate.getTime());
    }
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [dateRange, setDateRange] = useState(getCurrentWeekDates());

  // Fetch attendance data from API
  const fetchAttendanceData = async (userId, fromDate, toDate) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.get(`${BASE_URL}/attendance/${userId}?from=${fromDate}&to=${toDate}`);
      
      if (response.status === 200) {
        setAttendanceData(response.data);
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError(err.response?.data?.message || 'Failed to fetch attendance data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when date range changes
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchAttendanceData(user.id, dateRange.start, dateRange.end);
    }
  }, [dateRange]);

  // Filter data based on date range
  const filteredData = attendanceData.attendance || [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const presentCount = attendanceData.totalPresent || 0;
  const absentCount = attendanceData.totalAbsent || 0;
  const totalDays = attendanceData.totalDays || 0;
  const attendanceRate = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  // Helper: Get ISO week number
  const getWeekNumber = (dateString) => {
    const date = new Date(dateString);
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = ((date - firstJan + 86400000) / 86400000);
    return Math.ceil((dayOfYear + firstJan.getDay()) / 7);
  };

  // Dynamic weekly summary data from filteredData
  const dynamicWeeklyData = filteredData.reduce((acc, item) => {
    const week = getWeekNumber(item.date);
    const found = acc.find(entry => entry.week === week);
    if (item.status === 'Present') {
      if (found) {
        found.Attendance += 1;
      } else {
        acc.push({ week, Attendance: 1 });
      }
    } else {
      if (!found) acc.push({ week, Attendance: 0 });
    }
    return acc;
  }, []).sort((a, b) => a.week - b.week);

  const chartData = dynamicWeeklyData.map((item, index) => ({
    name: `Week ${index + 1}`,
    Attendance: item.Attendance,
  }));

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-3">
      <Row className="header-row rounded m-1 mb-3">
        <Col><h5 className="fw-bold">My Attendance</h5></Col>
        <Col className="text-end">
          <div className="small"> <b>D.O.B.</b> {user.dateOfBirth}</div>
          <div className="fw-semibold"><FaUserCircle /> {user.name}</div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row className="g-3 ml-1 mr-1 align-items-stretch">
        <Col xs={12} md={6} className="d-flex">
          <Card className="shadow-sm w-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Attendance Records</h6>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="date"
                    size="sm"
                    value={dateRange.start}
                    max={getCurrentDate()}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const currentDate = getCurrentDate();
                      
                      // Validate that selected date is not in the future
                      if (selectedDate > currentDate) {
                        setError('Start date cannot be in the future');
                        return;
                      }
                      
                      // Validate that start date is not after end date
                      if (dateRange.end && selectedDate > dateRange.end) {
                        setError('Start date cannot be after end date');
                        return;
                      }
                      
                      setError(''); // Clear any previous errors
                      setDateRange((prev) => ({ ...prev, start: selectedDate }));
                      setCurrentPage(1);
                    }}
                  />
                  <Form.Control
                    type="date"
                    size="sm"
                    value={dateRange.end}
                    max={getCurrentDate()}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const currentDate = getCurrentDate();
                      
                      // Validate that selected date is not in the future
                      if (selectedDate > currentDate) {
                        setError('End date cannot be in the future');
                        return;
                      }
                      
                      // Validate that end date is not before start date
                      if (dateRange.start && selectedDate < dateRange.start) {
                        setError('End date cannot be before start date');
                        return;
                      }
                      
                      setError(''); // Clear any previous errors
                      setDateRange((prev) => ({ ...prev, end: selectedDate }));
                      setCurrentPage(1);
                    }}
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      const currentWeek = getCurrentWeekDates();
                      setDateRange(currentWeek);
                      setCurrentPage(1);
                      setError(''); // Clear any previous errors
                    }}
                  >
                    This Week
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <div className="mt-2">Loading attendance data...</div>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover borderless className="mb-0">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.length > 0 ? (
                          paginatedData.map((row, i) => (
                            <tr key={i}>
                              <td>{formatDate(row.date)}</td>
                              <td>
                                <span className={`fw-semibold ${row.status === 'Present' ? 'text-success' : 'text-danger'}`}>
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-center text-muted">
                              {filteredData.length === 0 ? 'No attendance records found for the selected date range.' : 'No records to display.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {filteredData.length > itemsPerPage && (
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <Button
                        variant="light"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        &#60;
                      </Button>
                      <span className="mx-2">{currentPage}/{totalPages}</span>
                      <Button
                        variant="light"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        &#62;
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} className="d-flex">
          <Card className="shadow-sm w-100">
            <Card.Body>
              <h6 className="fw-bold mb-3">My Summary</h6>
              <Row className="text-center mb-3">
                <Col>
                  <div className="fw-bold">{totalDays}</div>
                  <div className="small">Total Days</div>
                </Col>
                <Col>
                  <div className="fw-bold text-success">{presentCount}</div>
                  <div className="small">Days Present</div>
                </Col>
                <Col>
                  <div className="fw-bold text-danger">{absentCount}</div>
                  <div className="small">Days Absent</div>
                </Col>
              </Row>

              <div className="small mb-1">Attendance Rate</div>
              <div className="progress mb-3" style={{ height: '6px' }}>
                <div className="progress-bar" style={{ width: `${attendanceRate}%`, backgroundColor: reusableColor.customTextColor }}></div>
              </div>
              <div className="small text-muted mb-3">{attendanceRate}% attendance rate</div>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" fontSize={10} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="Attendance" fill="#2ab7a9" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-4">
                  <small>No chart data available for the selected period</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChildrenAttendance;
