import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Pagination } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash, FaFile, FaClipboardList } from 'react-icons/fa';

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
// import { deleteChild, getChildren } from '../../../redux/slices/childSlice'
// import { useConfirmDelete } from '../../../hooks/useCustomDelete';

import axios from 'axios';

import SleepLogForm from './Logs/SleepLogForm';
import DiaperLogForm from './Logs/DiaperLogForm';
import MealsForm from './Logs/MealsForm';
import ActivityForm from './Logs/ActivityForm';
import AddChild from '../AdminDashboard/ChildrenManagement/AddChild';
import EditChild from '../AdminDashboard/ChildrenManagement/EditChild';
import ViewChild from '../AdminDashboard/ChildrenManagement/ViewChild';
import { deleteChild, getChildren } from '../../redux/slices/childSlice';
import { useConfirmDelete } from '../../hooks/useCustomDelete';
import { reusableColor } from '../ReusableComponent/reusableColor';
import { BASE_URL } from '../../utils/config';
import NotesForm from './Logs/NotesForm';

const StaffChildrenManagement = () => {
  const dispatch = useDispatch();

  //   const { child , loading, error } = useSelector((state) => state.child);
  // console.log("child !!" , child);

  // useEffect(() => {
  //       dispatch(getChildren())
  // }, 
  // [dispatch])

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedChildData, setSelectedChildData] = useState(null);
  console.log("SelectedChildData,", selectedChildData);
  const [searchQuery, setSearchQuery] = useState('');
  const tableRef = useRef();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

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
      if (res.data && res.data.child) {
        setSelectedChildData(res.data);
        if (action === "view") setShowViewModal(true);
        if (action === "edit") setShowEditModal(true);
      }
    } catch (err) {
      alert("Failed to fetch child details");
    }
  };

  const handleModalOpen = () => {
    // Show user modal first
    setShowUserModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setUserData(null);
  };

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
  const [currentData, setCurrentData] = useState([]);
  const [isTeacherView, setIsTeacherView] = useState(false);

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


   const loggedInUser = getLoggedInUser();
 const loggeduser = loggedInUser.userId;


  const fetchChildren = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/children`);
      if (res.data.status === 200) {
        let filteredData = res.data.data.filter((child) => child.role_name === "Child" && child.is_deleted == 0);
        
        // Get logged-in user information
        const loggedInUser = getLoggedInUser();
        
        // If user role is 1 (teacher), filter children by assigned_teacher_id
        if (loggedInUser.userRole == 1 && loggedInUser.userId) {

          const loggeduser = loggedInUser.userId;

          filteredData = filteredData.filter((child) => 
            child.teacher_id == loggeduser
          );
          setIsTeacherView(true);
          console.log(`Filtering children for teacher ID: ${loggeduser}`);
        } else {
          setIsTeacherView(false);
        }
        
        const formattedData = filteredData.map((child) => ({
          child_id: child.child_id,
          user_id: child.user_id,
          name: child?.first_name + " " + child?.last_name || "",
          assigned_classroom: child.assigned_classroom || "",
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
          assigned_teacher_id: child.teacher_id,
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



  const filteredData = data.filter((child) =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    child.parent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    child.Staff.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleEditClose = () => setShowEditModal(false);
  const handleViewClose = () => {
    setShowViewModal(false);
    setSelectedChild(null);
  };

  const handleStatusChange = (indexInPage, newStatus) => {
    const globalIndex = (currentPage - 1) * itemsPerPage + indexInPage;
    const updated = [...data];
    updated[globalIndex].status = newStatus;
    setData(updated);
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

  const getMonthlySummary = () => {
    const summary = {};
    data.forEach(child => {
      const month = new Date(child.enroll).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!summary[month]) summary[month] = 0;
      summary[month]++;
    });
    return Object.entries(summary);
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

  const [showLogsModal, setShowLogsModal] = useState(false);
  const [logsChild, setLogsChild] = useState(null);
  const [activeLogTab, setActiveLogTab] = useState('sleep');

  const handleLogSubmit = (logData) => {
    // TODO: send logData to backend or store locally
    alert(`Log submitted: ${JSON.stringify(logData)}`);
    setShowLogsModal(false);
  };

  return (
    <div className=" py-4 px-2 " ref={tableRef} >
      {/* Header Buttons */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <div>
          <h3 className="fw-semibold" style={{ color: '#2ab7a9' }}>
            Children List
            {/* {isTeacherView && (
              <span className="badge bg-info ms-2" style={{ fontSize: '0.7rem' }}>
                Teacher View
              </span>
            )} */}
          </h3>
          {/* {isTeacherView && (
            <small className="text-muted">Showing only children assigned to you</small>
          )} */}
        </div>
        <div className="d-flex gap-2">
          <button className="btn text-white" style={{ backgroundColor: '#2ab7a9' }} onClick={handleDownloadPDF}>
            <FaFile size={18} className="me-1" /> Report
          </button>
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
          <AddChild userData={userData} handleClose={handleModalClose}/>
        </Modal.Body>
      </Modal>

      {/* Search Bar */}
      <div className="row g-2 mb-2">
        <input type="text" className="form-control" placeholder="Search by name, parent, or Staff..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* Data Table */}
      <div className="table-responsive bg-white p-2 rounded shadow-sm">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Enrollment Date</th>
              <th>Parent Contact</th>
              <th>Assigned Staff</th>
              <th> Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((child, idx) => (
              <tr key={idx}>
                <td>{child.name}</td>
                <td>{child.dob}</td>
                <td>{child.enroll}</td>
                <td>{child.parent}<br /><small className="text-muted">{child.phone}</small></td>
                <td>{child.teacher_first_name || '-'} {child.teacher_last_name || '-'}</td>
                {/* <td>{child.Staff}</td> */}
                <td>
                  <Form.Select size="sm" value={child.status} onChange={(e) => handleStatusChange(idx, e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Inactive"> Not active</option>
                    {/* <option value="Pending">Pending</option>
                    <option value="Provisionally Approved">Provisionally Approved</option> */}
                  </Form.Select>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      title="View"

                      // {console.log(child.child_id,"user", child.user_id)}
                      onClick={() => fetchChildDetails(child.user_id, "view")}
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      title="Edit"
                      onClick={() => fetchChildDetails(child.child_id, "edit")}
                    >
                      <FaEdit size={16} />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => handleDelete(child.child_id)}><FaTrash size={16} /></button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      title="Fill Logs/Forms"
                      onClick={() => {
                        setLogsChild(child);
                        setShowLogsModal(true);
                        setActiveLogTab('sleep');
                      }}
                    >
                      <FaClipboardList size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination className="justify-content-end mt-3 custom-pagination">
        <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
      </Pagination>

      {/* Monthly Summary */}
      {/* <div className="mt-5" ref={summaryRef}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
          <h3 className="fw-semibold" style={{ color: '#2ab7a9' }}>Monthly Enrollment Summary</h3>
          <div className="d-flex gap-2">
            <button className="btn text-white" style={{ backgroundColor: '#2ab7a9' }} onClick={handleDownloadSummaryPDF}>
              <FaFile size={18} className="me-1" /> Report
            </button>
          </div>
        </div>
        <div className="mt-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
           
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" stroke="#555">
                    <Label value="Month of Enrollment" offset={-30} position="insideBottom" />
                  </XAxis>

                  <YAxis allowDecimals={false} stroke="#555">
                    <Label
                      value="Number of Enrollments"
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
        </div>
      </div> */}


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
          <Modal.Title>Edit Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>{selectedChildData && <EditChild data={selectedChildData} />}</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>Cancel</Button>
          <Button style={{ backgroundColor: '#2ab7a9', borderColor: '#2ab7a9' }} onClick={handleEditClose}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Logs/Forms Modal */}
      <Modal show={showLogsModal} onHide={() => setShowLogsModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#2ab7a9', color: 'white' }}>
          <Modal.Title>
            Fill Logs for {logsChild?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 d-flex gap-2">
            <Button
              variant={activeLogTab === 'sleep' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveLogTab('sleep')}
            >
              Sleep Log
            </Button>
            <Button
              variant={activeLogTab === 'diaper' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveLogTab('diaper')}  
            >
              Diaper Log
            </Button>
      <Button
              variant={activeLogTab === 'meals' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveLogTab('meals')}
            >
              Meals
            </Button>
                   
            <Button
              variant={activeLogTab === 'activity' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveLogTab('activity')}
            >
              Activity
            </Button>

             <Button
              variant={activeLogTab === 'notes' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveLogTab('notes')}
            >
            Notes 
            </Button>
          </div>
          <div>
            {activeLogTab === 'sleep' && (
              <SleepLogForm child={logsChild} teacherId={loggedInUser.userId}   onSubmit={handleLogSubmit} />
            )}
            {activeLogTab === 'diaper' && (
              <DiaperLogForm child={logsChild}  changedBy={loggedInUser.userId} onSubmit={handleLogSubmit} />
            )}
            {activeLogTab === 'meals' && (
              <MealsForm child={logsChild} onSubmit={handleLogSubmit} />
            )}
            {activeLogTab === 'activity' && (
              <ActivityForm child={logsChild} onSubmit={handleLogSubmit} />
            )}

                        {activeLogTab === 'notes' && (
              <NotesForm child={logsChild} teacherId={loggedInUser.userId} onSubmit={handleLogSubmit} />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffChildrenManagement;
