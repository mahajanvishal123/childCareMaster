import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { reusableColor } from "../reusableColor";
import { BASE_URL } from "../../../utils/config";
import { getClassroom } from "../../../redux/slices/classRoomSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// const [photoPreview, setPhotoPreview] = useState("");
// const [fileName, setFileName] = useState("");

// const handlePhotoChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPhotoPreview(e.target.result);
//     };
//     reader.readAsDataURL(file);
//     setFileName(file.name);
//   }
// };

// const handleSubmit = (e) => {
//   e.preventDefault();
//   alert("Child Added Successfully!");
// };





// const [childInfo, setChildInfo] = useState({
//   fullName: "",
//   englishNickname: "",
//   hebrewNickname: "",
//   gender: "",
//   dobEnglish: "",
//   dobHebrew: "",
//   email: "",
//   assignStaff: "",
//   enrollmentDate: "",
// });

// const handleInputChange = (e) => {
//   const { name, value } = e.target;
//   setChildInfo((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// };

const AddChild = ({ userData, setUserData, handleClose, existingChildData = null, isCompletingDraft = false, onSaveSuccess  }) => {
  const dispatch = useDispatch();
  const [photoPreview, setPhotoPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [phone, setPhone] = React.useState(""); 
  const [teachers, setTeachers] = useState([]);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userform, setUserform] = useState({
    email: userData?.email || "",
    password: userData?.password || "",
  });
  const { classroom  } = useSelector((state) => state.classroom);
  const [phones, setPhones] = useState({
    contact1: "",
    contact1Raw: "",
    contact2: "",
    contact2Raw: "",
    home_phone: '',
    home_phoneRaw: '',
    mother_cell: '',
  mother_cellRaw: '',
 father_cell: '',
  father_cellRaw: '',
  
  }); 
  // console.log(phones);

  useEffect(() => {
 
    dispatch(getClassroom());
  }, [dispatch]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
    }
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserform((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setUserData(userform); // Pass user data to parent state
    setShowUserModal(false);
    // Optionally, set email in childInfo
    setChildInfo((prev) => ({
      ...prev,
      email: userform.email,
    }));
  };




  const [childInfo, setChildInfo] = useState({
    // fullName: "",
    first_name: existingChildData?.first_name || "",
    last_name: existingChildData?.last_name || "",
    englishNickname: existingChildData?.nickname_english || "",
    hebrewNickname: existingChildData?.nickname_hebrew || "",
    gender: existingChildData?.gender ? existingChildData.gender.toLowerCase() : "",
    dobEnglish: existingChildData?.dob_english || "",
    dobHebrew: existingChildData?.dob_hebrew || "",
    email: existingChildData?.email || userData?.email || "",
    assignTeacher: existingChildData?.assigned_teacher_id || "",
    enrollmentDate: existingChildData?.enrollment_date || "",
    mother_name: existingChildData?.mother_name || "",
    father_name: existingChildData?.father_name || "",
    home_phone: existingChildData?.home_phone || "",
    mother_cell: existingChildData?.mother_cell || "",
    mother_workplace: existingChildData?.mother_workplace || "",
    father_cell: existingChildData?.father_cell || "",
    father_workplace: existingChildData?.father_workplace || "",
    number_of_children_in_family: existingChildData?.number_of_children_in_family || "",
    total_number_of_children: existingChildData?.total_number_of_children || "", //not in backend
    address: existingChildData?.address || "",
    child_id: existingChildData?.child_id || null,
    contact1: existingChildData?.emergency_contacts?.[0] || {
    name: "", phone: "", address: "", relationship_to_child: "", could_release: false
  },

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChildInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update childInfo when 
  useEffect(() => {
    if (userData) {
      setChildInfo(prev => ({
        ...prev,
        email: userData.email || "",
      }));
    }
  }, [userData]);

  
const handleSubmit = async (e, draft = false) => {
  if (e) e.preventDefault();

  if (loading) return; // already submitting

  // Check if email exists
  if (!userform?.email) {
    alert("Email is required! Please enter an email.");
    return;
  }

  try {
    setLoading(true); // 🔥 start loading

    const formData = new FormData();

    // --- Compose the child ---
    const child = {
      full_name: `${childInfo.first_name} ${childInfo.last_name}`,
      first_name: childInfo?.first_name,
      last_name: childInfo?.last_name,
      nickname_english: childInfo?.englishNickname,
      nickname_hebrew: childInfo?.hebrewNickname,
      gender:
        childInfo?.gender.charAt(0).toUpperCase() +
        childInfo.gender.slice(1),
      dob_english: childInfo?.dobEnglish,
      dob_hebrew: childInfo?.dobHebrew,
      enrollment_date: childInfo?.enrollmentDate,
      assigned_teacher_id: childInfo?.assignTeacher
        ? parseInt(childInfo.assignTeacher, 10)
        : null,
      mother_name: childInfo?.mother_name,
      father_name: childInfo?.father_name,
      home_phone: phones?.home_phone,
      mother_cell: phones?.mother_cell,
      father_cell: phones?.father_cell,
      mother_workplace: childInfo?.mother_workplace,
      father_workplace: childInfo?.father_workplace,
      number_of_children_in_family: childInfo?.number_of_children_in_family,
      total_number_of_children: childInfo?.total_number_of_children,
      email: childInfo.email,
      address: childInfo.address,
      assigned_classroom:
        document.getElementById("classroom")?.value || "",
      notes: document.getElementById("Notes")?.value || "",
      nap_time_instructions:
        document.getElementById("Nap")?.value || "",
      password: userform.password || undefined,
      is_draft: isCompletingDraft ? 0 : draft ? 1 : 0,
      child_id: childInfo.child_id || undefined,
    };

    // --- Emergency contacts ---
    const emergencyContacts = [];
    const contact1 = {
      name: document.getElementById("contact1Name")?.value || "",
      phone: document.getElementById("contact1Phone")?.value || "",
      address: document.getElementById("contact1Address")?.value || "",
      relationship_to_child:
        document.getElementById("contact1Relationship")?.value || "",
      could_release:
        document.getElementById("canRelease1")?.checked || false,
    };
    const contact2 = {
      name: document.getElementById("contact2Name")?.value || "",
      phone: document.getElementById("contact2Phone")?.value || "",
      address: document.getElementById("contact2Address")?.value || "",
      relationship_to_child:
        document.getElementById("contact2Relationship")?.value || "",
      could_release:
        document.getElementById("canRelease2")?.checked || false,
    };
    if (contact1.name && contact1.phone) emergencyContacts.push(contact1);
    if (contact2.name && contact2.phone) emergencyContacts.push(contact2);

    // --- Medical info ---
    const medical_info = {
      physician_name: medicalForm.physician_name,
      physician_phone: medicalForm.physician_phone,
      allergies: medicalForm.has_allergies === "yes" ? "Yes" : "No",
      early_intervention_services:
        medicalForm.intervention === "yes" ? "Yes" : "No",
      medical_notes: medicalForm.medical_notes || "",
    };

    // --- Append data ---
    formData.append("child", JSON.stringify(child));
    formData.append("emergency_contacts", JSON.stringify(emergencyContacts));
    formData.append("medical_info", JSON.stringify(medical_info));
    formData.append("vaccines", JSON.stringify(vaccines));
    formData.append("vaccine_exempted", vaccineExempted);

    // --- Files ---
    const photo = document.querySelector("#photoInput")?.files[0];
    const authForm = document.querySelector("#authorizationFormInput")?.files[0];
    const immunizationRecord = document.querySelector("#immunizationRecordInput")?.files[0];
    const medicalFormFile = document.querySelector("#medicalFormInput")?.files[0];
    const lunchForm = document.querySelector("#lunchFormInput")?.files[0];
    const agreementDocs = document.querySelector("#agreementDocsInput")?.files;
    const specialNeedsApp = medicalForm.special_needs_doc;

    if (photo) formData.append("photo", photo);
    if (authForm) formData.append("auth_affirmation_form", authForm);
    if (immunizationRecord) formData.append("immunization_record", immunizationRecord);
    if (medicalFormFile) formData.append("medical_form", medicalFormFile);
    if (specialNeedsApp) formData.append("special_needs_app", specialNeedsApp);
    if (lunchForm) formData.append("lunch_form", lunchForm);
    if (agreementDocs && agreementDocs.length > 0) {
      for (let i = 0; i < agreementDocs.length; i++) {
        formData.append("agreement_docs", agreementDocs[i]);
      }
    }

    // --- Debug ---
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // --- API call ---
    const isUpdating = existingChildData && existingChildData.user_id;
    const url = isUpdating
      ? `${BASE_URL}/children/${existingChildData.user_id}`
      : `${BASE_URL}/children/add-child`;

    const res = await fetch(url, {
      method: isUpdating ? "PATCH" : "POST",
      body: formData,
    });

    const result = await res.json();

    if (res.status === 200 || res.status === 201) {
      let message = "";
      if (isCompletingDraft) {
        message = "Draft completed successfully!";
      } else if (isUpdating) {
        message = "Child updated successfully!";
      } else {
        message = draft ? "Draft saved!" : "Child added successfully!";
      }

      alert(message);
      onSaveSuccess();
      handleClose();
    } else {
      alert(result.message || "Something went wrong!");
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    alert("Error while submitting form!");
  } finally {
    setLoading(false); // 🔥 stop loading always
  }
};



 const [medicalForm, setMedicalForm] = useState({
  physician_name: existingChildData?.medical_info?.physician_name || "",
  physician_phone: existingChildData?.medical_info?.physician_phone || "",
  physician_phoneRaw: existingChildData?.medical_info?.physician_phone?.replace(/\D/g, '').substring(0,10) || "",
  has_allergies: existingChildData?.medical_info?.allergies === "Yes" ? "yes" : "no",
  allergy_details: existingChildData?.medical_info?.allergy_details || "",
  vaccine_info: existingChildData?.medical_info?.vaccine_info || "",
  medical_form: null,
  intervention: existingChildData?.medical_info?.early_intervention_services === "Yes" ? "yes" : "no",
  intervention_details: existingChildData?.medical_info?.intervention_details || "",
  special_needs_doc: null,
  medical_notes: existingChildData?.medical_info?.medical_notes || ""
});


// Handler for phone input inside medicalForm
const handleMedicalPhoneChange = (e) => {
  const { name, value } = e.target;
  const raw = value.replace(/\D/g, '').substring(0, 10);
  const formatted = formatPhoneNumber(raw);

  setMedicalForm((prev) => ({
    ...prev,
    [name]: formatted,       // formatted value for display
    [`${name}Raw`]: raw      // raw value for backend
  }));
};

  const handleMedicalInputChange = (e) => {
    const { name, value } = e.target;
    setMedicalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTeachers = async () => {
    const res = await fetch(`${BASE_URL}/teachers`);
    const data = await res.json();
    console.log(data);
    setTeachers(data);
  }

  useEffect(() => {
    getTeachers();
  }, []);


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setMedicalForm(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleMedicalSubmit = (e) => {
    e.preventDefault();
    console.log("Medical Info Submitted", medicalForm);
    // Store medical info in state for form submission
    setShowMedicalModal(false);
  };

  // Format phone number for display
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '').substring(0, 10);
    const areaCode = digits.substring(0, 3);
    const middle = digits.substring(3, 6);
    const last = digits.substring(6, 10);

    if (digits.length > 6) {
      return `(${areaCode}) ${middle}-${last}`;
    } else if (digits.length > 3) {
      return `(${areaCode}) ${middle}`;
    } else if (digits.length > 0) {
      return `(${areaCode}`;
    }
    return '';
  };

  // Handle change
  const handleFormattedPhoneChange = (e) => {
    const { name, value } = e.target;
    const raw = value.replace(/\D/g, '').substring(0, 10); // only digits
    const formatted = formatPhoneNumber(raw);

    setPhones((prev) => ({
      ...prev,
      [name]: formatted,
      [`${name}Raw`]: raw
    }));
  };

  const [uploadedFiles, setUploadedFiles] = useState({
    medicalForm: '',
    immunizationRecord: '',
    lunchForm: '',
    authorizationForm: '',
    agreementDocs: '',
  });

  // Add vaccine state
  const [vaccines, setVaccines] = useState(existingChildData?.vaccines || []);
  const [vaccineInput, setVaccineInput] = useState({ name: "", date_administered: "" });
  const [vaccineExempted, setVaccineExempted] = useState(existingChildData?.vaccine_exempted || false);

  // Initialize data from existingChildData when it changes
  useEffect(() => {
    if (existingChildData) {
      // Update vaccines if available
      if (existingChildData.vaccines) {
        setVaccines(existingChildData.vaccines);
      }

      // Update vaccine exemption status
      if (existingChildData.vaccine_exempted !== undefined) {
        setVaccineExempted(existingChildData.vaccine_exempted);
      }
    }
  }, [existingChildData]);

  const handleVaccineInputChange = (e) => {
    const { name, value } = e.target;
    setVaccineInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddVaccine = (e) => {
    e.preventDefault();
    if (vaccineInput.name) {
      setVaccines((prev) => [...prev, vaccineInput]);
      setVaccineInput({ name: "", date_administered: "" });
    }
  };

  const handleRemoveVaccine = (idx) => {
    setVaccines((prev) => prev.filter((_, i) => i !== idx));
  };

  // Vaccine schedule logic (same as backend)
  const immunizationSchedule = [
    { ageInMonths: 2, required: ['HEPB', 'HIB', 'PCV', 'POLIO', 'DTAP'] },
    { ageInMonths: 4, required: ['HEPB', 'HIB', 'PCV', 'POLIO', 'DTAP'] },
    { ageInMonths: 6, required: ['DTAP', 'PCV'] },
    { ageInMonths: 12, required: ['MMR', 'VARICELLA'] },
    { ageInMonths: 15, required: ['HIB', 'PCV'] },
    { ageInMonths: 18, required: ['HEPB', 'POLIO', 'DTAP'] },
    { ageInMonths: 6.5, required: ['FLU'] }, // after 6 months, must have flu shot
  ];

  function calculateAgeInMonths(dob) {
    if (!dob) return 0;
    const now = new Date();
    // Accepts 'DD-MM-YYYY'
    const [day, month, year] = dob.split('-');
    const birthDate = new Date(`${year}-${month}-${day}`);
    return (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
  }

  function getRequiredVaccines(ageInMonths) {
    return [
      ...new Set(
        immunizationSchedule
          .filter((entry) => ageInMonths >= entry.ageInMonths)
          .flatMap((entry) => entry.required)
      ),
    ];
  }

  const [suggestedVaccines, setSuggestedVaccines] = useState([]);

  useEffect(() => {
    // Update suggested vaccines when dobEnglish changes
    if (childInfo.dobEnglish) {
      const ageInMonths = calculateAgeInMonths(childInfo.dobEnglish);
      setSuggestedVaccines(getRequiredVaccines(ageInMonths));
    } else {
      setSuggestedVaccines([]);
    }
  }, [childInfo.dobEnglish]);


  return (
    <div className="bg-light min-vh-100 py-3">
      <div className="">
        {/* Header */}
        {/* <div className="d-flex align-items-center gap-3 mb-4">
          <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{ width: "40px", height: "40px" }}>
          
          </div>
          <h1 className="h4 mb-0">Add New Child</h1>
        </div> */}

        <div className="mb-4 d-flex align-items-start gap-3 justify-content-between">
          <div className='d-flex align-items-center justify-content-center gap-3' >
            <div
              className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="fas fa-user-plus"></i>
            </div>

            <h1 className="h3 mb-0" style={{ color: '#2ab7a9' }}>
              {isCompletingDraft ? (
                <>
                  Complete Draft   
                  <span className="badge bg-warning ms-2 fs-6">Draft</span>
                </>
              ) : (
                "Add Child"
              )}
            </h1>
          </div>

          {userData && (
            <div className="alert alert-info mb-0">
              <i className="fas fa-info-circle me-2"></i>
              Child user credentials set: {userData.email}
            </div>
          )}  

        </div>

        {/* Add User Button */}
  <div className="d-flex justify-content-end mb-2">
  {!userData?.email && (
    <button
      className="btn btn-success"
      type="button"
      onClick={() => setShowUserModal(true)}
    >
      + Create User
    </button>
  )}
</div>


        {/* Form */}
        <div className="container my-4">
          <form onSubmit={handleSubmit}>
            {/* Section 1: Child's Photo */}
            <div className="card shadow-sm mb-4">
              <div className="bg-light px-3 px-md-4 py-2 py-md-3 border-bottom d-flex align-items-center gap-2">
                <i className="fas fa-camera text-primary me-2"></i>
                <h2 className="h5 mb-0">Child's Photo</h2>
              </div>
              <div className="p-3 p-md-4">
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 w-100">
                  <div className="position-relative" style={{ width: "120px", height: "120px", minWidth: "120px", borderRadius: "50%", backgroundColor: "#f1f5f9" }}>
                    {photoPreview ? ( 
                      <img src={photoPreview} alt="Preview" className="img-fluid w-100 h-100 object-fit-cover rounded-circle" />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                        <i className="fas fa-user fa-2x"></i>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="position-absolute w-100 h-100 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-grow-1 w-100 mt-4">
                    <p className="mb-2 small">Upload child's photo (JPG/PNG)</p>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        readOnly
                        placeholder="No file chosen"
                        value={fileName || ""}
                      />
                      <label className="btn btn-outline-secondary btn-sm" htmlFor="photoInput">
                        Choose File
                      </label>
                      <input type="file" id="photoInput" hidden onChange={handlePhotoChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Child Information */}
            <div className="card shadow-sm mb-4">
              <div className="bg-light px-3 px-md-4 py-2 py-md-3 border-bottom d-flex align-items-center gap-2">
                <i className="fas fa-id-card text-primary me-2"></i>
                <h2 className="h5 mb-0">Child Information</h2>
              </div>
              <div className="p-3 p-md-4">
                <div className="row g-2 g-md-3">
                  {/* <div className="col-12 col-md-6">
                    <label htmlFor="fullName" className="form-label small">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={childInfo.fullName}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                      
                      placeholder="Enter child's full name"
                    />
                  </div> */}
                  <div className="col-6 col-md-6">
                    <label htmlFor="first_name" className="form-label small">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={childInfo.first_name}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"

                      placeholder="Enter child's first name"
                    />
                  </div>
                  <div className="col-6 col-md-6">
                    <label htmlFor="last_name" className="form-label small">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={childInfo.last_name}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"

                      placeholder="Enter child's last name"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="englishNickname" className="form-label small">
                      Nickname (English)
                    </label>
                    <input
                      type="text"
                      id="englishNickname"
                      name="englishNickname"
                      value={childInfo.englishNickname}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                      placeholder="Optional nickname"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="hebrewNickname" className="form-label small">
                      Nickname (Hebrew)
                    </label>
                    <input
                      type="text"
                      id="hebrewNickname"
                      name="hebrewNickname"
                      value={childInfo.hebrewNickname}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                      placeholder="Optional nickname"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="gender" className="form-label small">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={childInfo.gender}
                      onChange={handleInputChange}
                      className="form-select form-select-sm"

                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="dobEnglish" className="form-label small d-block">
                      Date of Birth (English) <span className="text-danger">*</span>
                    </label>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={childInfo.dobEnglish ? dayjs(childInfo.dobEnglish, 'DD-MM-YYYY') : null}
                        onChange={(newValue) => {
                          const formattedDate = newValue ? dayjs(newValue).format('DD-MM-YYYY') : '';
                          handleInputChange({
                            target: {
                              name: 'dobEnglish',
                              value: formattedDate,
                            },
                          });
                        }}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>


                  <div className="col-12 col-md-6">
                    <label htmlFor="dobHebrew" className="form-label small">
                      Date of Birth (Hebrew)
                    </label>
                    <input
                      type="text"
                      id="dobHebrew"
                      name="dobHebrew"
                      value={childInfo.dobHebrew}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                      notRequired

                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="email" className="form-label small">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={childInfo.email}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="address" className="form-label small">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={childInfo.address}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                      placeholder="Enter address"
                    />
                  </div>

                  {/* ✅ Assign Teacher */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="assignTeacher" className="form-label small">
                      Assign Staff <span className="text-danger">*</span>
                    </label>
                    <select
                      id="assignTeacher"
                      name="assignTeacher"
                      value={childInfo.user_id}
                      onChange={handleInputChange}
                      className="form-select form-select-sm"

                    >
                      <option value="">Select teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.user_id} value={teacher.user_id}>{teacher.first_name} {teacher.last_name}</option>
                      ))}
                    </select>
                  </div>

                  {/* ✅ Enrollment Date */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="enrollmentDate" className="form-label small d-block">
                      Enrollment Date <span className="text-danger">*</span>
                    </label>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={
                          childInfo.enrollmentDate
                            ? dayjs(childInfo.enrollmentDate, 'DD-MM-YYYY')
                            : null
                        }
                        onChange={(newValue) => {
                          const formattedDate = newValue
                            ? dayjs(newValue).format('DD-MM-YYYY')
                            : '';

                          handleInputChange({
                            target: {
                              name: 'enrollmentDate',
                              value: formattedDate,
                            },
                          });
                        }}
                        slotProps={{
                          textField: {
                            id: 'enrollmentDate',
                            name: 'enrollmentDate',
                            size: 'small',
                            fullWidth: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>

                </div>
              </div>
            </div>

            {/* Section 3: Parent Details */}
            <div className="card shadow-sm mb-4">
              <div className="bg-light px-3 px-md-4 py-2 py-md-3 border-bottom d-flex align-items-center gap-2">
                <i className="fas fa-users text-success me-2"></i>
                <h2 className="h5 mb-0">Parent Details</h2>
              </div>
              <div className="p-3 p-md-4">
                <div className="row g-2 g-md-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="mother_name" className="form-label small">Mother's Name <span className="text-danger">*</span></label>
                    <input type="text" id="mother_name" className="form-control form-control-sm" placeholder="Enter mother's full name"
                      onChange={handleInputChange}
                      name="mother_name"
                      value={childInfo.mother_name}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="father_name" className="form-label small">Father's Name <span className="text-danger">*</span></label>
                    <input type="text" id="father_name" className="form-control form-control-sm" placeholder="Enter father's full name"
                      onChange={handleInputChange}
                      name="father_name"
                      value={childInfo.father_name}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="home_phone" className="form-label small">Home Phone Number <span className="text-danger">*</span></label>
                    <input
                      type="tel"
                      id="home_phone"
                      className="form-control form-control-sm"
                      placeholder="(XXX) XXX-XXXX"
                      onChange={handleFormattedPhoneChange}
                      name="home_phone"
                      value={phones.home_phone}
                    />


                  </div>
<div className="col-12 col-md-6">
  <label htmlFor="mother_cell" className="form-label small">
    Mother's Cell Number <span className="text-danger">*</span>
  </label>
  <input
    type="tel"
    id="mother_cell"
    className="form-control form-control-sm"
    placeholder="(XXX) XXX-XXXX"
    onChange={handleFormattedPhoneChange}
    name="mother_cell"
    value={phones.mother_cell}   // ✅ use the formatted state
  />
</div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="mother_workplace" className="form-label small">Mother's Workplace</label>
                    <input type="text" id="mother_workplace" className="form-control form-control-sm" placeholder="Enter workplace name"
                      onChange={handleInputChange}
                      name="mother_workplace"
                      value={childInfo.mother_workplace}
                    />
                  </div>
                <div className="col-12 col-md-6">
  <label htmlFor="father_cell" className="form-label small">
    Father's Cell Number
  </label>
  <input
    type="tel"
    id="father_cell"
    className="form-control form-control-sm"
    placeholder="(XXX) XXX-XXXX"
    onChange={handleFormattedPhoneChange}
    name="father_cell"
    value={phones.father_cell}   // ✅ use formatted state
  />
</div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="father_workplace" className="form-label small">Father's Workplace</label>
                    <input type="text" id="father_workplace" className="form-control form-control-sm" placeholder="Enter workplace name"
                      onChange={handleInputChange}
                      name="father_workplace"
                      value={childInfo.father_workplace}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="number_of_children_in_family" className="form-label small">Number of Children in Family</label>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <input type="number" id="number_of_children_in_family" className="form-control form-control-sm w-auto" placeholder="#" min="0"
                        onChange={handleInputChange}
                        name="number_of_children_in_family"
                        value={childInfo.number_of_children_in_family} />
                      <span className="text-muted small">of</span>
                      <input type="number" id="total_number_of_children" className="form-control form-control-sm w-auto" placeholder="#" min="0" 
                       onChange={handleInputChange}
                        name="total_number_of_children"
                        value={childInfo.total_number_of_children}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="btn btn-md text-white w-100 mb-3"
              style={{ backgroundColor: "#2ab7a9" }}

              // onHide={() => setShowMedicalModal(false)} 

              onClick={() => setShowMedicalModal(true)}
            >
              <FaPlus size={14} className="me-1" /> Medical Info
            </div>



            {/* Section 4: Emergency Contacts */}
            <div className="card shadow-sm mb-4 overflow-hidden">
              <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
                <i className="ri-phone-line text-primary fs-5"></i>
                <h2 className="h5 mb-0">Emergency Contacts</h2>
              </div>
              <div className="p-4">
                <h5>Contact 1</h5>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="contact1Name" className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact1Name"
                      className="form-control"

                      placeholder="Full name"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="contact1Phone" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contact1Phone"
                      name="contact1"
                      className="form-control"
                      value={phones.contact1}
                      onChange={handleFormattedPhoneChange}
                      placeholder="(XXX) XXX-XXXX"
                      maxLength={14}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="contact1Address" className="form-label">
                      Address
                    </label>
                    <textarea
                      id="contact1Address"
                      rows="3"
                      className="form-control"
                      placeholder="Enter address"
                    ></textarea>
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="contact1Relationship" className="form-label">
                      Relationship to Child <span className="text-danger">*</span>
                    </label>
                    <select id="contact1Relationship" className="form-select" >
                      <option value="">Select relationship</option>
                      <option value="grandparent">Grandparent</option>
                      <option value="aunt-uncle">Aunt/Uncle</option>
                      <option value="neighbor">Neighbor</option>
                      <option value="family-friend">Family Friend</option>
                      <option value="Cousin">Cousin</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="canRelease1"
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor="canRelease1">
                        Could Release
                      </label>

                    </div>
                  </div>
                </div>
                <hr />
                <h5>Contact 2</h5>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="contact2Name" className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact2Name"
                      className="form-control"

                      placeholder="Full name"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="contact2Phone" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contact2Phone"
                      name="contact2"
                      className="form-control"
                      value={phones.contact2}
                      onChange={handleFormattedPhoneChange}
                      placeholder="(XXX) XXX-XXXX"
                      maxLength={14}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="contact2Address" className="form-label">
                      Address
                    </label>
                    <textarea
                      id="contact2Address"
                      rows="3"
                      className="form-control"
                      placeholder="Enter address"
                    ></textarea>
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="contact2Relationship" className="form-label">
                      Relationship to Child <span className="text-danger">*</span>
                    </label>
                    <select id="contact2Relationship" className="form-select" >
                      <option value="">Select relationship</option>
                      <option value="grandparent">Grandparent</option>
                      <option value="aunt-uncle">Aunt/Uncle</option>
                      <option value="neighbor">Neighbor</option>
                      <option value="family-friend">Family Friend</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="canRelease2"
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor="canRelease1">
                        Could Release
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Classroom Assignment */}
            <div className="card shadow-sm mb-4 overflow-hidden">
              <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
                <i className="ri-book-line text-primary fs-5"></i>
                <h2 className="h5 mb-0">Classroom Assignment</h2>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <label htmlFor="classroom" className="form-label">
                    Assigned Classroom <span className="text-danger">*</span>
                  </label>
                  <select id="classroom" className="form-select" >
                    <option value="">Select a classroom</option>
                    {
                      classroom.map((classroom) => (
                        <option key={classroom.classroom_id} value={classroom.classroom_id}>{classroom.name}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className=" row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label htmlFor="Notes" className="form-label">
                  Notes
                </label>
                <textarea
                  id="Notes"
                  rows="3"
                  className="form-control"
                  placeholder="Notes"
                ></textarea>
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="Nap" className="form-label">
                  Nap Time Instructions
                </label>
                <textarea
                  id="Nap"
                  rows="3"
                  className="form-control"
                  placeholder="Nap Time Instructions"
                ></textarea>
              </div>
            </div>

            {/* Section 6: Document Uploads */}
            <div className="card shadow-sm mb-4 overflow-hidden">
              <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
                <i className="ri-file-upload-line text-primary fs-5"></i>
                <h2 className="h5 mb-0">Documents</h2>
              </div>
              <div className="p-4">
{/* Medical Form */}
<div className="mb-3">
  <label htmlFor="medicalFormInput" className="form-label">Medical Form</label>
  <input type="file" className="form-control" id="medicalFormInput" name="medical_form_url" onChange={handleFileChange} />
</div>

{/* Immunization Record */}
<div className="mb-3">
  <label htmlFor="immunizationRecordInput" className="form-label">Immunization Record</label>
  <input type="file" className="form-control" id="immunizationRecordInput" name="immunization_record_url" onChange={handleFileChange} />
</div>

{/* Lunch Form */}
<div className="mb-3">
  <label htmlFor="lunchFormInput" className="form-label">Upload Lunch Form</label>
  <input type="file" className="form-control" id="lunchFormInput" name="lunch_form" onChange={handleFileChange} />
</div>

{/* Authorization Form */}
<div className="mb-3">
  <label htmlFor="authorizationFormInput" className="form-label">Authorization/Affirmation Form</label>
  <input type="file" className="form-control" id="authorizationFormInput" name="auth_affirmation_form_url" onChange={handleFileChange} />
</div>

{/* Agreement Docs */}
<div className="mb-3">
  <label htmlFor="agreementDocsInput" className="form-label">Agreement Documents</label>
  <input type="file" className="form-control" id="agreementDocsInput" name="agreement_docs_url" onChange={handleFileChange} multiple />
</div>

{/* Special Needs Application (if required) */}
{/* <div className="mb-3">
  <label htmlFor="specialNeedsAppInput" className="form-label">Special Needs Application</label>
  <input type="file" className="form-control" id="specialNeedsAppInput" name="special_needs_app_url" onChange={handleFileChange} />
</div> */}


              </div>
            </div>


            {/* Submit Buttons */}
         <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
  {!isCompletingDraft && (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={(e) => handleSubmit(e, true)}
      disabled={loading} // disable if loading
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2"></span>
          Saving...
        </>
      ) : (
        "Save Draft"
      )}
    </button>
  )}

  <button
    type="submit"
    className="btn btn-success btn-sm"
    onClick={(e) => handleSubmit(e, false)}
    disabled={loading} // disable if loading
  >
    {loading ? (
      <>
        <span className="spinner-border spinner-border-sm me-2"></span>
        Submitting...
      </>
    ) : isCompletingDraft ? (
      "Complete Draft"
    ) : (
      "Submit Form"
    )}
  </button>
</div>

          </form>
        </div>

      </div>


      <Modal show={showMedicalModal} onHide={() => setShowMedicalModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#2ab7a9", color: "white" }}>
          <Modal.Title>Medical Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Physician’s Name  <span className="text-danger">*</span></label>
              <input type="text" className="form-control" name="physician_name" value={medicalForm.physician_name} onChange={handleMedicalInputChange} />
            </div>

         <div className="mb-3">
  <label className="form-label">
    Physician’s Phone Number <span className="text-danger">*</span>
  </label>
  <input
    type="tel"
    className="form-control"
    name="physician_phone"
    value={medicalForm.physician_phone}  
    placeholder="(XXX) XXX-XXXX"
    onChange={handleMedicalPhoneChange}  // formatted handler
  />
</div>



            <div className="mb-3">
              <label className="form-label">Allergies?</label><br />
              <div className="form-check form-check-inline">
                <input type="radio" className="form-check-input" name="has_allergies" value="yes" checked={medicalForm.has_allergies === 'yes'} onChange={handleMedicalInputChange} />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input type="radio" className="form-check-input" name="has_allergies" value="no" checked={medicalForm.has_allergies === 'no'} onChange={handleMedicalInputChange} />
                <label className="form-check-label">No</label>
              </div>
            </div>

            {medicalForm.has_allergies === 'yes' && (
              <div className="mb-3">
                <label className="form-label">If yes, please specify</label>
                <textarea className="form-control" name="allergy_details" value={medicalForm.allergy_details} onChange={handleMedicalInputChange}></textarea>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Vaccine Info</label>
              <input
                type="text"
                className="form-control"
                name="vaccine_info"
                value={medicalForm.vaccine_info}
                onChange={handleMedicalInputChange}
                placeholder="e.g., Fully vaccinated"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Medical Form</label>
              <input type="file" className="form-control" name="medical_form" onChange={handleFileChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Early Intervention Services?</label><br />
              <div className="form-check form-check-inline">
                <input type="radio" className="form-check-input" name="intervention" value="yes" checked={medicalForm.intervention === 'yes'} onChange={handleMedicalInputChange} />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input type="radio" className="form-check-input" name="intervention" value="no" checked={medicalForm.intervention === 'no'} onChange={handleMedicalInputChange} />
                <label className="form-check-label">No</label>
              </div>
            </div>

            {medicalForm.intervention === 'yes' && (
              <div className="mb-3">
                <label className="form-label">Type of Therapy and Provider</label>
                <textarea className="form-control" name="intervention_details" value={medicalForm.intervention_details} onChange={handleMedicalInputChange}></textarea>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Upload Special Needs Application</label>
              <input type="file" className="form-control" name="special_needs_doc" onChange={handleFileChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Medical Notes</label>
              <textarea className="form-control" name="medical_notes" value={medicalForm.medical_notes} onChange={handleMedicalInputChange}></textarea>
            </div>

            {/* --- Vaccine Section (moved here) --- */}
            <div className="card shadow-sm mb-4">
              <div className="bg-light px-3 py-2 border-bottom d-flex align-items-center gap-2">
                <i className="fas fa-syringe text-primary me-2"></i>
                <h2 className="h6 mb-0">Vaccines</h2>
              </div>
              <div className="p-3">
                {/* Show suggested vaccines */}
                {suggestedVaccines.length > 0 && (
                  <div className="mb-3">
                    <strong>Required for age:</strong>
                    <ul className="mb-2">
                      {suggestedVaccines.map((v, idx) => (
                        <li key={idx}>{v}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="row g-2 align-items-end">
                  <div className="col-6">
                    <label className="form-label">Vaccine Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={vaccineInput.name}
                      onChange={handleVaccineInputChange}
                      placeholder="e.g., HEPB"
                      list="vaccine-suggestions"
                    />
                    <datalist id="vaccine-suggestions">
                      {suggestedVaccines.map((v, idx) => (
                        <option key={idx} value={v} />
                      ))}
                    </datalist>
                  </div>
<div className="col-6">
  <label className="form-label">Date Administered</label>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      value={vaccineInput.date_administered ? dayjs(vaccineInput.date_administered) : null}
      onChange={(newValue) => {
        handleVaccineInputChange({
          target: {
            name: "date_administered",
            value: newValue ? dayjs(newValue).format("YYYY-MM-DD") : ""
          }
        });
      }}
      renderInput={(params) => (
        <input
          className="form-control"
          {...params}
          placeholder="YYYY-MM-DD"
        />
      )}
         slotProps={{
                    textField: {
                      id: "staffDate",
                      name: "staffDate",
                      size: "small",
                      required: true,
                      fullWidth: false,
                      className: "form-control sim-date",
                    
                    },
                  }}
    />
  </LocalizationProvider>
</div>


                  <div className="col-12 mt-2">
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={handleAddVaccine}
                    >
                      Add Vaccine
                    </button>
                  </div>
                </div>
                {/* Added vaccines list */}
                <div className="mt-3">
                  <h6 className="mb-2">Added Vaccines:</h6>
                  <ul className="list-group list-group-flush">
                    {vaccines.map((vaccine, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{vaccine.name}</strong><br />
                          <small className="text-muted">{vaccine.date_administered}</small>
                        </div>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveVaccine(idx)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Vaccine exemption */}
                <div className="mt-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="vaccineExempted"
                      checked={vaccineExempted}
                      onChange={(e) => setVaccineExempted(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="vaccineExempted">
                      Exempted from Vaccines
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* --- End Vaccine Section --- */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMedicalModal(false)}>Cancel</Button>
          <Button
            style={{ backgroundColor: "#2ab7a9", borderColor: "#2ab7a9" }}
            onClick={() => setShowMedicalModal(false)}
          >
            Save Medical Info
          </Button>
        </Modal.Footer>
      </Modal>

      {/* User Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#2ab7a9', color: 'white' }}>
          <Modal.Title>Add New Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddUser}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={userform.email}
                onChange={handleUserInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">PassWord</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={userform.password}
                onChange={handleUserInputChange}
                required
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowUserModal(false)}>Cancel</Button>
              <Button type="submit" style={{ backgroundColor: '#2ab7a9', borderColor: '#2ab7a9' }}>Save User</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default AddChild;
