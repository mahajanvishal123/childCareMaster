import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  BarChart,
  Bar
} from "recharts";

const today = "June 18, 2025";

// Dummy data for the chart
const childrenChartData = [
  { month: "Jan", Attendance: 88, NewEnrollments: 6 },
  { month: "Feb", Attendance: 91, NewEnrollments: 9 },
  { month: "Mar", Attendance: 89, NewEnrollments: 11 },
  { month: "Apr", Attendance: 93, NewEnrollments: 14 },
  { month: "May", Attendance: 90, NewEnrollments: 12 },
  { month: "Jun", Attendance: 94, NewEnrollments: 16 },
];

// Chart Data
const teacherChartData = [
  { name: "Emily", classSize: 12, rating: 4.5 },
  { name: "Michael", classSize: 10, rating: 4.0 },
  { name: "Sarah", classSize: 14, rating: 5.0 },
  { name: "David", classSize: 8, rating: 4.2 },
  { name: "Jessica", classSize: 9, rating: 4.7 },
];

const financialChartData = [
  { month: "Jan", income: 20000, expenses: 13000, profit: 7000 },
  { month: "Feb", income: 22000, expenses: 13500, profit: 8500 },
  { month: "Mar", income: 21000, expenses: 12800, profit: 8200 },
  { month: "Apr", income: 23000, expenses: 14000, profit: 9000 },
  { month: "May", income: 21500, expenses: 13200, profit: 8300 },
  { month: "Jun", income: 22500, expenses: 13700, profit: 8800 },
];

const transactions = [
  {
    id: "TRX-1001",
    date: "June 18, 2025",
    category: { label: "Tuition Fee", bg: "#E6F7F3", color: "#34C77B" },
    description: "Monthly tuition - Oliver Lewis",
    amount: "+$650.00",
    amountColor: "#34C77B",
    status: { label: "Completed", bg: "#E6F7F3", color: "#34C77B" }
  },
  {
    id: "TRX-1002",
    date: "June 17, 2025",
    category: { label: "Supplies", bg: "#FFE6E6", color: "#FF6B6B" },
    description: "Art supplies purchase",
    amount: "-$420.50",
    amountColor: "#FF6B6B",
    status: { label: "Completed", bg: "#E6F7F3", color: "#34C77B" }
  },
  {
    id: "TRX-1003",
    date: "June 16, 2025",
    category: { label: "Registration", bg: "#E6F7F3", color: "#34C77B" },
    description: "New student registration - Ava Johnson",
    amount: "+$250.00",
    amountColor: "#34C77B",
    status: { label: "Completed", bg: "#E6F7F3", color: "#34C77B" }
  },
  {
    id: "TRX-1004",
    date: "June 15, 2025",
    category: { label: "Salary", bg: "#FFE6E6", color: "#FF6B6B" },
    description: "Teacher salary - Emily Johnson",
    amount: "-$2,800.00",
    amountColor: "#FF6B6B",
    status: { label: "Completed", bg: "#E6F7F3", color: "#34C77B" }
  },
  {
    id: "TRX-1005",
    date: "June 14, 2025",
    category: { label: "Tuition Fee", bg: "#E6F7F3", color: "#34C77B" },
    description: "Monthly tuition - Sophia Parker",
    amount: "+$650.00",
    amountColor: "#34C77B",
    status: { label: "Pending", bg: "#FFF9DB", color: "#F7B731" }
  }
];

export default function Reports() {
  const [tab, setTab] = useState("children");

  // Dummy chart effect (replace with real chart lib as needed)
  useEffect(() => {
    // You can intigrate chart.js or similar here
  }, [tab]);

  return (
    <div className="cc-dashboard min-vh-100 d-flex flex-column bg-light">


      {/* Main Content */}
      <main className="flex-grow-1 container py-4 px-2 px-md-4">
        {/* Tab Navigation */}
        <div
          className="mb-4 bg-white rounded-3 shadow-sm p-1 d-flex flex-nowrap overflow-auto cc-tab-nav"
          style={{ maxWidth: "100vw" }}
        >
          <button
            className={`cc-tab-btn btn px-4 py-2 rounded-pill me-2 fw-bold`}
            style={{
              background: tab === "children" ? "#32BC9B" : "#fff",
              color: tab === "children" ? "#fff" : "#32BC9B",
              border: "none",
              transition: "background 0.2s, color 0.2s"
            }}
            onClick={() => setTab("children")}
          >
            Children
          </button>
          <button
            className={`cc-tab-btn btn px-4 py-2 rounded-pill me-2 fw-bold`}
            style={{
              background: tab === "teachers" ? "#32BC9B" : "#fff",
              color: tab === "teachers" ? "#fff" : "#32BC9B",
              border: "none",
              transition: "background 0.2s, color 0.2s"
            }}
            onClick={() => setTab("teachers")}
          >
            Staffs
          </button>
          <button
            className={`cc-tab-btn btn px-4 py-2 rounded-pill fw-bold`}
            style={{
              background: tab === "financial" ? "#32BC9B" : "#fff",
              color: tab === "financial" ? "#fff" : "#32BC9B",
              border: "none",
              transition: "background 0.2s, color 0.2s"
            }}
            onClick={() => setTab("financial")}
          >
            Financial
          </button>
        </div>

        {/* Children Section */}
        <section className={tab === "children" ? "" : "d-none"}>
          <div className="bg-white rounded-3 shadow-sm p-2 p-md-4 mb-4">
            {/* Filters & Heading */}
            <div
              className="children-report-header mb-4"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 24
              }}
            >
              <h2
                className="fs-4 fw-semibold text-dark mb-0"
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 600
                }}
              >
                Children Report
              </h2>
              <div
                className="filters d-flex flex-column flex-md-row gap-2 align-items-stretch align-items-md-center w-100"
              >
                <select className="form-select w-100 w-md-auto mb-2 mb-md-0" defaultValue="">
                  <option value="">All Age Groups</option>
                  <option value="0-2">0-2 years</option>
                  <option value="2-4">2-4 years</option>
                  <option value="4-6">4-6 years</option>
                </select>
                <select className="form-select w-100 w-md-auto mb-2 mb-md-0" defaultValue="">
                  <option value="">All Staffs</option>
                  <option value="1">Emily Johnson</option>
                  <option value="2">Michael Chen</option>
                  <option value="3">Sarah Williams</option>
                </select>
                <input type="date" className="form-control w-100 w-md-auto mb-2 mb-md-0" defaultValue="2025-06-01" />
                <span className="mx-1 text-secondary d-none d-md-inline">to</span>
                <input type="date" className="form-control w-100 w-md-auto mb-2 mb-md-0" defaultValue="2025-06-18" />
                <button
                  className="cc-filter-btn btn d-flex align-items-center fw-bold w-100 w-md-auto"
                  style={{
                    background: "#32BC9B",
                    color: "#fff",
                    border: "none",
                    borderRadius: "999px",
                    transition: "background 0.2s, color 0.2s",
                    whiteSpace: "nowrap"
                  }}
                >
                  <i className="ri-filter-3-line me-1"></i> Apply Filters
                </button>
              </div>
            </div>
            {/* Summary Cards */}
            <div className="row g-2 g-md-3 mb-4">
              <div className="col-12 col-sm-6 col-lg-3 mb-2 mb-lg-0">
                <div className="bg-light p-3 rounded-3 border cc-summary-card d-flex align-items-center">
                  <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}>
                    <i className="ri-user-line text-success"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Total Children</div>
                    <div className="fs-5 fw-bold">128</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3 mb-2 mb-lg-0">
                <div className="bg-light p-3 rounded-3 border cc-summary-card d-flex align-items-center">
                  <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}>
                    <i className="ri-calendar-check-line text-success"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Avg. Attendance</div>
                    <div className="fs-5 fw-bold">92%</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3 mb-2 mb-lg-0">
                <div className="bg-light p-3 rounded-3 border cc-summary-card d-flex align-items-center">
                  <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}>
                    <i className="ri-group-line text-success"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Gender Distribution</div>
                    <div className="fs-5 fw-bold">58% F / 42% M</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3 mb-2 mb-lg-0">
                <div className="bg-light p-3 rounded-3 border cc-summary-card d-flex align-items-center">
                  <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}>
                    <i className="ri-bar-chart-grouped-line text-success"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Age Distribution</div>
                    <div className="d-flex align-items-center gap-1 mt-1">
                      <div className="bg-success rounded-pill" style={{ width: 32, height: 8 }}></div>
                      <div className="bg-secondary rounded-pill" style={{ width: 48, height: 8 }}></div>
                      <div className="bg-success bg-opacity-50 rounded-pill" style={{ width: 40, height: 8 }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Chart */}
            <div className="mb-4" style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={childrenChartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#32BC9B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#32BC9B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Attendance"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorAttendance)"
                    activeDot={{ r: 6 }}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="NewEnrollments"
                    stroke="#32BC9B"
                    fillOpacity={1}
                    fill="url(#colorEnroll)"
                    activeDot={{ r: 6 }}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Attendance"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="NewEnrollments"
                    stroke="#32BC9B"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Table */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h3 className="fs-6 fs-md-5 fw-medium text-dark mb-0">Children List</h3>
              <button className="btn btn-light d-flex align-items-center">
                <i className="ri-download-2-line me-1"></i> Export
              </button>
            </div>
            <div className="table-responsive" style={{ minHeight: 0 }}>
              <table className="table table-hover align-middle cc-table" style={{ minWidth: 600 }}>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Staff</th>
                    <th>Attendance</th>
                    <th>Last Present</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CH-1025</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: 32,
                            height: 32,
                            background: "#E6F7F3",
                            color: "#32BC9B",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          SP
                        </div>
                        Sophia Parker
                      </div>
                    </td>
                    <td className="text-secondary">4 years</td>
                    <td className="text-secondary">Michael Chen</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="progress"
                          style={{
                            width: 80,
                            height: 10,
                            background: "#E6F7F3",
                            borderRadius: 8,
                            marginRight: 8,
                          }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: "88%",
                              background: "#32BC9B",
                              borderRadius: 8,
                            }}
                          ></div>
                        </div>
                        <span style={{ color: "#32BC9B", fontWeight: 500 }}>88%</span>
                      </div>
                    </td>
                    <td className="text-secondary">June 17, 2025</td>
                    <td>
                      <button className="btn btn-link p-0" style={{ color: "#32BC9B" }}>
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="btn btn-link p-0 text-secondary">
                        <i className="ri-more-2-fill"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>CH-1026</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: 32,
                            height: 32,
                            background: "#E6F7F3",
                            color: "#32BC9B",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          EH
                        </div>
                        Ethan Harris
                      </div>
                    </td>
                    <td className="text-secondary">5 years</td>
                    <td className="text-secondary">Sarah Williams</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="progress"
                          style={{
                            width: 80,
                            height: 10,
                            background: "#E6F7F3",
                            borderRadius: 8,
                            marginRight: 8,
                          }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: "92%",
                              background: "#32BC9B",
                              borderRadius: 8,
                            }}
                          ></div>
                        </div>
                        <span style={{ color: "#32BC9B", fontWeight: 500 }}>92%</span>
                      </div>
                    </td>
                    <td className="text-secondary">June 18, 2025</td>
                    <td>
                      <button className="btn btn-link p-0" style={{ color: "#32BC9B" }}>
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="btn btn-link p-0 text-secondary">
                        <i className="ri-more-2-fill"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>CH-1027</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: 32,
                            height: 32,
                            background: "#E6F7F3",
                            color: "#32BC9B",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          AJ
                        </div>
                        Ava Johnson
                      </div>
                    </td>
                    <td className="text-secondary">2 years</td>
                    <td className="text-secondary">Emily Johnson</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="progress"
                          style={{
                            width: 80,
                            height: 10,
                            background: "#E6F7F3",
                            borderRadius: 8,
                            marginRight: 8,
                          }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: "85%",
                              background: "#32BC9B",
                              borderRadius: 8,
                            }}
                          ></div>
                        </div>
                        <span style={{ color: "#32BC9B", fontWeight: 500 }}>85%</span>
                      </div>
                    </td>
                    <td className="text-secondary">June 16, 2025</td>
                    <td>
                      <button className="btn btn-link p-0" style={{ color: "#32BC9B" }}>
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="btn btn-link p-0 text-secondary">
                        <i className="ri-more-2-fill"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>CH-1028</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: 32,
                            height: 32,
                            background: "#E6F7F3",
                            color: "#32BC9B",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          MJ
                        </div>
                        Mason Johnson
                      </div>
                    </td>
                    <td className="text-secondary">3 years</td>
                    <td className="text-secondary">Michael Chen</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="progress"
                          style={{
                            width: 80,
                            height: 10,
                            background: "#E6F7F3",
                            borderRadius: 8,
                            marginRight: 8,
                          }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: "90%",
                              background: "#32BC9B",
                              borderRadius: 8,
                            }}
                          ></div>
                        </div>
                        <span style={{ color: "#32BC9B", fontWeight: 500 }}>90%</span>
                      </div>
                    </td>
                    <td className="text-secondary">June 15, 2025</td>
                    <td>
                      <button className="btn btn-link p-0" style={{ color: "#32BC9B" }}>
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="btn btn-link p-0 text-secondary">
                        <i className="ri-more-2-fill"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div
              className="d-flex justify-content-between align-items-center mt-3"
              style={{ gap: 12 }}
            >
              <div className="text-secondary small" style={{ marginLeft: 8 }}>
                Showing 5 of 128 children
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0" style={{ gap: 8 }}>
                  <li className="page-item">
                    <button
                      className="page-link"
                      style={{
                        borderRadius: 20,
                        border: "1px solid #D1D5DB",
                        color: "#32BC9B",
                        background: "#fff",
                        minWidth: 48
                      }}
                    >
                      Previous
                    </button>
                  </li>
                  <li className="page-item active">
                    <button
                      className="page-link"
                      style={{
                        borderRadius: 20,
                        border: "1px solid #32BC9B",
                        background: "#32BC9B",
                        color: "#fff",
                        minWidth: 32
                      }}
                    >
                      1
                    </button>
                  </li>
                  <li className="page-item">
                    <button
                      className="page-link"
                      style={{
                        borderRadius: 20,
                        border: "1px solid #D1D5DB",
                        color: "#32BC9B",
                        background: "#fff",
                        minWidth: 32
                      }}
                    >
                      2
                    </button>
                  </li>
                  <li className="page-item">
                    <button
                      className="page-link"
                      style={{
                        borderRadius: 20,
                        border: "1px solid #D1D5DB",
                        color: "#32BC9B",
                        background: "#fff",
                        minWidth: 32
                      }}
                    >
                      3
                    </button>
                  </li>
                  <li className="page-item">
                    <button
                      className="page-link"
                      style={{
                        borderRadius: 20,
                        border: "1px solid #D1D5DB",
                        color: "#32BC9B",
                        background: "#fff",
                        minWidth: 48
                      }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* Teachers Section */}
        <section className={tab === "teachers" ? "" : "d-none"}>
          <div className="bg-white rounded-3 shadow-sm p-2 p-md-4 mb-4">
            {/* Heading & Filters */}
            <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-2 mb-4">
              <h2 className="fs-4 fw-semibold text-dark mb-0">Staff Report</h2>
              <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 w-100 w-md-auto">
                <select className="form-select w-100 w-md-auto mb-2 mb-md-0" defaultValue="">
                  <option value="">All Courses</option>
                  <option value="art">Art & Craft</option>
                  <option value="music">Music</option>
                  <option value="math">Math</option>
                </select>
                <input type="date" className="form-control w-100 w-md-auto mb-2 mb-md-0" defaultValue="2025-06-01" />
                <span className="mx-1 text-secondary d-none d-md-inline">to</span>
                <input type="date" className="form-control w-100 w-md-auto mb-2 mb-md-0" defaultValue="2025-06-18" />
                <button
                  className="btn d-flex align-items-center fw-bold w-100 w-md-auto"
                  style={{
                    background: "#32BC9B",
                    color: "#fff",
                    border: "none",
                    borderRadius: "999px"
                  }}
                >
                  <i className="ri-filter-3-line me-1"></i> Apply Filters
                </button>
              </div>
            </div>
            {/* Summary Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <div className="bg-light p-3 rounded-3 border d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="ri-user-3-line text-success"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Total Staffs</div>
                    <div className="fs-5 fw-bold">12</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="bg-light p-3 rounded-3 border d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="ri-group-line text-info"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Avg. Class Size</div>
                    <div className="fs-5 fw-bold">10.7</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="bg-light p-3 rounded-3 border d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="ri-checkbox-circle-line text-warning"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Course Completion</div>
                    <div className="fs-5 fw-bold">87%</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="bg-light p-3 rounded-3 border d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="ri-star-line text-success"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Avg. Rating</div>
                    <div className="fs-5 fw-bold">
                      <span className="text-warning me-1">★</span>4.5
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Chart Placeholder */}
            <div className="mb-4" style={{ width: "100%", height: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={teacherChartData}
                  margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis
                    yAxisId="left"
                    label={{ value: "Class Size", angle: -90, position: "insideLeft", offset: 10 }}
                    domain={[0, 20]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "Rating", angle: -90, position: "insideRight", offset: 10 }}
                    domain={[0, 5]}
                  />
                  <Tooltip />
                  <Legend verticalAlign="top" align="center" iconType="circle" />
                  <Bar
                    yAxisId="left"
                    dataKey="classSize"
                    name="Class Size"
                    fill="#5DBDF6"
                    barSize={40}
                    radius={[6, 6, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rating"
                    name="Performance Rating"
                    stroke="#FDBA74"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#FDBA74", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Table Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fs-5 fw-medium text-dark mb-0">Staffs List</h3>
              <button className="btn btn-light d-flex align-items-center">
                <i className="ri-download-2-line me-1"></i> Export
              </button>
            </div>
            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>COURSES</th>
                    <th>STUDENTS</th>
                    <th>RATING</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example row */}

                  <tr>
                    <td>T-001</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 32, height: 32, background: "#E6F7F3", color: "#32BC9B", fontWeight: 600, fontSize: 14 }}>MC</div>
                        Michael Chen
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: "#E6F0FF", // light blue
                          color: "#3B82F6",      // blue text
                          fontWeight: 500,
                          marginRight: 4
                        }}
                      >
                        Art &amp; Craft
                      </span>
                      <span
                        className="badge"
                        style={{
                          background: "#F6EDFF",//light purple
                          color: "#A259FF",      // purple text
                          fontWeight: 500
                        }}
                      >
                        Music
                      </span>
                    </td>
                    <td>10</td>
                    <td>
                      <span style={{ color: "#FFD600", fontSize: 18, marginRight: 2 }}>★★★★☆</span>
                      4.0
                    </td>
                    <td>
                      <span className="badge" style={{ background: "#E6F7F3", color: "#34C77B", fontWeight: 500 }}>Active</span>
                    </td>
                    <td>
                      <button className="btn btn-link p-0" style={{ color: "#32BC9B" }}>
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="btn btn-link p-0 text-secondary">
                        <i className="ri-more-2-fill"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>T-002</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 32, height: 32, background: "#E6F7F3", color: "#32BC9B", fontWeight: 600, fontSize: 14 }}>SW</div>
                        Sarah Williams
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: "#E6E6FF", color: "#6C63FF", fontWeight: 500, marginRight: 4 }}>Language</span>
                      <span className="badge" style={{ background: "#FFE6E6", color: "#FF6B6B", fontWeight: 500 }}>Reading</span>
                    </td>
                    <td>14</td>
                    <td>
                      <span style={{ color: "#FFD600", fontSize: 18, marginRight: 2 }}>★★★★★</span>
                      5.0
                    </td>
                    <td>
                      <span className="badge" style={{ background: "#E6F7F3", color: "#34C77B", fontWeight: 500 }}>Active</span>
                    </td>
                    <td>
                      <button className="btn btn-link p-0" style={{ color: "#32BC9B" }}>
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="btn btn-link p-0 text-secondary">
                        <i className="ri-more-2-fill"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>T-003</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 32, height: 32, background: "#E6F7F3", color: "#32BC9B", fontWeight: 600, fontSize: 14 }}>DR</div>
                        David Rodriguez
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: "#F3E6FF", color: "#A259FF", fontWeight: 500, marginRight: 4 }}>Music</span>
                      <span className="badge" style={{ background: "#FFE6F3", color: "#FF6FA5", fontWeight: 500 }}>Dance</span>
                    </td>
                    <td>8</td>
                    <td>
                      <span style={{ color: "#FFD600", fontSize: 18, marginRight: 2 }}>★★★★☆</span>
                      4.2
                    </td>
                    <td>
                      <span className="badge" style={{ background: "#FFF9DB", color: "#F7B731", fontWeight: 500 }}>On Leave</span>
                    </td>
                    <td>
                      <button className="btn btn-link p-0" style={{ color: "#32BC9B" }}>
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="btn btn-link p-0 text-secondary">
                        <i className="ri-more-2-fill"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>T-004</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 32, height: 32, background: "#E6F7F3", color: "#32BC9B", fontWeight: 600, fontSize: 14 }}>JP</div>
                        Jessica Patel
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: "#E6E6FF", color: "#6C63FF", fontWeight: 500, marginRight: 4 }}>Art &amp; Craft</span>
                      <span className="badge" style={{ background: "#E6F7F3", color: "#34C77B", fontWeight: 500 }}>Math</span>
                    </td>
                    <td>9</td>
                    <td>
                      <span style={{ color: "#FFD600", fontSize: 18, marginRight: 2 }}>★★★★☆</span>
                      4.7
                    </td>
                    <td>
                      <span className="badge" style={{ background: "#E6F7F3", color: "#34C77B", fontWeight: 500 }}>Active</span>
                    </td>
                    <td>
                      <button className="btn btn-link p-0" style={{ color: "#32BC9B" }}>
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="btn btn-link p-0 text-secondary">
                        <i className="ri-more-2-fill"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-secondary small">Showing 5 of 12 Staff</div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item">
                    <button className="page-link" style={{ background: "transparent", color: "#32BC9B", border: "1px solid #32BC9B" }}>Previous</button>
                  </li>
                  <li className="page-item active">
                    <button className="page-link" style={{ background: "#32BC9B", color: "#fff", border: "1px solid #32BC9B" }}>1</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link" style={{ background: "transparent", color: "#32BC9B", border: "1px solid #32BC9B" }}>2</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link" style={{ background: "transparent", color: "#32BC9B", border: "1px solid #32BC9B" }}>3</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link" style={{ background: "transparent", color: "#32BC9B", border: "1px solid #32BC9B" }}>Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* Financial Section */}
        <section className={tab === "financial" ? "" : "d-none"}>
          <div className="bg-white rounded-3 shadow-sm p-2 p-md-4 mb-4">
            {/* Heading and Filter */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h2 className="fs-4 fw-semibold text-dark mb-0">Financial Report</h2>
              <div className="d-flex align-items-center flex-wrap gap-2">
                <select className="form-select w-auto" defaultValue="">
                  <option value="">All Transactions</option>
                  <option value="tuition">Tuition Fee</option>
                  <option value="supplies">Supplies</option>
                  <option value="salary">Salary</option>
                </select>
                <input type="date" className="form-control w-auto" defaultValue="2025-06-01" />
                <span className="mx-1 text-secondary">to</span>
                <input type="date" className="form-control w-auto" defaultValue="2025-06-18" />
                <button
                  className="btn d-flex align-items-center fw-bold"
                  style={{
                    background: "#32BC9B",
                    color: "#fff",
                    border: "none",
                    borderRadius: "999px"
                  }}
                >
                  <i className="ri-filter-3-line me-1"></i> Apply Filters
                </button>
              </div>
            </div>
            {/* Summary Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <div className="bg-light p-3 rounded-3 border d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="ri-money-dollar-circle-line text-success"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Total Income</div>
                    <div className="fs-5 fw-bold">$24,850</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="bg-light p-3 rounded-3 border d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="ri-lock-2-line text-danger"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Total Expenses</div>
                    <div className="fs-5 fw-bold">$16,340</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="bg-light p-3 rounded-3 border d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="ri-bar-chart-2-line text-info"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Net Profit</div>
                    <div className="fs-5 fw-bold">$8,510</div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="bg-light p-3 rounded-3 border d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="ri-disc-line text-primary"></i>
                  </div>
                  <div>
                    <div className="text-secondary small">Growth (MoM)</div>
                    <div className="fs-5 fw-bold" style={{ color: "#34C77B" }}>+12.4%</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Chart */}
            <div className="mb-4" style={{ width: "100%", height: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialChartData}
                  margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    domain={[0, 25000]}
                    tickFormatter={v => `$${v / 1000}k`}
                  />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend verticalAlign="top" align="center" iconType="circle" />
                  <Bar
                    yAxisId="left"
                    dataKey="income"
                    name="Income"
                    fill="#5DBDF6"
                    barSize={32}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="expenses"
                    name="Expenses"
                    fill="#FF9F7F"
                    barSize={32}
                    radius={[6, 6, 0, 0]}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#34C77B"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#34C77B", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Table Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fs-5 fw-medium text-dark mb-0">Transaction History</h3>
              <button className="btn btn-light d-flex align-items-center">
                <i className="ri-download-2-line me-1"></i> Export
              </button>
            </div>
            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>CATEGORY</th>
                    <th>DESCRIPTION</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((trx) => (
                    <tr key={trx.id}>
                      <td>{trx.id}</td>
                      <td>{trx.date}</td>
                      <td>
                        <span className="badge" style={{ background: trx.category.bg, color: trx.category.color, fontWeight: 500 }}>
                          {trx.category.label}
                        </span>
                      </td>
                      <td>{trx.description}</td>
                      <td style={{ color: trx.amountColor, fontWeight: 500 }}>{trx.amount}</td>
                      <td>
                        <span className="badge" style={{ background: trx.status.bg, color: trx.status.color, fontWeight: 500 }}>
                          {trx.status.label}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-link p-0" style={{ color: "#32BC9B" }}>
                          <i className="ri-eye-line"></i>
                        </button>
                        <button className="btn btn-link p-0 text-secondary">
                          <i className="ri-more-2-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-secondary small">Showing 5 of 48 transactions</div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item">
                    <button className="page-link" style={{ background: "transparent", color: "#32BC9B", border: "1px solid #32BC9B" }}>Previous</button>
                  </li>
                  <li className="page-item active">
                    <button className="page-link" style={{ background: "#32BC9B", color: "#fff", border: "1px solid #32BC9B" }}>1</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link" style={{ background: "transparent", color: "#32BC9B", border: "1px solid #32BC9B" }}>2</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link" style={{ background: "transparent", color: "#32BC9B", border: "1px solid #32BC9B" }}>3</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link" style={{ background: "transparent", color: "#32BC9B", border: "1px solid #32BC9B" }}>Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
