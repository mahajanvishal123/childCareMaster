import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaEdit,
  FaTrashAlt,
  FaPrint,
  FaUserPlus,
  FaMoneyCheckAlt,
  FaEye,
  FaDownload,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { useDispatch ,useSelector} from "react-redux";
import { getUsers } from "../../../redux/slices/userSlice";

const employeesList = [
  {
    id: 1,
    name: "Emma Thompson",
    phone: "(555) 123-4567",
    ssn: "XXX-XX-7890",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
    payroll: "₹ 25,000 (Monthly)",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    phone: "(555) 234-5678",
    ssn: "XXX-XX-2345",
    address: "456 Oak Ave, Chicago, IL 60601",
    payroll: "₹ 18,500 (Bi-Weekly)",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    phone: "(555) 345-6789",
    ssn: "XXX-XX-3456",
    address: "789 Pine Rd, Dallas, TX 75201",
    payroll: "₹ 12,000 (Weekly)",
  },
  {
    id: 4,
    name: "David Wilson",
    phone: "(555) 456-7890",
    ssn: "XXX-XX-4567",
    address: "321 Maple St, Miami, FL 33101",
    payroll: "₹ 32,000 (Monthly)",
  },
  {
    id: 5,
    name: "Jennifer Lee",
    phone: "(555) 567-8901",
    ssn: "XXX-XX-5678",
    address: "654 Cedar Blvd, Seattle, WA 98101",
    payroll: "₹ 15,750 (Bi-Weekly)",
  },
];

// const payrollRecords = [
//   {
//     id: 1,
//     name: "Emma Thompson",
//     amount: 25000,
//     recurrence: "Monthly",
//     last: "May 15, 2025",
//     next: "Jun 15, 2025",
//   },
//   {
//     id: 2,
//     name: "Michael Rodriguez",
//     amount: 18500,
//     recurrence: "Bi-Weekly",
//     last: "Jun 10, 2025",
//     next: "Jun 24, 2025",
//   },
//   {
//     id: 3,
//     name: "Sarah Johnson",
//     amount: 12000,
//     recurrence: "Weekly",
//     last: "Jun 11, 2025",
//     next: "Jun 18, 2025",
//   },
//   {
//     id: 4,
//     name: "David Wilson",
//     amount: 32000,
//     recurrence: "Monthly",
//     last: "May 31, 2025",
//     next: "Jun 30, 2025",
//   },
//   {
//     id: 5,
//     name: "Jennifer Lee",
//     amount: 15750,
//     recurrence: "Bi-Weekly",
//     last: "Jun 5, 2025",
//     next: "Jun 19, 2025",
//   },
// ];

function PayrollManagement() {
  const dispatch = useDispatch();
  const [tab, setTab] = useState("payroll");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // NEW
  const [ssnInput, setSsnInput] = useState(""); // NEW
  const [ssnLoading, setSsnLoading] = useState(false); // NEW
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [checkData, setCheckData] = useState({});
  const [prefill, setPrefill] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // NEW
  const [recurrenceFilter, setRecurrenceFilter] = useState(""); // NEW
  const [amountDisplay, setAmountDisplay] = useState("$0.00");
  const [showDirectDeposit, setShowDirectDeposit] = useState(false);
const [depositEmployee, setDepositEmployee] = useState(null);
  const [payrollForm, setPayrollForm] = useState({
    user_id: "",
    amount: "",
    recurrence: "weekly"
  });

  const { user, loading: userLoading } = useSelector((state) => state.user);

  console.log("user",user);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  // Format number to words (simple version)
  function numberToWords(num) {
    if (!num) return "zero rupees only";
    // You can use a library for better conversion
    return num.toLocaleString("en-IN") + " rupees only";
  }

  // Handlers
  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    setToastMsg("New employee has been successfully added.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    e.target.reset();
  };

  const handlePayrollSubmit = async (e) => {
    e.preventDefault();
    const { user_id, amount, recurrence } = payrollForm;

    if (!user_id || !amount || !recurrence) {
      setToastMsg("All fields are required.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      await axios.post(`${BASE_URL}/payroll`, {
        user_id,
        amount,
        recurrence,
      });
      setToastMsg("New payroll entry has been successfully created.");
      setShowToast(true);
      fetchPayrollData(); // Refresh table
      setPayrollForm({ user_id: "", amount: "", recurrence: "weekly" }); // Reset form
      setAmountDisplay("$0.00");
      // Show direct deposit modal
      const emp = employeeList.find(e => e.user_id == user_id);
      setDepositEmployee(emp);
      setShowDirectDeposit(true);
    } catch (err) {
      setToastMsg(
        err.response?.data?.message || "Failed to add payroll entry."
      );
      setShowToast(true);
    } finally {
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleEditPayroll = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${BASE_URL}/payroll/${editData.id}`,
        {
          amount: editData.amount,
          recurrence: editData.recurrence,
        }
      );
      setShowEditModal(false);
      setToastMsg("Payroll entry has been updated.");
      setShowToast(true);
      fetchPayrollData(); // Refresh the table
    } catch (err) {
      setToastMsg(
        err.response?.data?.message || "Failed to update payroll entry."
      );
      setShowToast(true);
    } finally {
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  

  const fetchPayrollData = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/payroll/summary`)
      .then((res) => {
        if (res.data.success) {
          
          const mappedData = res.data.data.map((rec, idx) => ({
            id: idx + 1,
            name: rec.employee_name,
            amount: parseFloat(rec.amount),
            recurrence: rec.recurrence,
            last: formatDate(rec.last_payment),
            next: formatDate(rec.next_payment),
          }));
          setPayrollRecords(mappedData);
        }
      })
      .catch((err) => console.error("Error fetching payroll summary:", err))
      .finally(() => setLoading(false));
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const employeeList = user.filter((emp) => emp.role_id === 1);

  // UI
  return (
    <div className="pm-bg-light min-vh-100 d-flex flex-column">
      {/* Header */}

      <main className="flex-grow-1 container py-4">
        {/* Tabs */}
        <div className="mb-4rounded p-1 d-inline-flex">
          {/* <button
            className={`pm-tab-btn btn btn-sm rounded-pill fw-medium me-2 ${
              tab === "employee" ? "" : "btn-outline-secondary"
            }`}
            style={
              tab === "employee"
                ? { backgroundColor: "#2ab7a9", color: "#fff" }
                : {}
            }
            onClick={() => setTab("employee")}
          >
            Add Employee
          </button> */}
          {/* <button
            className={`pm-tab-btn btn btn-sm rounded-pill fw-medium ${
              tab === "payroll" ? "" : "btn-outline-secondary"
            }`}
            style={
              tab === "payroll"
                ? { backgroundColor: "#2ab7a9", color: "#fff" }
                : {}
            }
            onClick={() => setTab("payroll")}
          >
            Add Payroll
          </button> */}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded shadow-sm p-4 mb-4 mt-2">
          {/* Add Employee Form */}
          {/* {tab === "employee" && (
            <form onSubmit={handleEmployeeSubmit}>
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3">
                <h2 className="fs-6 fw-semibold text-dark mb-2 mb-md-0">
                  Add New Employee
                </h2>
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-secondary">
                    Pre-fill from existing Staff
                  </span>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={prefill}
                      onChange={() => setPrefill(!prefill)}
                      id="pm-prefill-toggle"
                    />
                  </div>
                </div>
              </div>
              {prefill && (
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search existing Staff..."
                  />
                </div>
              )}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter employee's full name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">SSN</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="XXX-XX-XXXX"
                    required
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Enter complete address"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn px-4"
                  style={{ backgroundColor: "#2ab7a9", color: "#fff" }}
                >
                  <FaUserPlus className="me-2" /> Add New Employee
                </button>
              </div>
            </form>
          )} */}

          {/* Add Payroll Form */}
          {tab === "payroll" && (
            <form onSubmit={handlePayrollSubmit}>
              <div className="mb-3">
                <h2 className="fs-6 fw-semibold text-dark">
                  Add Payroll Entry
                </h2>
                <p className="small text-secondary mb-0">
                  Create a new payroll entry for an employee
                </p>
              </div>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Select Employee</label>
                  <select
                    className="form-select"
                    required
                    value={payrollForm.user_id}
                    onChange={e => {
                      setPayrollForm({ ...payrollForm, user_id: e.target.value });
                      setSsnInput("");
                    }}
                  >
                    <option value="">Select an employee</option>
                    {employeeList.map((emp) => (
                      <option key={emp.user_id} value={emp.user_id}>
                        {emp.first_name} {emp.last_name} {emp.email}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-decoration-none"
                    style={{ color: "#2ab7a9" }}
                    onClick={() => {
                      const emp = employeeList.find(e => e.user_id == payrollForm.user_id);
                      setSelectedEmployee(emp || null);
                      setShowEmployeeModal(true);
                    }}
                  >
                    <FaEye className="me-1" /> View employee details
                  </button>
                </div>
                {/* SSN input if employee selected and no SSN */}
                {(() => {
                  const emp = employeeList.find(e => e.user_id == payrollForm.user_id);
                  if (emp && !emp.ssn) {
                    return (
                      <div className="col-12">
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!ssnInput) return;
                            setSsnLoading(true);
                            try {
                              await axios.patch(`${BASE_URL}/teachers/${emp.user_id}/ssn`, { ssn: ssnInput });
                              emp.ssn = ssnInput;
                              setToastMsg("SSN updated successfully.");
                              setShowToast(true);
                            } catch (err) {
                              setToastMsg(err.response?.data?.message || "Failed to update SSN.");
                              setShowToast(true);
                            } finally {
                              setSsnLoading(false);
                              setTimeout(() => setShowToast(false), 3000);
                            }
                          }}
                          className="d-flex align-items-center gap-2"
                        >
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Enter SSN"
                            value={ssnInput}
                            onChange={e => setSsnInput(e.target.value)}
                            required
                            style={{ maxWidth: 180 }}
                          />
                          <button
                            type="submit"
                            className="btn btn-sm btn-primary"
                            style={{ backgroundColor: "#2ab7a9", border: 0 }}
                            disabled={ssnLoading}
                          >
                            {ssnLoading ? "Saving..." : "Add SSN"}
                          </button>
                        </form>
                      </div>
                    );
                  }
                  return null;
                })()}
                <div className="col-md-6">
                  <label className="form-label">Amount ($)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="$0.00"
                    required
                    value={amountDisplay}
                    onFocus={e => {
                      // On focus, if value is $0.00, clear for easy typing
                      if (amountDisplay === "$0.00") {
                        setAmountDisplay("");
                        setPayrollForm({ ...payrollForm, amount: "" });
                      }
                    }}
                    onChange={e => {
                      // Allow only numbers and dot, but don't format yet
                      let val = e.target.value.replace(/[^0-9.]/g, "");
                      // Only allow one dot
                      if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, "");
                      setAmountDisplay(val);
                      setPayrollForm({ ...payrollForm, amount: val });
                    }}
                    onBlur={e => {
                      // On blur, format as currency if valid, else show $0.00
                      let num = parseFloat(amountDisplay);
                      if (!amountDisplay || isNaN(num)) {
                        setAmountDisplay("$0.00");
                        setPayrollForm({ ...payrollForm, amount: "" });
                      } else {
                        setAmountDisplay(num.toLocaleString("en-US", { style: "currency", currency: "USD" }));
                        setPayrollForm({ ...payrollForm, amount: num });
                      }
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Recurrence</label>
                  <select
                    className="form-select"
                    required
                    value={payrollForm.recurrence}
                    onChange={e => setPayrollForm({ ...payrollForm, recurrence: e.target.value })}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn px-4"
                  style={{ backgroundColor: "#2ab7a9", color: "#fff" }}
                >
                  <FaMoneyCheckAlt className="me-2" /> Add Payroll Entry
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Payroll Records Table */}
        <div className="bg-white rounded shadow-sm p-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
            <h2 className="fs-6 fw-semibold text-dark mb-2 mb-md-0">
              Payroll Records
            </h2>
            <div className="d-flex flex-column flex-md-row gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search records..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select"
                value={recurrenceFilter}
                onChange={e => setRecurrenceFilter(e.target.value)}
              >
                <option value="">All Recurrences</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
         <div>
      {loading ? (
        <p>Loading payroll summary...</p>
      ) : (
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th className="text-end">Amount</th>
              <th>Recurrence</th>
              <th>Last Payment</th>
              <th>Next Payment</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrollRecords
              .filter(rec => {
                // Recurrence filter
                if (recurrenceFilter && rec.recurrence.toLowerCase() !== recurrenceFilter.toLowerCase()) return false;
                // Search filter (by name)
                if (searchTerm && !rec.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                return true;
              })
              .map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.name}</td>
                  <td className="text-end">
                    ${rec.amount.toLocaleString("en-US")}
                  </td>
                  <td>
                    <span
                      className="badge text-dark"
                      style={{ backgroundColor: "#2ab7a9", opacity: 0.9 }}
                    >
                      {rec.recurrence}
                    </span>
                  </td>
                  <td>{rec.last}</td>
                  <td>{rec.next}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center gap-3">
                      <button
                        className="btn p-0 border-0 bg-transparent"
                        title="Edit"
                        onClick={() => {
                          setEditData(rec);
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit style={{ fontSize: "18px", color: "#2ab7a9" }} />
                      </button>
                      {/* <button
                        className="btn p-0 border-0 bg-transparent"
                        title="Delete"
                      >
                        <FaTrashAlt style={{ fontSize: "18px", color: "#2ab7a9" }} />
                      </button> */}
                      {/* <button
                        className="btn p-0 border-0 bg-transparent"
                        title="Print"
                        onClick={() => {
                          setCheckData(rec);
                          setShowCheckModal(true);
                        }}
                      >
                        <FaPrint style={{ fontSize: "18px", color: "#2ab7a9" }} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
          {/* Pagination */}
          <div className="d-flex align-items-center justify-content-between mt-3">
            <span className="small text-secondary">
              Showing 1 to 5 of 12 entries
            </span>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled">
                  <button className="page-link">‹</button>
                </li>
                <li className="page-item active">
                  <button className="page-link">1</button>
                </li>
                <li className="page-item">
                  <button className="page-link">2</button>
                </li>
                <li className="page-item">
                  <button className="page-link">3</button>
                </li>
                <li className="page-item">
                  <button className="page-link">›</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>

      {/* Toast */}
      <div
        className={`toast align-items-center border-0 position-fixed top-0 end-0 m-3 ${
          showToast ? "show" : ""
        }`}
        role="alert"
        style={{ zIndex: 9999, backgroundColor: "#2ab7a9", color: "#fff" }}
      >
        <div className="d-flex">
          <div className="toast-body">{toastMsg}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
      </div>

      {/* Employee Details Modal */}
      <div
        className={`modal fade ${showEmployeeModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{ backgroundColor: "#2ab7a9", color: "#fff" }}
            >
              <h5 className="modal-title">Employee Details</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowEmployeeModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {selectedEmployee ? (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: "#2ab7a9",
                        opacity: 0.15,
                      }}
                    >
                      <i
                        className="ri-user-line"
                        style={{ color: "#2ab7a9", fontSize: "1.5rem" }}
                      ></i>
                    </div>
                    <div>
                      <h6 className="mb-0">{selectedEmployee.first_name} {selectedEmployee.last_name}</h6>
                      <small className="text-secondary">ID: {selectedEmployee.user_id}</small>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <small className="text-secondary">Email</small>
                      <br /> {selectedEmployee.email}
                    </div>
                    {selectedEmployee.phone && (
                      <div className="mb-2">
                        <small className="text-secondary">Phone Number</small>
                        <br /> {selectedEmployee.phone}
                      </div>
                    )}
                    {selectedEmployee.ssn ? (
                      <div className="mb-2">
                        <small className="text-secondary">SSN</small>
                        <br /> {selectedEmployee.ssn}
                      </div>
                    ) : null}
                    {selectedEmployee.address && (
                      <div className="mb-2">
                        <small className="text-secondary">Address</small>
                        <br /> {selectedEmployee.address}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-secondary">No employee selected.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Check Modal */}
      <div
        className={`modal fade ${showCheckModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{ backgroundColor: "#2ab7a9", color: "#fff" }}
            >
              <h5 className="modal-title">Print Check</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowCheckModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="border rounded p-4 mb-3 bg-light">
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <h4 className="fw-bold" style={{ color: "#2ab7a9" }}>
                      logo
                    </h4>
                    <div className="small text-secondary">Childcare Center</div>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">CHECK</div>
                    <div className="small text-secondary">No. 00012345</div>
                    <div className="small text-secondary">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <div className="small text-secondary">
                      PAY TO THE ORDER OF
                    </div>
                    <div className="fw-medium">{checkData.name}</div>
                  </div>
                  <div className="text-end">
                    <div className="small text-secondary">AMOUNT</div>
                    <div className="fw-medium">
                    ${checkData.amount?.toLocaleString("en-US")}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="small text-secondary">AMOUNT IN WORDS</div>
                  <div className="small">{numberToWords(checkData.amount)}</div>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <div className="text-secondary small">MEMO</div>
                    <div className="small">Salary Payment</div>
                  </div>
                  <div className="text-end">
                    <div
                      className="border-bottom"
                      style={{ width: 120, height: 24 }}
                    ></div>
                    <div className="text-secondary small mt-1">
                      AUTHORIZED SIGNATURE
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="ri-download-line me-1"></i> Download
                </button>
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: "#2ab7a9", color: "#fff" }}
                >
                  <i className="ri-printer-line me-1"></i> Print Check
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Payroll Modal */}
      <div
        className={`modal fade ${showEditModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{ backgroundColor: "#2ab7a9", color: "#fff" }}
            >
              <h5 className="modal-title">Edit Payroll Entry</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowEditModal(false)}
              ></button>
            </div>
            <form
              onSubmit={handleEditPayroll}
            >
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Employee Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.name || ""}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editData.amount || ""}
                    onChange={e =>
                      setEditData({ ...editData, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Recurrence</label>
                  <select
                    className="form-select"
                    value={editData.recurrence || ""}
                    onChange={e =>
                      setEditData({ ...editData, recurrence: e.target.value })
                    }
                    required
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm text-white"
                  style={{ backgroundColor: "#2ab7a9" }}
                >
                  Update Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showDirectDeposit && (
  <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header" style={{ backgroundColor: "#2ab7a9", color: "#fff" }}>
          <h5 className="modal-title">Setup Direct Deposit</h5>
          <button type="button" className="btn-close btn-close-white" onClick={() => setShowDirectDeposit(false)}></button>
        </div>
        <div className="modal-body">
          <p>
            Setup direct deposit for <strong>{depositEmployee?.first_name} {depositEmployee?.last_name}</strong> using Plaid integration.
          </p>
          <button
            className="btn btn-success"
            onClick={() => {
              // TODO: Integrate Plaid direct deposit setup here
              setShowDirectDeposit(false);
              setToastMsg("Direct deposit setup started (demo only).");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
          >
            Start Direct Deposit Setup
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default PayrollManagement;
