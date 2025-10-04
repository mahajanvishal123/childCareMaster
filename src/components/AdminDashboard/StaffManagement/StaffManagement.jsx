import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Pagination } from "react-bootstrap";
import html2pdf from 'html2pdf.js';
import {  FaPlus,  FaInfoCircle,  FaFileAlt,
  FaEye,FaEdit,FaTrash,
  FaPen,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from 'recharts';

import AddStaff from './AddStaff';
import CourseTable from "./CourseTable";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { useConfirmDelete } from '../../../hooks/useCustomDelete';
import Swal from "sweetalert2";
const StaffManagement = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
const [teacherDetails, setTeacherDetails] = useState(null);

  // Modal states for Add Staff and Credentials
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState(null);

  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const tableRef = useRef();
  const { confirmAndDelete } = useConfirmDelete();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaffList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredStaffList.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // User credentials form state
  const [userform, setUserform] = useState({ email: '', password: '' });

  // Staff list and loading
  const [staffList, setStaffList] = useState([]);

  console.log("stafflist", staffList);
  const [loading, setLoading] = useState(true);

  // Fetch staff list
  const fetchStaffList = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/teachers`)
      .then((res) => {
        console.log("res.data", res.data);
        if (res.data) {
          const mapped = res.data.map((item) => ({
            id: item.user_id,
            initials: `${ item.first_name ? item.first_name[0] || '' : ''}${ item.last_name ? item.last_name[0] || '' : ''}`.toUpperCase()  || '',
            name: `${item?.first_name} ${item?.last_name}`,
            email: item?.email,
            dob: new Date(item?.dob).toLocaleDateString(),
            courses: ["CPR", "First Aid"],
            qualifications: item?.notes || "N/A",
            approval: item?.cbc_status,
            immunizations: item?.status,
            documents: [
              { url: item?.photo, name: "Photo" },
              { url: item?.medical_form, name: "Medical Form" },
              { url: item?.credentials, name: "Credentials" },
              { url: item?.cbc_worksheet, name: "CBC Worksheet" },
              { url: item?.auth_affirmation_form, name: "Auth Affirmation" },
              { url: item?.mandated_reporter_cert, name: "Mandated Reporter" },
              { url: item?.preventing_sids_cert, name: "SIDS Cert" },
            ]
          }));
       
          setStaffList(mapped);
          setFilteredStaffList(mapped);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaffList();
  }, []);



  useEffect(() => {
    const filtered = staffList.filter((staff) => {
      const searchTarget = `${staff.name} ${staff.qualifications}`.toLowerCase();
      return searchTarget.includes(searchQuery.toLowerCase());
    });
    setFilteredStaffList(filtered);
  }, [searchQuery, staffList]);


  //getby id
  const fetchTeacherById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/teachers/${id}`);
    setTeacherDetails(res.data);
  } catch (err) {
    console.error("Error fetching teacher details:", err);
  }
};

  // Download PDF
  const handleDownloadPDF = () => {
    const element = tableRef.current;
    const opt = {
      margin: 0.3,
      filename: 'staff-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  // Chart data
  const chartData = (() => {
    const summary = {};
    staffList.forEach(staff => {
      const status = (staff.approval || '').toLowerCase();
      summary[status] = (summary[status] || 0) + 1;
    });
    return Object.keys(summary).map(status => ({
      status: status,
      count: summary[status]
    }));
  })();

  // Modal handlers
const handleViewOpen = async (staff) => {
  await fetchTeacherById(staff.id); // Fetch full details
  setShowViewModal(true);
};
 const handleViewClose = () => {
  setTeacherDetails(null);
  setShowViewModal(false);
};
const handleEditOpen = async (staff) => {
  try {
    // Fetch full staff details for editing
    const res = await axios.get(`${BASE_URL}/teachers/${staff.id}`);
    if (res.data) {
      setSelectedStaffForEdit(res.data);
      setShowEditModal(true);
    }
  } catch (err) {
    console.error("Error fetching staff details for edit:", err);
    alert("Failed to fetch staff details for editing");
  }
};

const handleEditClose = () => {
  setSelectedStaffForEdit(null);
  setShowEditModal(false);
};

const handleStaffUpdated = () => {
  fetchStaffList();
  setShowEditModal(false);
  setSelectedStaffForEdit(null);
};

  const handleSaveChanges = () => {
    // Implement save logic here
    setShowEditModal(false);
  };

  // Add Staff Modal flow
  const handleAddNewStaff = () => {
    setShowStaffModal(true);
    setUserData(null);
  };
  const handleStaffModalClose = () => {
    setShowStaffModal(false);
    setUserData(null);
  };
  const handleOpenUserModal = () => setShowUserModal(true);
  const handleUserModalClose = () => setShowUserModal(false);

  // User credentials form handlers
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserform((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddUser = (e) => {
    e.preventDefault();
    setUserData(userform);
    setShowUserModal(false);
    setUserform({ email: '', password: '' });
  };

  // After staff added
  const handleStaffAdded = () => {
    fetchStaffList();
    setShowStaffModal(false);
    setUserData(null);
  };

  // Delete staff
  const HandleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/teachers/${id}`);
        await Swal.fire("Deleted!", "Staff has been deleted.", "success");
        fetchStaffList && fetchStaffList();
      } catch (err) {
        Swal.fire("Error", "Failed to delete staff.", "error");
      }
    }
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#fff" }} ref={tableRef}>
      <div className="row mb-3 align-items-center">
        <div className="col-md-6 col-12">
          <h3 className="fw-semibold mb-2 mb-md-0" style={{ color: "#2ab7a9" }}>
            Staff List
          </h3>
        </div>
        <div className="col-md-6 col-12 text-md-end">
          <div className="d-flex flex-wrap justify-content-md-end gap-2">
            {/* <button
              className="btn btn-sm text-white"
              style={{ backgroundColor: "#2ab7a9" }}
              onClick={handleDownloadPDF}
            >
              <FaFileAlt className="me-1" /> Download Report
            </button> */}
            <button
              className="btn btn-sm text-white"
              style={{ backgroundColor: "#2ab7a9" }}
              onClick={handleAddNewStaff}
            >
              <FaPlus size={14} className="me-1" /> Add New Staff
            </button>
          </div>
        </div>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Staff Name or Qualification"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="table-responsive bg-white p-2 rounded shadow-sm ">
         <div className="table-responsive bg-white p-2 rounded shadow-sm ">
      <table className="table table-bordered align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Staff Name</th>
            <th className="d-none d-sm-table-cell">Date of Birth</th>
            <th className="d-none d-md-table-cell">Required Courses</th>
            <th className="d-none d-lg-table-cell">Qualifications</th>
            <th>Approval Status</th>
            <th>Immunizations</th>
            <th>Documents</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="9" className="text-center text-muted">
                Loading...
              </td>
            </tr>
          )}

          {!loading &&
            currentItems.map((staff, idx) => (
              <tr key={idx}>
                <td>
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle text-white d-flex justify-content-center align-items-center me-2"
                      style={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: "#2ab7a9",
                      }}
                    >
                      {staff.initials}
                    </div>
                    <div>
                      <strong>{staff.name}</strong>
                      <div className="text-muted" style={{ fontSize: "0.875rem" }}>
                        {staff.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="d-none d-sm-table-cell">{staff.dob}</td>

                <td className="d-none d-md-table-cell">
                  {staff.courses.map((course, i) => (
                    <span
                      key={i}
                      className={`badge bg-${getCourseColor(course)} me-1`}
                    >
                      {course}
                    </span>
                  ))}
                </td>

                <td className="d-none d-lg-table-cell">{staff.qualifications}</td>

                <td>
                  <span
                    className={`badge bg-${getApprovalColor(staff.approval)}`}
                  >
                    {staff.approval}
                  </span>
                </td>

                <td>
                  <i
                    className={`bi ${
                      staff.immunizations === "Completed"
                        ? "bi-check-circle-fill text-success"
                        : "bi-exclamation-circle-fill text-warning"
                    } me-1`}
                  ></i>
                  {staff.immunizations}
                </td>

                <td className="text-center">
                  {staff.documents?.some((doc) => doc.url) ? (
                    staff.documents.map(
                      (doc, i) =>
                        doc.url && (
                          <a
                            key={i}
                            href={doc.url}
                            download
                            title={doc.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="me-1"
                          >
                            <FaFileAlt size={20} color="#2ab7a9" />
                          </a>
                        )
                    )
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>

                <td className="text-center">
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      title="View"
                      onClick={() => handleViewOpen(staff)}
                    >
                      <FaEye size={16} />
                    </button>
                       <button
                      className="btn btn-sm btn-outline-secondary"
                      title="View"
                      onClick={() => handleEditOpen(staff)}
                    >
                      <FaPen size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
                      onClick={() => HandleDelete(staff.id)}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

          {!loading && staffList.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center text-muted">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
    {totalPages > 1 && (
  <nav className="mt-3 d-flex justify-content-end">
    <ul className="pagination mb-0">
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          style={{ color: "#2ab7a9" }}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
      </li>

      {Array.from({ length: totalPages }, (_, i) => (
        <li
          key={i}
          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
        >
          <button
            className="page-link"
            style={{
              color: currentPage === i + 1 ? "#fff" : "#2ab7a9",
              backgroundColor: currentPage === i + 1 ? "#2ab7a9" : "transparent",
              borderColor: "#2ab7a9",
            }}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        </li>
      ))}

      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button
          className="page-link"
          style={{ color: "#2ab7a9" }}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
)}

    </div>
     </div>

        {/* Add Staff Modal */}
        <Modal show={showStaffModal} onHide={handleStaffModalClose} size="xl" centered>
          <Modal.Header closeButton style={{ backgroundColor: '#2ab7a9', color: 'white' }}>
            <Modal.Title>Add New Staff</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Button to open credentials modal */}
            <div className="mb-3 text-end">
              <Button   style={{ backgroundColor: "#2ab7a9" }}
             className="btn btn-sm text-white border-0"
                onClick={handleOpenUserModal}
              >
                Add Staff User Credentials
              </Button>
            </div>
            <AddStaff userData={userData} handleModalClose={handleStaffModalClose} onStaffAdded={handleStaffAdded} />
          </Modal.Body>
        </Modal>

        {/* Staff User Credentials Modal */}
        <Modal show={showUserModal} onHide={handleUserModalClose} className='modal-dialog-centered' centered>
          <Modal.Header closeButton style={{ backgroundColor: '#2ab7a9', color: 'white' }}>
            <Modal.Title>Staff User Credentials</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddUser}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={userform.email} onChange={handleUserInputChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="password" value={userform.password} onChange={handleUserInputChange} required />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleUserModalClose}>Cancel</Button>
                <Button style={{ backgroundColor: '#2ab7a9', borderColor: '#2ab7a9' }} type="submit">
                  Save Credentials
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
     

      {/* View Modal */}
      <Modal show={showViewModal} onHide={handleViewClose} centered dialogClassName="modal-lg">
        <Modal.Header closeButton style={{ backgroundColor: "#2ab7a9", color: "white" }}>
          <Modal.Title>Staff Profile</Modal.Title>
        </Modal.Header>
      <Modal.Body>
  {teacherDetails ? (
    <div className="p-2">
      {/* Personal Information */}
      <div className="border rounded mb-3 p-3 shadow-sm">
        <h5 className="mb-3"><FaInfoCircle className="me-2" /> Personal Information</h5>
        <div className="row">
          <div className="col-md-6"><strong>Full Name:</strong> {teacherDetails.first_name} {teacherDetails.last_name}</div>
          <div className="col-md-6"><strong>Date of Birth:</strong> {new Date(teacherDetails.dob).toLocaleDateString()}</div>
          <div className="col-md-6"><strong>Gender:</strong> {teacherDetails.gender}</div>
          <div className="col-md-6"><strong>Email:</strong> {teacherDetails.email}</div>
          <div className="col-md-6"><strong>Phone:</strong> {teacherDetails.phone}</div>
          <div className="col-md-6"><strong>Cell:</strong> {teacherDetails.cell}</div>
          <div className="col-md-6"><strong>Emergency Contact:</strong> {teacherDetails.emergency_contact}</div>
          <div className="col-md-6"><strong>Approval Status:</strong> {teacherDetails.cbc_status}</div>
        </div>
      </div>

      {/* Contact & Address */}
      <div className="border rounded mb-3 p-3 shadow-sm">
        <h5 className="mb-3"><FaInfoCircle className="me-2" /> Contact & Address</h5>
        <div className="row">
          <div className="col-md-12"><strong>Address:</strong> {teacherDetails.address}</div>
        </div>
      </div>

      {/* Department & Training */}
      <div className="border rounded mb-3 p-3 shadow-sm">
        <h5 className="mb-3"><FaInfoCircle className="me-2" /> Department & Training</h5>
        <div className="row">
          <div className="col-md-6"><strong>Department:</strong> {teacherDetails.department}</div>
          <div className="col-md-6"><strong>Training Type:</strong> {teacherDetails.training_type}</div>
          <div className="col-md-6"><strong>Last Completed:</strong> {new Date(teacherDetails.last_completed).toLocaleDateString()}</div>
          <div className="col-md-6"><strong>Due Date:</strong> {new Date(teacherDetails.due_date).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Documents */}
      <div className="border rounded mb-2 p-3 shadow-sm">
        <h5 className="mb-3"><FaFileAlt className="me-2" /> Documents</h5>
        <div className="d-flex flex-wrap gap-2">
          {teacherDetails.photo && <a href={teacherDetails.photo} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Photo</a>}
          {teacherDetails.medical_form && <a href={teacherDetails.medical_form} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Medical Form</a>}
          {teacherDetails.credentials && <a href={teacherDetails.credentials} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Credentials</a>}
          {teacherDetails.cbc_worksheet && <a href={teacherDetails.cbc_worksheet} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">CBC Worksheet</a>}
          {teacherDetails.auth_affirmation_form && <a href={teacherDetails.auth_affirmation_form} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Auth Affirmation</a>}
          {teacherDetails.mandated_reporter_cert && <a href={teacherDetails.mandated_reporter_cert} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Mandated Reporter</a>}
          {teacherDetails.preventing_sids_cert && <a href={teacherDetails.preventing_sids_cert} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">SIDS Cert</a>}
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center text-muted">Loading details...</div>
  )}
</Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={handleViewClose}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditClose} size="xl" centered>
        <Modal.Header closeButton style={{ backgroundColor: "#2ab7a9", color: "white" }}>
          <Modal.Title>Edit Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddStaff 
            existingStaffData={selectedStaffForEdit}
            isEditing={true}
            handleModalClose={handleEditClose}
            onStaffAdded={handleStaffUpdated}
          />
        </Modal.Body>
      </Modal>


      {/* <div className="mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0 fw-semibold" style={{ color: "#2ab7a9" }}>Staff Approval Summary</h5>
            <button
              className="btn btn-sm text-white"
              style={{ backgroundColor: "#2ab7a9" }}
              onClick={handleDownloadPDF}
            >
              <FaFileAlt className="me-1" /> Download Report
            </button>
          </div>
          <div className="card-body mt-3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" stroke="#555">
                  <Label value="Approval Status" offset={-10} position="insideBottom" />
                </XAxis>
                <YAxis allowDecimals={false} stroke="#555">
                  <Label
                    value="Number of Staffs"
                    angle={-90}
                    position="insideLeft"
                    offset={-10}
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <Tooltip />
                <Bar dataKey="count" fill="#2ab7a9" radius={[5, 5, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div> */}

      {/* Course Table */}
      <CourseTable />
    </div>
  );
};

const getCourseColor = (course) => {
  switch (course) {
    case "First Aid": return "info";
    case "Child Development": return "secondary";
    case "Safety": return "success";
    case "CPR": return "danger";
    default: return "primary";
  }
};

const getApprovalColor = (status) => {
  switch (status) {
    case "Approved": return "success";
    case "Provisionally Approved": return "warning";
    case "Not Approved": return "danger";
    default: return "secondary";
  }
};

export default StaffManagement;