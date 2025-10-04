import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Container, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { reusableColor } from "../reusableColor";
import { addUser } from "../../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { getClassroom } from "../../../redux/slices/classRoomSlice";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { fetchDCs } from "../../../redux/slices/dcSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
const AddStaff = ({ handleModalClose, userData, onStaffAdded, existingStaffData = null, isEditing = false }) => {
  const dispatch = useDispatch();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const { dc, loading: dcloading, error: dcerror } = useSelector((state) => state.dc);
  console.log("dc", dc);

  const { classroom, loading, error } = useSelector((state) => state.classroom);
  console.log("classroom", classroom);
  // Main form state - initialize with existing data if editing
  const [formData, setFormData] = useState({
    firstName: existingStaffData?.first_name || "",
    lastName: existingStaffData?.last_name || "",
    dob: existingStaffData?.dob || "",
    gender: existingStaffData?.gender || "",
    ssn: existingStaffData?.ssn || "",
    address: existingStaffData?.address || "",
    phoneNumber: existingStaffData?.phone || "",
    cellPhone: existingStaffData?.cell || "",
    emergencyContact: existingStaffData?.emergency_contact || "",
    cbcStatus: existingStaffData?.cbc_status || "",
    dcOption: existingStaffData?.dc_id || "",
    notes: existingStaffData?.notes || "",
    email: existingStaffData?.email || userData?.email || "",
    status: existingStaffData?.status || "Active",
    class: existingStaffData?.classroom_id || "",
    // Mandated/SIDS
    mandatedCourseId: existingStaffData?.mandated_course_id || "",
    mandatedCompletionDate: existingStaffData?.mandated_completion_date || "",
    mandatedExpirationDate: existingStaffData?.mandated_expiration_date || "",
    sidsCourseId: existingStaffData?.sids_course_id || "",
    sidsCompletionDate: existingStaffData?.sids_completion_date || "",
    sidsExpirationDate: existingStaffData?.sids_expiration_date || "",
    // Extra teacher fields
    teacherName: existingStaffData?.teacher_name || "",
    department: existingStaffData?.department || "",
    trainingType: existingStaffData?.training_type || "",
    lastCompleted: existingStaffData?.last_completed || "",
    dueDate: existingStaffData?.due_date || "",
    // Courses array (first course example)
    courseId: "",
    courseCompletionDate: "",
    courseExpirationDate: "",
  });

  // File input state
  const [photoFile, setPhotoFile] = useState(null);
  const [medicalFormFile, setMedicalFormFile] = useState(null);
  const [credentialsFile, setCredentialsFile] = useState(null);
  const [cbcWorksheetFile, setCbcWorksheetFile] = useState(null);
  const [authFormFile, setAuthFormFile] = useState(null);
  const [mandatedReporterCertFile, setMandatedReporterCertFile] = useState(null);
  const [preventingSidsCertFile, setPreventingSidsCertFile] = useState(null);
  const [courseCertificateFile, setCourseCertificateFile] = useState(null);


  // 1. State for multiple courses
  const [courses, setCourses] = useState([
    { courseId: "", completionDate: "", expirationDate: "", certificate: null }
  ]);

const handleEmergencyContactChange = (e) => {
  let value = e.target.value;

  // Keep only digits and limit to 10
  const digits = value.replace(/\D/g, '').substring(0, 10);

  // Format as (XXX) XXX-XXXX progressively
  let formattedPhone = "";
  if (digits.length > 6) {
    formattedPhone = `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
  } else if (digits.length > 3) {
    formattedPhone = `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}`;
  } else if (digits.length > 0) {
    formattedPhone = `(${digits}`;
  }

  setFormData((prev) => ({
    ...prev,
    emergencyContact: formattedPhone,
  }));
};


  // 1. State for available courses and course inputs
  const [availableCourses, setAvailableCourses] = useState([]);
  const [courseInputs, setCourseInputs] = useState({});

  useEffect(() => {
    axios.get(`${BASE_URL}/courses`)
      .then(res => {
        if (res.data && res.data.data) {
          setAvailableCourses(res.data.data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch courses', err);
      });
  }, []);

  // Initialize course inputs with existing data if editing
  useEffect(() => {
    if (existingStaffData && isEditing) {
      // Initialize course inputs with existing course data
      if (existingStaffData.courses) {
        const existingCourses = {};
        existingStaffData.courses.forEach(course => {
          existingCourses[course.course_id] = {
            open: true,
            completionDate: course.completion_date,
            expirationDate: course.expiration_date,
            certificate: null // Note: existing certificates would need to be handled separately
          };
        });
        setCourseInputs(existingCourses);
      }
    }
  }, [existingStaffData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Handlers for dynamic courses
  const handleCourseChange = (idx, field, value) => {
    setCourses(prev =>
      prev.map((c, i) => i === idx ? { ...c, [field]: value } : c)
    );
  };
  const handleCourseFileChange = (idx, file) => {
    setCourses(prev =>
      prev.map((c, i) => i === idx ? { ...c, certificate: file } : c)
    );
  };
  const addCourse = () => {
    setCourses(prev => [...prev, { courseId: "", completionDate: "", expirationDate: "", certificate: null }]);
  };
  const removeCourse = (idx) => {
    setCourses(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    console.log("handleSubmit called", { isDraft, isEditing });


     if (!formData.email) {
       alert("Email is required");
       return;
     }

    const fd = new FormData();

    // Main fields
    fd.append("first_name", formData.firstName || "");
    fd.append("last_name", formData.lastName || "");
    fd.append("dob", formData.dob || "");
    fd.append("ssn", formData.ssn || "");
    fd.append("gender", formData.gender || "");
    fd.append("phone", formData.phoneNumber || "");
    fd.append("cell", formData.cellPhone || "");
    fd.append("address", formData.address || "");
    fd.append("email", formData.email || "");
    fd.append("emergency_contact", formData.emergencyContact || "");
    fd.append("status", formData.status || "Active");
    fd.append("cbc_status", formData.cbcStatus || "");
    fd.append("dc_id", formData.dcOption || "");
    fd.append("classroom_id", formData.class || "");
    fd.append("notes", formData.notes || "");
    
    // Only set password for new staff
    if (!isEditing) {
      fd.append("password", userData?.password || "defaultpass123");
    }
    
    // Add draft flag
    fd.append("is_draft", isDraft);

    // Extra teacher fields
    fd.append("teacher_name", formData.teacherName || `${formData.firstName} ${formData.lastName}`.trim());
    fd.append("department", formData.department || "");
    fd.append("training_type", formData.trainingType || "");
    fd.append("last_completed", formData.lastCompleted || "");
    fd.append("due_date", formData.dueDate || "");

    // File uploads - only append if new files are selected
    if (photoFile) fd.append("photo", photoFile);
    if (medicalFormFile) fd.append("medical_form", medicalFormFile);
    if (credentialsFile) fd.append("credentials", credentialsFile);
    if (cbcWorksheetFile) fd.append("cbc_worksheet", cbcWorksheetFile);
    if (authFormFile) fd.append("auth_affirmation_form", authFormFile);
    if (mandatedReporterCertFile) fd.append("mandated_reporter_cert", mandatedReporterCertFile);
    if (preventingSidsCertFile) fd.append("preventing_sids_cert", preventingSidsCertFile);

    // Gather all filled courses and append to FormData
    const coursesArray = [];
    availableCourses.forEach((course) => {
      const input = courseInputs[course.course_id];
      if (input && input.completionDate && input.expirationDate) {
        coursesArray.push({
          course_id: course.course_id,
          completion_date: input.completionDate,
          expiration_date: input.expirationDate,
          certificate: input.certificate || null
        });
      }
    });
    
    // Append courses as JSON string
  fd.append("courses", JSON.stringify(coursesArray)); // without files

// Now append each certificate file with indexed key
coursesArray.forEach((course, index) => {
  if (course.certificate instanceof File) {
    fd.append(`certificate_url[${index}]`, course.certificate);
  }
});

    try {
      let res;
      if (isEditing) {
        // Update existing staff using PATCH method
        res = await axios.patch(`${BASE_URL}/teachers/${existingStaffData.user_id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new staff
        res = await axios.post(`${BASE_URL}/teachers`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      
      if (res.status === 200 || res.status === 201 || res.data.success) {
        const message = isDraft 
          ? `Staff draft ${isEditing ? 'updated' : 'saved'} successfully!` 
          : `Staff ${isEditing ? 'updated' : 'added'} successfully!`;
        alert(message);
        
        if (isDraft) {
          // For drafts, show outstanding requirements
          calculateOutstandingRequirements();
        } else {
          // For complete submissions, close modal
          if (onStaffAdded) onStaffAdded();
          else if (handleModalClose) handleModalClose();
        }
      } else {
        alert(isDraft 
          ? `Failed to ${isEditing ? 'update' : 'save'} draft.` 
          : `Failed to ${isEditing ? 'update' : 'add'} staff.`);
      }
    } catch (err) {
      const message = isDraft 
        ? `Error ${isEditing ? 'updating' : 'saving'} draft.` 
        : `Error ${isEditing ? 'updating' : 'adding'} staff.`;
      alert(message);
      console.error(err);
    }
  };

  const [userform, setUserform] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_id: "",
    status: "active",
  });

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserform((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [selectedCourse, setSelectedCourse] = useState("");

  const handleAddUser = (e) => {
    console.log("userForm  Called ", userform);
    e.preventDefault();

    dispatch(addUser(userform));
    setUserform({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role_id: "",
      status: "active",
    });
    setShowAddUserModal(false);
  };

  const [activeCourse, setActiveCourse] = useState(null);
  useEffect(() => {
    console.log("eudesre")
    dispatch(getClassroom());
    dispatch(fetchDCs());
  }, [dispatch]);

  useEffect(() => {
    if (userData?.email) {
      setFormData(prev => ({ ...prev, email: userData.email }));
    }
  }, [userData]);

  const toggleCourse = (course) => {
    setActiveCourse(activeCourse === course ? null : course);
  };

  const [outstanding, setOutstanding] = useState([]);

  const calculateOutstandingRequirements = () => {
    const missing = [];
    if (!formData.firstName) missing.push("First Name");
    if (!formData.lastName) missing.push("Last Name");
    if (!formData.dob) missing.push("Date of Birth");
    if (!formData.ssn || ssnError) missing.push("SSN");
    if (!formData.address) missing.push("Address");
    if (!formData.phoneNumber) missing.push("Phone Number");
    if (!formData.gender) missing.push("Gender");
    if (!formData.emergencyContact) missing.push("Emergency Contact");
    if (!formData.email) missing.push("Email");
    if (!formData.cbcStatus) missing.push("CBC Status Approval");
    if (!formData.dcOption) missing.push("DC");
    if (!formData.class) missing.push("Classroom");
    if (!medicalFormFile) missing.push("Medical Form");
    if (!credentialsFile) missing.push("Credentials");
    if (!cbcWorksheetFile) missing.push("CBC Worksheet");
    if (!authFormFile) missing.push("Authorization & Affirmation Form");

    setOutstanding(missing);
    return missing;
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    handleSubmit(e, true);
  };

  const [ssnError, setSsnError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cellPhoneError, setCellPhoneError] = useState("");

  // SSN formatting (already present)
  const handleSsnChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 9) value = value.slice(0, 9);

    let formatted = value;
    if (value.length > 5) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5)}`;
    } else if (value.length > 3) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    }

    setFormData((prev) => ({ ...prev, ssn: formatted }));

    if (value.length === 9) {
      setSsnError("");
    } else if (value.length > 0) {
      setSsnError("SSN must be 9 digits (XXX-XX-XXXX)");
    } else {
      setSsnError("");
    }
  };

  // Phone formatting
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);

    let formatted = value;
    if (value.length > 6) {
      formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length > 3) {
      formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 0) {
      formatted = `(${value}`;
    }

    setFormData((prev) => ({ ...prev, phoneNumber: formatted }));

    if (value.length === 10) {
      setPhoneError("");
    } else if (value.length > 0) {
      setPhoneError("Phone number must be 10 digits ((XXX) XXX-XXXX)");
    } else {
      setPhoneError("");
    }
  };

  // Cell phone formatting
  const handleCellPhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);

    let formatted = value;
    if (value.length > 6) {
      formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length > 3) {
      formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 0) {
      formatted = `(${value}`;
    }

    setFormData((prev) => ({ ...prev, cellPhone: formatted }));

    if (value.length === 10) {
      setCellPhoneError("");
    } else if (value.length > 0) {
      setCellPhoneError("Cell phone number must be 10 digits ((XXX) XXX-XXXX)");
    } else {
      setCellPhoneError("");
    }
  };
  return (
    <>
      <Container className="py-4">
        {/* Title and Icon */}
        <div className="mb-4 d-flex align-items-start gap-3 justify-content-between">
          <div className="d-flex align-items-center justify-content-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle"
              style={{ width: "40px", height: "40px" }}
            >
              <i className={`ri-${isEditing ? 'edit-line' : 'user-add-line'} ri-lg`}></i>
            </div>

            <h1 className="h3 mb-0" style={{ color: "#2ab7a9" }}>
              {isEditing ? 'Edit Staff' : 'Add Staff'}
            </h1>
          </div>

          {/* <button
            className="btn btn-md text-white"
            style={{ backgroundColor: "#2ab7a9" }}
            // onClick={() => setShowAddUserModal(true)}
            onClick={() => setShowAddUserModal(true)}
          >
            <FaPlus size={14} className="me-1" /> Create User
          </button> */}
        </div>
        <p className="text-muted mb-4">
          {isEditing ? 'Update the staff information below.' : 'Complete the form below to add a new Staff.'}
        </p>

        <Form onSubmit={(e) => handleSubmit(e, false)}>
          <Row className="g-4">
            {" "}
            {/* Use Row to contain sections */}
            {/* Section 1: Basic Details */}
            <Col md={6}>
              <div className="bg-white rounded shadow-sm mb-4 overflow-hidden">
                <div
                  className="px-4 py-3 border-bottom"
                  style={{ backgroundColor: "#2ab7a9", color: "white" }}
                >
                  <h2 className="h5 mb-0">Basic Details</h2>
                </div>
                <div className="p-4">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group controlId="firstName">
                        <Form.Label>
                          First Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          style={{ borderColor: "#2ab7a9" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="lastName">
                        <Form.Label>
                          Last Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          style={{ borderColor: "#2ab7a9" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="dob">
                        <Form.Label>
                          Date of Birth <span className="text-danger">*</span>
                        </Form.Label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="YYYY-MM-DD"
                            maxDate={dayjs()} // prevent future DOB
                            value={formData.dob ? dayjs(formData.dob, "YYYY-MM-DD") : null}
                            onChange={(newValue) => {
                              const formattedDate = newValue
                                ? dayjs(newValue).format("YYYY-MM-DD")
                                : "";
                              handleChange({
                                target: {
                                  name: "dob",
                                  value: formattedDate,
                                },
                              });
                            }}
                            slotProps={{
                              textField: {
                                id: "dob",
                                name: "dob",
                                size: "small",
                                fullWidth: true,
                                style: { borderColor: "#2ab7a9" },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="ssn">
                        <Form.Label>
                          SSN <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="ssn"
                          value={formData.ssn}
                          onChange={handleSsnChange}
                          placeholder="XXX-XX-XXXX"
                          style={{ borderColor: "#2ab7a9" }}
                          maxLength={11}
                          pattern="\d{3}-\d{2}-\d{4}"
                          isInvalid={!!ssnError}
                          inputMode="numeric"
                        />
                        <Form.Control.Feedback type="invalid">
                          {ssnError}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group controlId="address">
                        <Form.Label>
                          Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter full address"
                          style={{ borderColor: "#2ab7a9" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="phoneNumber">
                        <Form.Label>
                          Phone Number <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder="(XXX) XXX-XXXX"
                          style={{ borderColor: "#2ab7a9" }}
                          maxLength={14}
                          isInvalid={!!phoneError}
                          inputMode="numeric"
                        />
                        <Form.Control.Feedback type="invalid">
                          {phoneError}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="cellPhone">
                        <Form.Label>Cell Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="cellPhone"
                          value={formData.cellPhone}
                          onChange={handleCellPhoneChange}
                          placeholder="(XXX) XXX-XXXX"
                          style={{ borderColor: "#2ab7a9" }}
                          maxLength={14}
                          isInvalid={!!cellPhoneError}
                          inputMode="numeric"
                        />
                        <Form.Control.Feedback type="invalid">
                          {cellPhoneError}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          style={{ borderColor: "#2ab7a9" }}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                   <Col xs={6}>
  <Form.Group controlId="emergencyContact">
    <Form.Label>
      Emergency Contact <span className="text-danger">*</span>
    </Form.Label>
    <Form.Control
      type="text"
      name="emergencyContact"
      required
      value={formData.emergencyContact}
      onChange={handleEmergencyContactChange}
      placeholder="Emergency phone number"
      style={{ borderColor: "#2ab7a9" }}
    />
  </Form.Group>
</Col>

                    <Col xs={12}>
                      <Form.Group controlId="email">
                        <Form.Label>
                          Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={userData?.email || formData.email}
                          readOnly={!!userData?.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          style={{ borderColor: "#2ab7a9" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            {/* Section 2: Required Courses */}
            <Col md={6}>
              <div className="bg-white rounded shadow-sm mb-4 overflow-hidden">
                <div
                  className="px-4 py-3 border-bottom"
                  style={{ backgroundColor: "#2ab7a9", color: "white" }}
                >
                  <h2 className="h5 mb-0">Required Courses</h2>
                </div>
                <div className="p-4">
                  {availableCourses.map((course) => (
                    <div className="mb-3" key={course.course_id}>
                      <button
                        type="button"
                        className={`btn w-100 text-start ${courseInputs[course.course_id]?.open ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                        onClick={() =>
                          setCourseInputs((prev) => ({
                            ...prev,
                            [course.course_id]: {
                              ...prev[course.course_id],
                              open: !prev[course.course_id]?.open,
                            },
                          }))
                        }
                      >
                        {course.name}
                        {courseInputs[course.course_id]?.open && <i className="fas fa-check float-end"></i>}
                      </button>
                      {courseInputs[course.course_id]?.open && (
                        <div className="border rounded p-3 mt-2">
                          <Form.Group className="mb-3">
                            <Form.Label>Completion Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={courseInputs[course.course_id]?.completionDate || ""}
                              onChange={e =>
                                setCourseInputs((prev) => ({
                                  ...prev,
                                  [course.course_id]: {
                                    ...prev[course.course_id],
                                    completionDate: e.target.value,
                                    open: true,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Expiration Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={courseInputs[course.course_id]?.expirationDate || ""}
                              onChange={e =>
                                setCourseInputs((prev) => ({
                                  ...prev,
                                  [course.course_id]: {
                                    ...prev[course.course_id],
                                    expirationDate: e.target.value,
                                    open: true,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Upload Certificate</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={e =>
                                setCourseInputs((prev) => ({
                                  ...prev,
                                  [course.course_id]: {
                                    ...prev[course.course_id],
                                    certificate: e.target.files[0],
                                    open: true,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            {/* Section 3: Uploads & Medical Info */}
            <Col md={6}>
              <div className="bg-white rounded shadow-sm mb-4 overflow-hidden">
                <div
                  className="px-4 py-3 border-bottom"
                  style={{ backgroundColor: "#2ab7a9", color: "white" }}
                >
                  <h2 className="h5 mb-0">Uploads & Medical Info</h2>
                </div>
                <div className="p-4">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group controlId="medicalForm">
                        <Form.Label>
                          Medical Form <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="medicalForm"
                          style={{ borderColor: "#2ab7a9" }}
                          onChange={e => setMedicalFormFile(e.target.files[0])}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="credentials">
                        <Form.Label>
                          Credentials <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="credentials"
                          style={{ borderColor: "#2ab7a9" }}
                          onChange={e => setCredentialsFile(e.target.files[0])}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="cbcWorksheet">
                        <Form.Label>
                          CBC Worksheet <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="cbcWorksheet"
                          style={{ borderColor: "#2ab7a9" }}
                          onChange={e => setCbcWorksheetFile(e.target.files[0])}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="authForm">
                        <Form.Label>
                          Authorization & Affirmation Form{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="authForm"
                          style={{ borderColor: "#2ab7a9" }}
                          onChange={e => setAuthFormFile(e.target.files[0])}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            {/* Section 4: Status & Notes */}
            <Col md={6}>
              <div className="bg-white rounded shadow-sm mb-4 overflow-hidden">
                <div
                  className="px-4 py-3 border-bottom"
                  style={{ backgroundColor: "#2ab7a9", color: "white" }}
                >
                  <h2 className="h5 mb-0">Status & Notes</h2>
                </div>
                <div className="p-4">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group controlId="cbcStatus">
                        <Form.Label>
                          CBC Status Approval{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="cbcStatus"
                          value={formData.cbcStatus}
                          onChange={handleChange}
                          style={{ borderColor: "#2ab7a9" }}
                        >
                          <option value="">Select status</option>
                          <option value="approved">Approved</option>
                          <option value="notApproved">Not Approved</option>
                          <option value="provisionallyApproved">
                            Provisionally Approved
                          </option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Label>
                        For Which DC? <span className="text-danger">*</span>
                      </Form.Label>
                      {/* <div className="d-flex gap-3 mt-2">
                      <Form.Check type="radio" label="43584" name="dcOption" id="dc1" />
                      <Form.Check type="radio" label="43856" name="dcOption" id="dc2" />
                    </div> */}
                      <Form.Select
                        name="dcOption"
                        value={formData.dcOption}
                        onChange={handleChange}
                        style={{ borderColor: "#2ab7a9" }}
                      >
                        <option value="">Select DC</option>
                        {
                          dc.map((dc) => (
                            <option value={dc.id}>{dc.dcNumber}</option>
                          ))
                        }

                      </Form.Select>
                    </Col>

                    <Col md={12}>
                      <Form.Label>
                        ClassRoom <span className="text-danger">*</span>
                      </Form.Label>

                      <Form.Select
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        style={{ borderColor: "#2ab7a9" }}
                      >
                        <option value="">Select Classroom</option>
                        {
                          classroom.map((classroom) => (
                            <option value={classroom.classroom_id}>{classroom.name}</option>
                          ))
                        }
                      </Form.Select>
                    </Col>

                    <Col xs={12}>
                      <Form.Group controlId="notes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Add any additional notes..."
                          style={{ borderColor: "#2ab7a9" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          {/* Submit Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            {!isEditing && (
              <Button
                variant="outline-primary"
                onClick={handleSaveDraft}
                style={{ borderColor: "#2ab7a9", color: "#2ab7a9" }}
                type="button"
              >
                Save Draft
              </Button>
            )}
            <Button
              style={{ backgroundColor: "#2ab7a9", borderColor: "#2ab7a9" }}
              type="submit"
              onClick={(e) => handleSubmit(e, false)}
            >
              {isEditing ? 'Update Staff' : 'Save Staff'}
            </Button>
          </div>
          {outstanding.length > 0 && (
            <div className="mt-4">
              <h5>Outstanding Requirements</h5>
              <ul>
                {outstanding.map((item, idx) => (
                  <li key={idx} className="text-danger">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </Form>
      </Container>
      <Modal
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(false)}
        className="modal-dialog-centered"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: reusableColor.customTextColor,
            color: "white",
          }}
        >
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {/* <div className="mb-3">
                      <label className="form-label" >First Name</label>
                      <input type="text" className="form-control" placeholder="Enter name"
                       name='first_name'
                       value={userform.first_name}
                       onChange= {handleUserInputChange}
                      />
                    </div>

                       <div className="mb-3">
                      <label className="form-label" >Last Name</label>
                      <input type="text" className="form-control" placeholder="Enter name"
                       name='last_name'
                       value={userform.last_name}
                       onChange= {handleUserInputChange}
                      />
                    </div>
                  */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={userform.email}
                onChange={handleUserInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Password"
                name="password"
                value={userform.password}
                onChange={handleUserInputChange}
              />
            </div>
            {/* <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select className="form-select"
                       name='role_id'
                       value={userform.role_id}
                       onChange= {handleUserInputChange}
                      
                      >
                        <option value="1">Admin</option>
                        <option value="3">Secretary</option>
                        <option value="3"> Staff</option>
                        <option value="4">Child</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-select">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div> */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddUserModal(false)}
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: reusableColor.customTextColor,
              borderColor: reusableColor.customTextColor,
            }}
            onClick={handleAddUser}
          >
            Save User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddStaff;
