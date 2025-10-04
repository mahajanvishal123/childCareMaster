import React, { useEffect, useRef, useState } from 'react';
import toast from "react-hot-toast";
import { reusableColor } from '../reusableColor';
import { Modal, Button, } from "react-bootstrap";
import { html2pdf } from 'html2pdf.js';
import { useDispatch, useSelector } from 'react-redux';
import AddChild from '../ChildrenManagement/AddChild';
import { addUser, deleteUser, getUsers, updateUser } from '../../../redux/slices/userSlice';
import { addDC, deleteDC, fetchDCs } from '../../../redux/slices/dcSlice';
import { useConfirmDelete } from '../../../hooks/useCustomDelete';
import { showToastPromise } from '../../../utils/showToastPromise';
import UserManagementTab from './UserManagementTab';
import AddDcTab from './AddDcTab';
import AddClassRoomTab from './ClassroomTab';
import { BASE_URL } from '../../../utils/config';
import axios from 'axios';



const   Setting = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);

  const { user, error, loading } = useSelector((state) => state.user);
  const { dc, dcerror, dcloading } = useSelector((state) => state.dc);


  console.log("DC ", dc);

  console.log("USERS !!", user);


  const getroles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/roles`);
      
      console.log("ROLES !!", response.data);
      setRoles(response.data);
    } catch (error) {
      console.log("ERROR !!", error);
    }
  }

  useEffect(() => {
    getroles();
  }, []);

 
  const [newDcNumber, setNewDcNumber] = useState('');




  const [userform, setUserform] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_id: "",
    status: "active"
  });

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserform((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   const handleAddUser = (e) => {
  //     console.log("userForm  Called ",userform)
  //     e.preventDefault();

  //      if (showEditModal) {
  //   const updatedUser = {
  //     user_id: userform.user_id, // ✅ Needed for correct API call
  //     first_name: userform.first_name,
  //     last_name: userform.last_name,
  //     role_id: userform.role_id,
  //     status: userform.status
  //   };

  //   dispatch(updateUser(updatedUser))
  // }else {
  //   dispatch(addUser(userform));
  //     }




  //       setUserform({
  //         first_name: "", 
  //         last_name: "", 
  //         email: "",
  //         password: "",
  //         role_id: "",
  //         status: "active"
  //       });
  //     setShowAddUserModal(false);
  //   }
  const handleCloseModal = () => {
    setShowAddUserModal(false);
    setShowEditModal(false);
    setUserform({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role_id: "",
      status: "active"
    });
  }

  const handleAddUser = async (e) => {
    e.preventDefault();

    const requiredFields = [
      { key: "first_name", label: "First Name", type: "string" },
      { key: "last_name", label: "Last Name", type: "string" },
      { key: "email", label: "Email", type: "string" },
      { key: "password", label: "Password", type: "string" },
      { key: "role_id", label: "Role", type: "number" }
    ];

    // Check for empty fields
    for (let field of requiredFields) {
      if (field.type === "string") {
        if (!userform[field.key] || userform[field.key].trim() === "") {
          toast.error(`${field.label} is required`);
          return;
        }
      } else if (field.type === "number") {
        if (!userform[field.key] && userform[field.key] !== 0) {
          toast.error(`${field.label} is required`);
          return;
        }
      }
    }

    // Check for duplicate email (only on add, not edit)
    if (!showEditModal) {
      const exists = user.some(
        (u) => u.email?.toLowerCase() === userform.email.trim().toLowerCase()
      );
      if (exists) {
        toast.error("Email already exists");
        return;
      }
    }

    const payload = {
      user_id: userform.user_id,
      first_name: userform.first_name,
      last_name: userform.last_name,
      email: userform.email,
      password: userform.password,
      role_id: userform.role_id,
      status: userform.status || "",
    };

    const action = showEditModal
      ? updateUser(payload)
      : addUser(payload);

    try {
      const result = await dispatch(action).unwrap();

      // Reset form and close modal on success
      setUserform({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role_id: "",
        status: "active"
      });
      setShowAddUserModal(false);
      setShowEditModal(false);
      dispatch(getUsers());

      toast.success(showEditModal ? "User updated!" : "User added!");
    } catch (err) {
      console.log("err", err)
      // Handle the error directly instead of using showToastPromise
      const errorMessage = err || err?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Error:", err);
    }
  };


  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch])

  const loggedInUser = 1;


  const handleAddDc = async (e) => {
    e.preventDefault();

    if (!newDcNumber.trim()) {
      toast.error("DC Number cannot be empty");
      return;
    }

    const exists = dc.some(dcItem => dcItem.dcNumber === newDcNumber.trim());
    if (exists) {
      toast.error("DC number already exists");
      return;
    }

    const payload = {
      dc_number: newDcNumber,
      created_by: "1",
    };

    // Show loading toast
    const toastId = toast.loading("Adding DC...");

    try {
      const resultAction = await dispatch(addDC(payload));

      if (addDC.fulfilled.match(resultAction)) {
        toast.success("DC added successfully", { id: toastId });
        setNewDcNumber("");
      } else {
        throw new Error(resultAction.payload || "Failed to add DC");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    }
  };

  useEffect(() => {
    dispatch(fetchDCs());
  }, [dispatch])


  const { confirmAndDelete } = useConfirmDelete();

  const handleDelete = (id) => {
    confirmAndDelete({
      id,
      action: deleteDC,
      entity: "DC",
      onSuccess: () => {
        dispatch(fetchDCs());

      },
    });
  };


  const handleUserDelete = (id) => {
    confirmAndDelete({
      id,
      action: deleteUser,
      entity: "user",
      onSuccess: () => {
        dispatch(getUsers());

      },
    });
  };





  // Static data for the form fields
  const businessInfo = {
    name: 'KidsCare Center',
    email: 'info@kidscare.com',
    phone: '+1 (555) 123-4567',
    address: '123 Education St, Learning City, LC 12345'
  };

  // const bankDetails = {
  //   accountName: 'KidsCare LLC',
  //   accountNumber: '1234567890',
  //   bankName: 'First National Bank',
  //   routingNumber: '987654321',
  //   swiftCode: 'FNBUS12'
  // };
  const userManagement = {
    users: [
      // Removed: { id: 1, name: 'Admin User', email: 'admin@kidscare.com', role: 'Admin', status: 'Active' },
      { id: 2, name: 'Teacher 1', email: 'teacher1@kidscare.com', role: 'Teacher', status: 'Active' },
      { id: 3, name: 'Teacher 2', email: 'teacher2@kidscare.com', role: 'Teacher', status: 'Inactive' },
      { id: 4, name: 'Child User', email: 'child1@kidscare.com', role: 'Child', status: 'Active' }
    ]
  };
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // const handleEditUser = (user) => {
  //   setSelectedUser(user);
  //   setShowEditModal(true);
  // };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserform({ ...user });
    setShowEditModal(true);
  };



  const handleBankPdf = () => {
    const element = document.getElementById("bankDetailsPdf");
    const opt = {
      margin: 0.5,
      filename: "bank-details.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const plaidHandlerRef = useRef(null);
  const [isPlaidReady, setIsPlaidReady] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    accountType: '',
    accountSubtype: '',
    institutionId: ''
  });

  // 1️⃣ Load Plaid & Link
  useEffect(() => {
    // Check for stored bank details
    const storedDetails = localStorage.getItem("bankDetails");
    if (storedDetails) {
      setBankDetails(JSON.parse(storedDetails));
    }

    // Load Plaid script
    const script = document.createElement("script");
    script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    script.async = true;

    script.onload = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/plaid/create-link-token`);
        const linkToken = res.data.link_token;

        plaidHandlerRef.current = window.Plaid.create({
          token: linkToken,
          onSuccess: async (public_token, metadata) => {
            console.log("✅ Public Token:", public_token);

            const exchangeRes = await axios.post(
              `${BASE_URL}/plaid/exchange-public-token`,
              { public_token }
            );

            const accessToken = exchangeRes.data.access_token;
            localStorage.setItem("access_token", accessToken);

            const account = metadata.accounts?.[0] || {};
            const institution = metadata.institution || {};

            const details = {
              accountName: account.name || '',
              bankName: institution.name || '',
              accountNumber: account.mask || '',
              accountType: account.type || '',
              accountSubtype: account.subtype || '',
              institutionId: institution.institution_id || ''
            };

            setBankDetails(details);
            localStorage.setItem("bankDetails", JSON.stringify(details));
          },
          onExit: (err, metadata) => {
            console.log("Plaid exited", err, metadata);
          }
        });

        setIsPlaidReady(true);
      } catch (error) {
        console.error("❌ Plaid init error:", error);
      }
    };

    document.body.appendChild(script);
  }, []);

  const openPlaid = () => {
    if (plaidHandlerRef.current) {
      plaidHandlerRef.current.open();
    }
  };


  const [manualEntry, setManualEntry] = useState(false);
  const [manualBank, setManualBank] = useState({
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
  });
  const [importFile, setImportFile] = useState(null);
  const [showPayrollSetup, setShowPayrollSetup] = useState(false);

  const handleManualBankChange = (e) => {
    const { name, value } = e.target;
    setManualBank((prev) => ({ ...prev, [name]: value }));
  };

  const handleImportFileChange = (e) => {
    setImportFile(e.target.files[0]);
  };

  const handleImportTransactions = () => {
    if (!importFile) {
      toast.error("Please select a file to import.");
      return;
    }
    // TODO: Implement actual import logic (CSV/Excel parsing)
    toast.success("Transactions imported (demo only).");
  };

  const handlePayrollSetup = () => {
    // TODO: Implement payroll direct deposit setup logic
    toast.success("Payroll direct deposit setup started (demo only).");
  };


  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 fw-bold text-dark">Settings</h1>
              <p className="text-muted mb-0">Manage your application settings and preferences</p>
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="card shadow-sm mb-4">
            <div className="card-header border-bottom">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {[
                  { key: 'general', icon: 'fas fa-cog', label: 'General' },
                  { key: 'users', icon: 'fas fa-users', label: 'User Management' },

                  // { key: 'language', icon: 'fas fa-globe', label: 'Language' },
                  // { key: 'business', icon: 'fas fa-building', label: 'Business Info' },
                  { key: 'bank', icon: 'fas fa-university', label: 'Bank Details' },
                  { key: 'add-dc', icon: 'fas fa-plus-circle', label: 'Add DC' },
                  { key: 'add-class', icon: 'fas fa-plus-circle', label: ' Add ClassRoom' },

                ].map(({ key, icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`btn ${activeTab === key ? '' : 'btn-outline-light'}`}
                    style={{
                      border: '1px solid #2ab7a9',
                      color: activeTab === key ? '#fff' : '#2ab7a9',
                      backgroundColor: activeTab === key ? '#2ab7a9' : 'transparent',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <i className={`${icon}`}></i>
                    {label}
                  </button>
                ))}
              </div>

            </div>

            <div className="card-body">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="h5 fw-semibold text-dark mb-4">General Settings</h2>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <h3 className="h6 fw-medium text-dark mb-3">Notification Preferences</h3>
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-check-label text-muted">Email Notifications</label>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="email-toggle" defaultChecked />
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-check-label text-muted">SMS Notifications</label>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="sms-toggle" />
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-check-label text-muted">Push Notifications</label>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="push-toggle" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h3 className="h6 fw-medium text-dark mb-3">System Preferences</h3>
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-center justify-content-between">
                          {/* <label className="form-check-label text-muted">Dark Mode</label>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="dark-toggle" />
                          </div> */}
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-check-label text-muted">Auto Backup</label>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="backup-toggle" defaultChecked />
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-check-label text-muted">Analytics Tracking</label>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="analytics-toggle" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="h6 fw-medium text-dark mb-3">Date & Time Format</h3>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">Date Format</label>
                        <select className="form-select">
                          <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                          <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                          <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">Time Format</label>
                        <select className="form-select">
                          <option value="12">12-hour (AM/PM)</option>
                          <option value="24">24-hour</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button className="btn text-white" style={{ backgroundColor: reusableColor.customTextColor }}>
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* {activeTab === 'add-dc' && (
                <div>
                  <h2 className="h5 fw-semibold text-dark mb-4">Add DC numbers</h2>

                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Total DCs</label>
                    <input
                      type="text"
                      className="form-control"
                      value={dc.length}
                      readOnly
                    />
                  </div>
           <form

  onSubmit={(e) => {
    e.preventDefault(); 
    handleAddDc();     
  }}
>
                  <div className="row g-3 align-items-end">
         
                    <div className="col-md-6">
                      <label className="form-label fw-medium text-dark">Enter Unique DC Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., DC-1003"
                        value={newDcNumber}
                        onChange={(e) => setNewDcNumber(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn text-white w-100"
                        style={{ backgroundColor: reusableColor.customTextColor }}
                        onClick={handleAddDc}

                      >
                        Add DC
                      </button>
                    </div>
                  
                  </div>
                    </form>

                  <div className="mt-4">
                    <h5 className="text-dark mb-3">Existing DCs</h5>
                    <ul className="list-group">
                      {dc.map(dc => (
                        <li key={dc.id} className="list-group-item d-flex justify-content-between align-items-center">
                          {dc.dcNumber}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(dc.id)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )} */}



              {activeTab === 'add-dc' && (
                <AddDcTab
                  dc={dc}
                  newDcNumber={newDcNumber}
                  setNewDcNumber={setNewDcNumber}
                  handleAddDc={handleAddDc}
                  handleDelete={handleDelete}
                  reusableColor={reusableColor}
                />
              )}

              {
                activeTab === 'add-class' && (
                  <AddClassRoomTab
                    reusableColor={reusableColor}
                  />
                )

              }


              {/* {activeTab === "users" && <UserManagementTab />} */}

              {/* User Management */}
              {/* {activeTab === 'users' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h5 fw-semibold text-dark">User Management</h2>
                    <button
                      className="btn text-white d-flex align-items-center"
                      style={{ backgroundColor: reusableColor.customTextColor }}
                      onClick={() => setShowAddUserModal(true)}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add User
                    </button>

                  </div>
              { loading ? ( <div className='text-center'>"Loading .."</div>) : 
              (
                  
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Role</th>
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        { user ?  (
                        user.map((user) => (
                          <tr key={user.user_id}>
                            <td className="fw-medium">{user.first_name} {user.last_name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge bg-primary-subtle text-primary`}>
                                {user.role_name}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${user.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                {user?.status}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm text-success p-0" title="Edit" onClick={() => handleEditUser(user)}>
                                  <i className="fas fa-edit"></i>
                                </button>

                                <button className="btn btn-sm text-info p-0" title="View" onClick={() => handleViewUser(user)}>
                                  <i className="fas fa-eye"></i>
                                </button>


       <button className="btn btn-sm  text-danger p-0" onClick={() => handleUserDelete(user.user_id)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) )
                        : (
                          <tr>
                            <td colSpan="5">No users found.</td>
                          </tr>
                          )
                        }
                      </tbody>

                    </table>
                  </div>
                      )
                    }
                </div>
              )} */}

              {activeTab === 'users' && (
                <UserManagementTab
                  reusableColor={reusableColor}
                  handleEditUser={handleEditUser}
                  handleViewUser={handleViewUser}
                  setShowAddUserModal={setShowAddUserModal}
                  showAddUserModal={showAddUserModal}
                  setShowEditModal={setShowEditModal}
                  setShowViewModal={setShowViewModal}
                />
              )}

              {/* add modal */}
              <Modal show={showAddUserModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton style={{ backgroundColor: reusableColor.customTextColor, color: "white" }}>
                  <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form >
                    <div className="mb-3">
                      <label className="form-label" >First Name</label>
                      <input type="text" className="form-control" placeholder="Enter name"
                        name='first_name'
                        value={userform.first_name}
                        onChange={handleUserInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" >Last Name</label>
                      <input type="text" className="form-control" placeholder="Enter name"
                        name='last_name'
                        value={userform.last_name}
                        onChange={handleUserInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" placeholder="Enter email"
                        name='email'
                        value={userform.email}
                        onChange={handleUserInputChange}
                        required
                      />
                    </div>


                    <div className="mb-3">
                      <label className="form-label" >PassWord</label>
                      <input type="text" className="form-control" placeholder="Enter Password"
                        name='password'
                        value={userform.password}
                        onChange={handleUserInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select className="form-select"
                        name='role_id'
                        value={userform.role_id}
                        onChange={handleUserInputChange}

                      >
                        <option value="" disabled>Select Role</option>
                        {
                          roles.map((role) => (
                            <option value={role.role_id}>{role.name}</option>
                          ))
                        }



                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-select"
                        name='status'

                        value={userform.status}
                        onChange={handleUserInputChange}

                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                  <Button style={{ backgroundColor: reusableColor.customTextColor, borderColor: reusableColor.customTextColor }} onClick={handleAddUser}  >
                    Save User
                  </Button>
                </Modal.Footer>
              </Modal>


              {/*view modal  */}
              <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: "#2ab7a9", color: "white" }}>
                  <Modal.Title>View User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedUser && (
                    <div>
                      <p><strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                      <p><strong>Email:</strong> {selectedUser.email}</p>
                      <p><strong>Role:</strong> {selectedUser.name}</p>
                      <p><strong>Status:</strong> {selectedUser?.status || "N/A"}</p>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                </Modal.Footer>
              </Modal>

              {/* edit modal */}
              <Modal show={showEditModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton style={{ backgroundColor: "#2ab7a9", color: "white" }}>
                  <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedUser && (

                    <form >
                      <div className="mb-3">
                        <label className="form-label" >First Name</label>
                        <input type="text" className="form-control" placeholder="Enter name"

                          name='first_name'
                          value={userform.first_name}
                          onChange={handleUserInputChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label" >Last Name</label>
                        <input type="text" className="form-control" placeholder="Enter name"
                          name='last_name'

                          value={userform.last_name}
                          onChange={handleUserInputChange}
                        />
                      </div>


                      <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select className="form-select"
                          name='role_id'
                          value={userform.role_id}
                          onChange={handleUserInputChange}
                          required

                        >
                          <option value="" disabled>Select Role</option>
                          <option value="4">Secretary</option>
                          <option value="1"> Staff</option>
                          <option value="2">Child</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select className="form-select"
                          name='status'
                          value={userform.status}
                          onChange={handleUserInputChange}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </form>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                  <Button style={{ backgroundColor: "#2ab7a9", borderColor: "#2ab7a9" }} onClick={handleAddUser}>Save Changes</Button>
                </Modal.Footer>
              </Modal>

              {/* Business Info */}
              {/* {activeTab === 'business' && (
                <div>
                  <h2 className="h5 fw-semibold text-dark mb-4">Business Information</h2>
                  <div className="row g-4">
                    <div className="col-md-4">
                      <div className="bg-light p-4 rounded">
                        <div className="text-center mb-4">
                          <div className="mx-auto bg-white rounded-circle border overflow-hidden" style={{ width: "128px", height: "128px" }}>
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                              <i className="fas fa-building text-secondary fs-1"></i>
                            </div>
                          </div>
                          <button className="mt-3 btn btn-success">
                            Upload Logo
                          </button>
                        </div>
                        <div className="small text-muted">
                          <p className="mb-2">
                            <i className="fas fa-info-circle me-1 text-primary"></i>
                            Recommended size: 512x512 pixels
                          </p>
                          <p>
                            <i className="fas fa-info-circle me-1 text-primary"></i>
                            Supported formats: JPG, PNG, SVG
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="mb-3">
                        <label htmlFor="business-name" className="form-label fw-medium text-dark">Business Name</label>
                        <input
                          id="business-name"
                          type="text"
                          className="form-control"
                          value={businessInfo.name}
                          readOnly
                        />
                      </div>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label htmlFor="business-email" className="form-label fw-medium text-dark">Business Email</label>
                          <input
                            id="business-email"
                            type="email"
                            className="form-control"
                            value={businessInfo.email}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="business-phone" className="form-label fw-medium text-dark">Business Phone</label>
                          <input
                            id="business-phone"
                            type="tel"
                            className="form-control"
                            value={businessInfo.phone}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="business-address" className="form-label fw-medium text-dark">Business Address</label>
                        <textarea
                          id="business-address"
                          rows={3}
                          className="form-control"
                          value={businessInfo.address}
                          readOnly
                        ></textarea>
                      </div>

                      <div className="mt-4">
                        <button className="btn btn-success">
                          Save Business Information
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
              {/* Bank Details */}
              {activeTab === "bank" && (
                <div>
                  <h2 className="h5 fw-semibold text-dark mb-4 d-flex justify-content-between align-items-center">
                    Bank Details for Checks
                    <button
                      className="btn text-white btn-sm"
                      onClick={() => window.print()}
                      style={{ backgroundColor: "#2ab7a9", borderColor: "#2ab7a9" }}
                    >
                      <i className="fas fa-file-pdf me-1"></i> Download PDF
                    </button>
                  </h2>

                  <div className="mb-3 d-flex gap-2">
                    <button
                      className={`btn btn-sm ${!manualEntry ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setManualEntry(false)}
                    >
                      Connect via Plaid
                    </button>
                    <button
                      className={`btn btn-sm ${manualEntry ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setManualEntry(true)}
                    >
                      Manual Entry
                    </button>
                  </div>

                  {!manualEntry ? (
                    <div className="col-lg-8" id="bankDetailsPdf">
                      <div className="alert alert-primary mb-4">
                        <div className="d-flex">
                          <div className="flex-shrink-0">
                            <i className="fas fa-info-circle text-primary"></i>
                          </div>
                          <div className="ms-3">
                            <p className="small text-primary mb-0">
                              These bank details will be used for processing check payments. Please ensure all information is accurate.
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Plaid Connect Button */}
                      <div className="mb-3">
                        <button
                          onClick={() => {
                            openPlaid();
                            setShowPayrollSetup(true);
                          }}
                          className="btn btn-primary"
                          disabled={!isPlaidReady}
                        >
                          {isPlaidReady ? "Connect Bank via Plaid" : "Loading..."}
                        </button>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="account-name" className="form-label fw-medium text-dark">
                          Account Holder Name
                        </label>
                        <input
                          id="account-name"
                          type="text"
                          className="form-control"
                          value={bankDetails.accountName}
                          readOnly
                        />
                      </div>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label htmlFor="bank-name" className="form-label fw-medium text-dark">
                            Bank Name
                          </label>
                          <input
                            id="bank-name"
                            type="text"
                            className="form-control"
                            value={bankDetails.bankName}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="account-number" className="form-label fw-medium text-dark">
                            Account Number (Last 4)
                          </label>
                          <input
                            id="account-number"
                            type="text"
                            className="form-control"
                            value={bankDetails.accountNumber}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label htmlFor="account-type" className="form-label fw-medium text-dark">
                            Account Type
                          </label>
                          <input
                            id="account-type"
                            type="text"
                            className="form-control"
                            value={bankDetails.accountType}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="account-subtype" className="form-label fw-medium text-dark">
                            Account Subtype
                          </label>
                          <input
                            id="account-subtype"
                            type="text"
                            className="form-control"
                            value={bankDetails.accountSubtype}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="institution-id" className="form-label fw-medium text-dark">
                          Institution ID
                        </label>
                        <input
                          id="institution-id"
                          type="text"
                          className="form-control"
                          value={bankDetails.institutionId}
                          readOnly
                        />
                      </div>
                      {/* Payroll Integration */}
                      {showPayrollSetup && (
                        <div className="mb-3">
                          <button
                            className="btn btn-success"
                            onClick={handlePayrollSetup}
                          >
                            Setup Direct Deposit for Payroll
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="col-lg-8" id="bankDetailsPdf">
                      <div className="alert alert-warning mb-4">
                        <div className="d-flex">
                          <div className="flex-shrink-0">
                            <i className="fas fa-exclamation-circle text-warning"></i>
                          </div>
                          <div className="ms-3">
                            <p className="small text-warning mb-0">
                              Enter your bank details manually if you do not wish to use Plaid.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-medium text-dark">Account Holder Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="accountName"
                          value={manualBank.accountName}
                          onChange={handleManualBankChange}
                          placeholder="Enter account holder name"
                        />
                      </div>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-medium text-dark">Bank Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="bankName"
                            value={manualBank.bankName}
                            onChange={handleManualBankChange}
                            placeholder="Enter bank name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium text-dark">Routing Number</label>
                          <input
                            type="text"
                            className="form-control"
                            name="routingNumber"
                            value={manualBank.routingNumber}
                            onChange={handleManualBankChange}
                            placeholder="Enter routing number"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-medium text-dark">Account Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="accountNumber"
                          value={manualBank.accountNumber}
                          onChange={handleManualBankChange}
                          placeholder="Enter account number"
                        />
                      </div>
                      <div className="mb-3">
                        <button
                          className="btn btn-success"
                          onClick={() => toast.success("Manual bank details saved (demo only).")}
                        >
                          Save Bank Details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Import Transactions Feature */}
                  <div className="col-lg-8 mt-4">
                    <h6>Import Transactions</h6>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleImportFileChange}
                      />
                      <button className="btn btn-outline-primary btn-sm" onClick={handleImportTransactions}>
                        Import Transactions
                      </button>
                    </div>
                    <small className="text-muted">Supported formats: CSV, Excel</small>
                  </div>
                </div>
              )}



            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;