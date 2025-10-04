import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Pagination, Badge } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash, FaFile, FaPencilAlt } from 'react-icons/fa';
import AddChild from './AddChild';
import ViewChild from './ViewChild';
import html2pdf from 'html2pdf.js';
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
import { useDispatch, useSelector } from 'react-redux';
import { deleteChild, getChildren } from '../../../redux/slices/childSlice';
import { useConfirmDelete } from '../../../hooks/useCustomDelete';
import { reusableColor } from '../reusableColor';
import axios from 'axios';
import { BASE_URL } from '../../../utils/config';

const ChildrenManagement = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedChildData, setSelectedChildData] = useState(null);
  console.log("SelectedChildData,", selectedChildData);
  const [searchQuery, setSearchQuery] = useState('');
  const tableRef = useRef();
  const [loading, setLoading] = useState(true);


  // User form state
  const [userform, setUserform] = useState({
    email: "",
    password: "",
  });

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserform((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    console.log("Child User Credentials:", userform);

    // Store user data to pass to child form
    setUserData(userform);

    // Close user modal and open child modal
    setShowUserModal(false);
    setShowModal(true);

    // Reset user form
    setUserform({
      email: "",
      password: "",
    });
  };


  const fetchChildDetails = async (childId, action) => {
    console.log("ChildId", childId)
    try {
      const res = await axios.get(`${BASE_URL}/children/${childId}`);
      console.log("Fetched Child Details:", res.data);
      if (res.data && res.data.child) {
        setSelectedChildData(res.data);
        if (action === "view") setShowViewModal(true);
        if (action === "edit") setShowEditModal(true);
      }
    } catch (err) {
      alert("Failed to fetch child details");
    }
  };

  // const handleModalOpen = () => {
  //   // Show user modal first
  //   setShowUserModal(true);
  // };

  // const handleModalClose = () => {
  //   setShowModal(false);
  //   setUserData(null);
  // };

  const handleUserModalClose = () => {
    setShowUserModal(false);
    setUserData(null);
  };


  const { confirmAndDelete } = useConfirmDelete();

  const handleDelete = (id) => {
    confirmAndDelete({
      id,
      action: deleteChild,
      entity: "child",
      onSuccess: () => {
        dispatch(getChildren());
        fetchChildren();
      },
    });

  };


  const [data, setData] = useState([]);
  const [isTeacherView, setIsTeacherView] = useState(false);
  const [currentData, setCurrentData] = useState([]);

  console.log("currentData", currentData);

  // Get logged-in user information from localStorage
  const getLoggedInUser = () => {
    try {
      // Based on the localStorage structure shown in the image
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('user_id');
      
      console.log('localStorage user:', user);
      console.log('localStorage role:', role);
      console.log('localStorage user_id:', userId);
      
      return {
        userId: userId || user.user_id,
        userRole: role || user.role_id
      };
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return { userId: null, userRole: null };
    }
  };

  // ✅ pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // total pages
  const totalPages = Math.ceil(currentData.length / itemsPerPage);

  // slice data
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const fetchChildren = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/children`);
      console.log("Fetched Children:", res.data.data);
      if (res.data.status === 200) {
        let filteredData = res.data.data.filter((child) => child.role_name === "Child" && child.is_deleted == 0);
        
        // Get logged-in user information
        const loggedInUser = getLoggedInUser();
        
        // If user role is 1 (teacher), filter children by assigned_teacher_id
        if (loggedInUser.userRole == 1 && loggedInUser.userId) {
          filteredData = filteredData.filter((child) => 
            child.assigned_teacher_id == loggedInUser.userId
          );
          setIsTeacherView(true);
          console.log(`Filtering children for teacher ID: ${loggedInUser.userId}`);
        } else {
          setIsTeacherView(false);
        }
        
        const formattedData = filteredData.map((child) => ({
          child_id: child.child_id,
          user_id: child.user_id,
       name: `${child.first_name || ""} ${child.last_name || ""}`.trim(),
 
          dob: child.dob_english
            ? new Date(child.dob_english).toLocaleDateString()
            : "-",
          enroll: child.enrollment_date
            ? new Date(child.enrollment_date).toLocaleDateString()
            : "-",
          parent: `${child.father_name || ""} & ${child.mother_name || ""}`,
          phone: child.home_phone || child.father_cell || child.mother_cell || "-",
          status: child.user_status || "Active",
          Staff: child.assigned_teacher_id ? "Assigned" : "Not Assigned",
          teacher_first_name: child.teacher_first_name,
          teacher_last_name: child.teacher_last_name,
          assigned_teacher_id: child.assigned_teacher_id,
          is_draft: child.is_draft,
          // ...add other fields as needed
        }));
        setData(formattedData);
        setCurrentData(formattedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch children on mount
  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
  const filtered = data.filter((child) => {
    const fullTeacherName = `${child.teacher_first_name || ""} ${child.teacher_last_name || ""}`;
    const combined = `${child.name} ${child.parent} ${fullTeacherName}`.toLowerCase();
    return combined.includes(searchQuery.toLowerCase());
  });

  setCurrentData(filtered);
}, [searchQuery, data]);


  

  const handleEditClose = () => setShowEditModal(false);
  const handleViewClose = () => {
    setShowViewModal(false);
    setSelectedChild(null);
  };



  const summaryRef = useRef();

  const handleDownloadSummaryPDF = () => {
    const element = summaryRef.current;
    const options = {
      margin: 0.3,
      filename: 'monthly-enrollment-summary.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  };


  const handleDownloadPDF = () => {
    const element = tableRef.current;
    const options = {
      margin: 0.3,
      filename: 'children-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  };

 
  const chartData = (() => {
    const monthMap = {};
    data.forEach(child => {
      const date = new Date(child.enroll);
      const month = date.toLocaleString('default', { month: 'short' });
      monthMap[month] = (monthMap[month] || 0) + 1;
    });
    return Object.keys(monthMap).map(month => ({
      month,
      count: monthMap[month]
    }));
  })();

  return (
    <div className=" py-4 px-2 " ref={tableRef} >
      {/* Header Buttons */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <div>
          <h3 className="fw-semibold" style={{ color: '#2ab7a9' }}>
            Children List
            {isTeacherView && (
              <span className="badge bg-info ms-2" style={{ fontSize: '0.7rem' }}>
                Teacher View
              </span>
            )}
          </h3>
          {isTeacherView && (
            <small className="text-muted">Showing only children assigned to you</small>
          )}
        </div>
        <div className="d-flex gap-2">
          {/* <button className="btn text-white" style={{ backgroundColor: '#2ab7a9' }} onClick={handleDownloadPDF}>
            <FaFile size={18} className="me-1" /> Report
          </button> */}
          {!isTeacherView && (
            <button className="btn text-white" style={{ backgroundColor: '#2ab7a9' }} onClick={handleModalOpen}>
              <FaPlus size={18} className="me-1" /> Add New Child
            </button>
          )}
        </div>
      </div>

      {/* Add Child User Credentials Modal */}
      <Modal show={showUserModal} onHide={handleUserModalClose} className='modal-dialog-centered' centered>
        <Modal.Header closeButton style={{ backgroundColor: reusableColor.customTextColor, color: "white" }}>
          <Modal.Title>Child User Credentials</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <p className="text-muted">
              <i className="fas fa-info-circle me-2"></i>
              First, set up the child's user account credentials. These will be used for the child's login access.
            </p>
          </div>
          <form onSubmit={handleAddUser}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name='email'
                value={userform.email}
                onChange={handleUserInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name='password'
                value={userform.password}
                onChange={handleUserInputChange}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUserModalClose}>Cancel</Button>
          <Button
            style={{ backgroundColor: reusableColor.customTextColor, borderColor: reusableColor.customTextColor }}
            onClick={handleAddUser}
          >
            Continue to Child Details
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Child Modal */}
      <Modal show={showModal} onHide={handleModalClose} size="xl" centered>
        <Modal.Header closeButton style={{ backgroundColor: '#2ab7a9', color: 'white' }}>
          <Modal.Title>Add New Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddChild userData={userData} setUserData={setUserData} handleClose={handleModalClose}    onSaveSuccess={() => {
      fetchChildren();
      handleModalClose();
    }}/>
        </Modal.Body>
      </Modal>

      {/* Search Bar & Rows Per Page Selector */}
      <div className="row g-2 mb-2 align-items-center">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, parent, or Staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <label className="me-2 fw-semibold">Rows per page:</label>
          <select
            className="form-select"
            style={{ width: "auto", display: "inline-block" }}
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing rows per page
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <>
      {/* Table */}
      <div className="table-responsive bg-white p-2 rounded shadow-sm">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Enrollment Date</th>
              <th>Parent Contact</th>
              <th>Assigned Staff</th>
             
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((child, idx) => (
              <tr key={idx}>
                <td>{idx+1}</td>
                <td>
                  {child.name}
              {Boolean(child.is_draft) && (
  <Badge bg="warning" text="dark" className="ms-2">
    Draft
  </Badge>
)}


                </td>
                <td>{child.dob}</td>
                <td>{child.enroll}</td>
                <td>
                  {child.parent}
                  <br />
                  <small className="text-muted">{child.phone}</small>
                </td>
                <td>
                  {child.teacher_first_name || "-"}{" "}
                  {child.teacher_last_name || "-"}
                </td>
               
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      title="View"
                      onClick={() => fetchChildDetails(child.user_id, "view")}
                    >
                      <FaEye size={16} />
                    </button>
                    {/* <button
                      className="btn btn-sm btn-outline-primary"
                      title="Edit"
                      onClick={() => fetchChildDetails(child.child_id, "edit")}
                    >
                      <FaEdit size={16} />
                    </button> */}
                    {/* {child.is_draft && (
                      <button
                        className="btn btn-sm btn-outline-warning"
                        title="Complete Draft"
                        onClick={() =>
                          fetchChildDetails(child.child_id, "edit")
                        }
                      >
                        <FaPencilAlt size={16} />
                      </button>
                    )} */}
                     
                      <button
                        className="btn btn-sm btn-outline-warning"
                        title="Complete Draft"
                        onClick={() =>
                          fetchChildDetails(child.user_id, "edit")
                        }
                      >
                        <FaPencilAlt size={16} />
                      </button>
                
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
                      onClick={() => handleDelete(child.child_id)}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination controls */}
      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-end">
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
                    backgroundColor: currentPage === i + 1 ? "#2ab7a9" : "",
                    borderColor: "#2ab7a9",
                    color: currentPage === i + 1 ? "white" : "#2ab7a9",
                  }}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
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

      {/* ✅ Rows per page selector */}
   
    </>
    

      {/* View Modal */}
      <Modal show={showViewModal} onHide={handleViewClose} centered dialogClassName="modal-lg">
        <Modal.Header closeButton style={{ backgroundColor: '#2ab7a9', color: 'white' }}>
          <Modal.Title>View Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedChildData && <ViewChild data={selectedChildData} />}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="light" onClick={handleViewClose}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditClose} centered dialogClassName="modal-lg">
        <Modal.Header closeButton style={{ backgroundColor: '#2ab7a9', color: 'white' }}>
          <Modal.Title>
            {selectedChildData?.child?.is_draft ? "Complete Draft" : "Update Child"}
          </Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>
          {selectedChildData && (
            selectedChildData?.child?.is_draft ? (
              <AddChild 
                userData={{
                  email: selectedChildData.child.email || "",
                  password: ""
                }} 
                existingChildData={selectedChildData.child}
                isCompletingDraft={true}
                handleClose={handleEditClose}
                onSaveSuccess={() => {
                  fetchChildren();
                  handleEditClose();
                }}
              />
            ) : (
              <EditChild 
                data={selectedChildData} 
                onSaveSuccess={() => {
                  fetchChildren();
                  handleEditClose();
                }} 
              />
            )
          )}
        </Modal.Body> */}


<Modal.Body>
  <AddChild 
    userData={{
      email: selectedChildData?.child?.email || "",
      password: ""
    }} 
    existingChildData={selectedChildData?.child || {}} 
    isCompletingDraft={!!selectedChildData?.child?.is_draft}
    handleClose={handleEditClose}
    onSaveSuccess={() => {
      fetchChildren();
      handleEditClose();
    }}
  />
</Modal.Body>


        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChildrenManagement;
