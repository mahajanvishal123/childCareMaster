import React, { useState, useEffect } from "react";
import { FaFingerprint } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Modal, Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx"; // Import xlsx
import html2pdf from "html2pdf.js"; // Import html2pdf
import ExportButton from "../../ReusableComponent/Button";
import TeacherTable from "./TeacherTable";
import ChildrenTable from "./ChildrenTable";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { set } from "date-fns";


// const staffData = [
//   {
//     initials: "JD",
//     name: "Jennifer Davis",
//     role: "Lead Teacher",
//     date: "2025-06-18",
//     signIn: "08:15 AM",
//     signOut: "04:30 PM",
//     status: "Signed Out",
//     statusType: "success",
//     notes: "Regular schedule",
//},
// {
//   initials: "MR",
//   name: "Michael Robinson",
//   role: "Assistant Teacher",
//   date: "2025-06-18",
//   signIn: "08:45 AM",
//   signOut: "--",
//   status: "Signed In",
//   statusType: "primary",
//   notes: "Arrived 15 minutes late due to tra...",
// },
// {
//   initials: "SJ",
//   name: "Sarah Johnson",
//   role: "Director",
//   date: "2025-06-18",
//   signIn: "07:30 AM",
//   signOut: "05:15 PM",
//   status: "Signed Out",
//   statusType: "success",
//   notes: "Extended hours for parent-teache...",
// },
// {
//   initials: "DW",
//   name: "David Wilson",
//   role: "Teacher",
//   date: "2025-06-18",
//   signIn: "08:00 AM",
//   signOut: "04:00 PM",
//   status: "Signed Out",
//   statusType: "success",
//   notes: "Regular schedule",
// },
// {
//   initials: "EB",
//   name: "Emily Brown",
//   role: "Assistant Director",
//   date: "2025-06-18",
//   signIn: "08:00 AM",
//   signOut: "04:15 PM",
//   status: "Signed Out",
//   statusType: "success",
//   notes: "Regular schedule",
// },
//];

const statusBadge = {
  success: "sim-badge bg-success bg-opacity-10 text-success",
  primary: "sim-badge bg-primary bg-opacity-10 text-primary",
  danger: "sim-badge bg-danger bg-opacity-10 text-danger",
};

export default function SignManagement() {
  const [activeTab, setActiveTab] = useState("Teacher");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fingerprintModalIsOpen, setFingerprintModalIsOpen] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [faceRecognitionModalIsOpen, setFaceRecognitionModalIsOpen] =
    useState(false);
  const [staffList, setStaffList] = useState([]);
  const [signInData, setSignInData] = useState([]);
  const [childSignInData, setChildSignInData] = useState([]);
  const [signData, setSignData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffSearch, setStaffSearch] = useState("");
  const [staffDate, setStaffDate] = useState("");
  const [childSearch, setChildSearch] = useState("");
  const [childDate, setChildDate] = useState("");
  const [childClass, setChildClass] = useState("All Classes/Rooms");
  const [classrooms, setClassrooms] = useState([]);


  console.log("Classrooms:", classrooms);
  // Get logged-in user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = localStorage.getItem('role');
  const userId = user.user_id;


  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/sign-in/get`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        // Filter for staff
        let filtered = data;
        if (userRole === '1' && userId) {
          filtered = data.filter(item => String(item.user_id) === String(userId));
        }
        // Format for table
        const formatted = filtered.map((item) => ({
          initials: getInitials(item.name),
          name: item.name,
          role: item.role || "-",
          date: item.date ? new Date(item.date).toLocaleDateString() : "-",
          signIn: item.sign_in_time || "-",
          signOut: item.sign_out_time || "-",
          status: item.sign_out_time ? "Signed Out" : "Signed In",
          statusType: item.sign_out_time ? "success" : "warning",
          notes: item.notes || "-",
        }));
        setSignInData(formatted);
        setChildSignInData(formatted);
      })
      .catch((err) => {
        console.error(err);
        setSignInData([]);
        setChildSignInData([]);
      })
      .finally(() => setLoading(false));
  }, [userRole, userId]);

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };



  // Filter sign-in data for staff and children
  const staffSignIns = signInData.filter((item) => item.role === "1");
  const childSignIns = signInData.filter((item) => item.role === "2");

  // Filtered data for staff
  const filteredStaffSignIns = staffSignIns.filter((item) => {
    const matchesName = item.name?.toLowerCase().includes(staffSearch.toLowerCase());
    const matchesDate = staffDate ? item.date === new Date(staffDate).toLocaleDateString() : true;
    return matchesName && matchesDate;
  });


  // Filtered data for children
  const filteredChildSignIns = childSignIns.filter((item) => {
    const matchesName = item.name?.toLowerCase().includes(childSearch.toLowerCase());
    const matchesDate = childDate ? item.date === new Date(childDate).toLocaleDateString() : true;
    // For class/room filter, add your logic here if you have class info in item
    const matchesClass = childClass === "All Classes/Rooms" ? true : (item.classroom === childClass);
    return matchesName && matchesDate && matchesClass;
  });


  console.log("signin data statw  ", signInData);


  console.log("currentEntry :", currentEntry);

  console.log("Staff List aurn vfgdg:", staffList);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/users`)
      .then((res) => {
        if (res.data.status === 200) {
          let filteredUsers = [];

          if (activeTab === "Teacher") {
            filteredUsers = res.data.data.filter(user => user.role_id === 1);
          } else if (activeTab === "child") {
            filteredUsers = res.data.data.filter(user => user.role_id === 2);
          }

          setStaffList(filteredUsers);
          setStaffData(filteredUsers);
          console.log(staffList);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeTab]); // re-run effect when activeTab changes


  const handleSave = async () => {
    if (
      !currentEntry?.user_id ||
      !currentEntry?.date ||
      !currentEntry?.signInTime
    ) {
      alert("Please fill required fields (User ID, Date, Sign In Time)");
      return;
    }

    setLoading(true);

    const formatTime = (timeStr) => {
      if (!timeStr) return null;
      // Ensure it's in HH:mm:ss format
      const [hours, minutes] = timeStr.split(":");
      return `${hours}:${minutes}:00`;
    };

    const payload = {
      ...currentEntry,
      user_id: (userRole === '1' && userId) ? userId : currentEntry.user_id,
      role: (userRole === '1' && userId) ? userRole : currentEntry.role,
      date: currentEntry.date,
      signInTime: formatTime(currentEntry.signInTime),
      signOutTime: formatTime(currentEntry.signOutTime),
      notes: currentEntry.notes || null,
    };

    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/sign-in/${currentEntry.id}`, payload);
      } else {
        await axios.post(`${BASE_URL}/sign-in/add`, payload);
      }

      closeModal();
      // onDataChange(); // Refresh parent table - This line was removed as per the new_code
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };


  const handleFingerprintSignIn = () => {
    setFingerprintModalIsOpen(true);
  };

  const handleFaceSignIn = () => {
    setFaceRecognitionModalIsOpen(true);
  };

  const openModal = (entry = null) => {
    setCurrentEntry(entry);
    setIsEditing(!!entry);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentEntry(null);
    setIsEditing(false);
  };

  const handleDelete = (entry) => {
    // Logic to delete entry
    alert(`Deleted ${entry.name}`);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper style for responsive flex
  const statsRowStyle = {
    display: "flex",
    gap: isMobile ? 12 : 24,
    marginBottom: 24,
    flexDirection: isMobile ? "column" : "row",
  };
  const filtersRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: isMobile ? 10 : 16,
    alignItems: isMobile ? "stretch" : "center",
    marginBottom: isMobile ? 16 : 24,
    flexDirection: isMobile ? "column" : "row",
  };
  const tableWrapperStyle = {
    background: "#fff",
    borderRadius: isMobile ? 10 : 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    padding: isMobile ? 4 : 16,
    overflowX: "auto",
    width: "100%",
  };
  const tableCellStyle = {
    fontSize: isMobile ? 13 : 16,
    padding: isMobile ? "8px 6px" : "16px 12px",
    whiteSpace: "nowrap",
  };

  const exportToExcel = () => {
    // Create worksheets for both teacher and children data
    const wsTeacher = XLSX.utils.json_to_sheet(staffData);
    const wsChildren = XLSX.utils.json_to_sheet(childSignInData); // Changed from childrenData to childSignInData

    // Create a new workbook with both sheets
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsTeacher, "Teacher Data");
    XLSX.utils.book_append_sheet(wb, wsChildren, "Children Data");

    // Export based on active tab
    if (activeTab === "Teacher") {
      XLSX.writeFile(wb, "teacher_data.xlsx");
    } else {
      XLSX.writeFile(wb, "children_data.xlsx");
    }
  };

  
const [isSignedIn, setIsSignedIn] = useState(false);
const [signInEntry, setSignInEntry] = useState(null);

 useEffect(() => {
    // ✅ Check if there is an active sign-in entry in localStorage on load
    const savedSignInEntry = localStorage.getItem("signInEntry");
    if (savedSignInEntry) {
      setIsSignedIn(true);
    }
  }, []);

const handleSignIn = async () => {
  try {
    const signInDate = new Date().toISOString().split("T")[0];
    const signInTime = new Date()
      .toLocaleTimeString("en-GB", { hour12: false })
      .split(" ")[0];

    console.log("Handling sign-in...");
    console.log("User ID:", userId);
    console.log("Sign-in Time:", signInTime);
    console.log("Sign-in Date:", signInDate);

    const payload = {
      user_id: userId,
      date: signInDate,
      signInTime,
      signOutTime: null,
      notes: "good",
      role: userRole?.toString() || ""
    };

    const res = await axios.post(`${BASE_URL}/sign-in/add`, payload);
    const signInData = res.data.data;

    console.log("Sign-in response:", signInData);

    // Save in state
    setSignInEntry(signInData);

    // Also save to localStorage to persist across reloads
    localStorage.setItem("signInEntry", JSON.stringify(signInData));

    alert("Sign-in recorded successfully!");
    setIsSignedIn(true);

  } catch (error) {
    console.error("Error handling sign-in:", error);
    alert("Something went wrong while signing in!");
  }
};

// Optional: Log whenever signInEntry changes
useEffect(() => {
  if (signInEntry) {
    console.log("Updated signInEntry:", signInEntry);
  }
}, [signInEntry]);

// On mount: restore from localStorage
useEffect(() => {
  const storedEntry = localStorage.getItem("signInEntry");
  if (storedEntry) {
    setSignInEntry(JSON.parse(storedEntry));
  }
}, []);



 const handleSignOut = async () => {
  try {
    const signOutTime = new Date().toLocaleTimeString("en-GB", { hour12: false }); // HH:MM:SS

    // ✅ Retrieve stored sign-in data
    const storedData = localStorage.getItem("signInEntry");
    if (!storedData) {
      alert("No active sign-in found!");
      return;
    }

    const signInData = JSON.parse(storedData);

    // ✅ Validate ID
    const entryId = signInData.id || signInData._id;
    if (!entryId) {
      alert("No valid entry ID found!");
      return;
    }

    // ✅ Prepare payload
    const payload = {
      user_id: signInData.user_id,
      date: signInData.date?.split("T")[0] || new Date().toISOString().split("T")[0],
      signInTime: signInData.sign_in_time,
      signOutTime: signOutTime,
      notes: signInData.notes || "good",
      role: signInData.role?.toString() || ""
    };

    // ✅ API Call
    await axios.put(`${BASE_URL}/sign-in/${entryId}`, payload);

    alert("Sign-out recorded successfully!");

    // ✅ Remove from localStorage & update UI
    localStorage.removeItem("signInEntry");
    setIsSignedIn(false);

  } catch (error) {
    console.error("Error handling sign-out:", error);
    alert("Something went wrong while signing out!");
  }
};

  const exportToPDF = () => {
    // Get the appropriate table based on active tab
    const element =
      activeTab === "Teacher"
        ? document.getElementById("teacher-table")
        : document.getElementById("children-table");

    const filename =
      activeTab === "Teacher" ? "teacher_data.pdf" : "children_data.pdf";

    const opt = {
      margin: 1,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const exportCombinedExcel = () => {
    // Combine all data
    const combinedData = {
      "Teacher Data": staffData,
      "Children Data": childSignInData, // Changed from childrenData to childSignInData
    };

    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    Object.entries(combinedData).forEach(([name, data]) => {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, name);
    });

    XLSX.writeFile(wb, "signin_data.xlsx");
  };

  const exportCombinedPDF = async () => {
    // Create elements for both tables
    const teacherTable = document
      .getElementById("teacher-table")
      .cloneNode(true);
    const childrenTable = document
      .getElementById("children-table")
      .cloneNode(true);

    // Create a container for both
    const container = document.createElement("div");
    container.style.padding = "20px";

    // Add headings
    const teacherHeading = document.createElement("h2");
    teacherHeading.textContent = "Teacher Sign-In Data";
    container.appendChild(teacherHeading);
    container.appendChild(teacherTable);

    const childrenHeading = document.createElement("h2");
    childrenHeading.textContent = "Children Sign-In Data";
    container.appendChild(childrenHeading);
    container.appendChild(childrenTable);

    document.body.appendChild(container);

    const opt = {
      margin: 1,
      filename: "combined_signin_data.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(container).save();
    document.body.removeChild(container);
  };

  const classes = async () => {
    await axios
      .get(`${BASE_URL}/classrooms`)
      .then((response) => {
        setClassrooms(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching classrooms:", error);
      });
  };

  useEffect(() => {
    classes();
  }, []);

  return (
    <div className="sim-main bg-light min-vh-100 p-3 p-md-4" style={{ padding: isMobile ? 8 : 24 }}>
      <div className="container-fluid sim-container">
        {/* Header */}
        <div className="d-flex justify-content-between">
          <div className="mb-2">
            <h2
              className="fw-bold sim-title mb-1"
              style={{ fontSize: isMobile ? 20 : 28 }}
            >
              Sign-In Management
            </h2>
            <div
              className="text-secondary sim-subtitle mb-3"
              style={{ fontSize: isMobile ? 14 : 16 }}
            >
              Track and manage daily sign-ins for Staff and children
            </div>
          </div>
          <div className="d-flex gap-2">
            <div>
      <Button onClick={isSignedIn ? handleSignOut : handleSignIn}>
        {isSignedIn ? "Sign Out" : "Sign In"}
      </Button>
    </div>
            {/* <div>
              <ExportButton
                label="Export All Data (Excel)"
                icon="📊"
                onClick={() => exportCombinedExcel()}
              />
            </div>
            <div>
              <ExportButton
                label="Export All Data (PDF)"
                icon="📄"
                onClick={() => exportCombinedPDF()}
              />
            </div> */}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: isMobile ? 16 : 24,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 10 : 0,
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 0,
              background: "#f4f5f7",
              borderRadius: 24,
              padding: 4,
              marginBottom: isMobile ? 10 : 0,
            }}
          >
            <button
              style={{
                background: activeTab === "Teacher" ? "#36d6b6" : "transparent",
                color: activeTab === "Teacher" ? "#fff" : "#222",
                border: activeTab === "Teacher" ? "2px solid #222" : "2px solid #bcbabaff",
                fontWeight: activeTab === "Teacher" ? "bold" : "500",
                borderRadius: 24,
                padding: isMobile ? "8px 16px" : "10px 28px",
                fontSize: isMobile ? 14 : 16,
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
                outline: "none",
              }}
              onClick={() => setActiveTab("Teacher")}
            >
              Staff Sign-In
            </button>

            {userRole !== '1' && (

              <button
                style={{
                  background: activeTab === "child" ? "#36d6b6" : "transparent",
                  color: activeTab === "child" ? "#fff" : "#222",
                  border: activeTab === "child" ? "2px solid #1a1111ff" : "2px solid #bcbabaff",
                  fontWeight: activeTab === "child" ? "bold" : "500",
                  borderRadius: 24,
                  padding: isMobile ? "8px 16px" : "10px 28px",
                  fontSize: isMobile ? 14 : 16,
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                  outline: "none",
                }}
                onClick={() => setActiveTab("child")}
              >
                Child Sign-In
              </button>)
            }
          </div>
          {/* Spacer */}
          <div style={{ flex: 1 }} />
          {/* Export Buttons */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? 8 : 16,
              marginTop: isMobile ? 10 : 0,
            }}
          >
            <ExportButton
              label={`Export ${activeTab === "Teacher" ? "Teacher" : "Children"
                } Data (Excel)`}
              icon="📊"
              onClick={() => exportToExcel()}
            />
            <ExportButton
              label={`Export ${activeTab === "Teacher" ? "Teacher" : "Children"
                } Data (PDF)`}
              icon="📄"
              onClick={() => exportToPDF()}
            />
          </div>
        </div>

        {activeTab === "Teacher" && (
          <>
            {/* Stats Cards */}
            <div style={statsRowStyle}>
              {/* <div style={{
                flex: 1,
                borderRadius: 12,
                padding: isMobile ? "16px 10px" : "24px 20px",
                background: "#f1fcf6",
                borderLeft: "3px solid #36d6b6",
                minWidth: 120,
                display: "flex",
                flexDirection: "column",
              }}>
                <span style={{ color: "#222", opacity: 0.7, marginBottom: 8 }}>Teacher Present</span>
                <span style={{ fontSize: isMobile ? 20 : 28, fontWeight: "bold", color: "#222" }}>8</span>
              </div> */}
              {/* <div style={{
                flex: 1,
                borderRadius: 12,
                padding: isMobile ? "16px 10px" : "24px 20px",
                background: "#fef6f6",
                borderLeft: "3px solid #ff5c5c",
                minWidth: 120,
                display: "flex",
                flexDirection: "column",
              }}>
                <span style={{ color: "#222", opacity: 0.7, marginBottom: 8 }}>Teacher Absent</span>
                <span style={{ fontSize: isMobile ? 20 : 28, fontWeight: "bold", color: "#222" }}>2</span>
              </div> */}
              {/* <div style={{
                flex: 1,
                borderRadius: 12,
                padding: isMobile ? "16px 10px" : "24px 20px",
                background: "#f3f8fe",
                borderLeft: "3px solid #3b82f6",
                minWidth: 120,
                display: "flex",
                flexDirection: "column",
              }}>
                <span style={{ color: "#222", opacity: 0.7, marginBottom: 8 }}>Late Sign-Ins</span>
                <span style={{ fontSize: isMobile ? 20 : 28, fontWeight: "bold", color: "#222" }}>1</span>
              </div> */}
            </div>

            {/* Filters */}
            <div style={filtersRowStyle}>
              <div style={{ flexGrow: 1, position: "relative" }}>
                <input
                  type="search"
                  className="form-control sim-search ps-5"
                  placeholder="Search by name..."
                  value={staffSearch}
                  onChange={e => setStaffSearch(e.target.value)}
                  style={{
                    minWidth: isMobile ? 120 : 200,
                    fontSize: isMobile ? 14 : 16,
                  }}
                />
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
                  <i className="bi bi-search"></i>
                </span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="MM-DD-YYYY" // ✅ Display in MM-DD-YYYY
                  value={staffDate ? dayjs(staffDate, "MM-DD-YYYY") : null}
                  onChange={(newValue) => {
                    const formattedDate = newValue
                      ? dayjs(newValue).format("MM-DD-YYYY") // ✅ Store in same format
                      : "";
                    setStaffDate(formattedDate);
                  }}
                  slotProps={{
                    textField: {
                      id: "staffDate",
                      name: "staffDate",
                      size: "small",
                      required: true,
                      fullWidth: false,
                      className: "form-control sim-date",
                      style: {
                        maxWidth: isMobile ? 100 : 180,
                        fontSize: isMobile ? 14 : 16,
                      },
                    },
                  }}
                />
              </LocalizationProvider>
              <button
                className="btn btn-success sim-add-btn d-flex align-items-center gap-2"
                style={{
                  borderRadius: 10,
                  fontSize: isMobile ? 14 : 16,
                  padding: isMobile ? "8px 12px" : "10px 22px",
                  background: "#36d6b6",
                  color: "#fff",
                  border: "none",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
                onClick={() => openModal()}
              >
                <i className="fa fa-plus"></i>
                Add Manual Entry
              </button>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {/* <button
                  className="btn btn-outline-primary d-flex align-items-center gap-2"
                  style={{ fontSize: isMobile ? 14 : 16 }}
                  onClick={handleFingerprintSignIn}
                >
                  <FaFingerprint className="me-1" />
                  Fingerprint Sign-In
                </button>
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  style={{ fontSize: isMobile ? 14 : 16 }}
                  onClick={handleFaceSignIn}
                >
                  <i className="bi bi-camera"></i>
                  Face Recognition Sign-In
                </button> */}
              </div>
            </div>

            {/* Table */}
            <TeacherTable
              tableWrapperStyle={tableWrapperStyle}
              tableCellStyle={tableCellStyle}
              isMobile={isMobile}
              staffData={filteredStaffSignIns}
              statusBadge={statusBadge}
              selectedStaff={currentEntry}
              setSelectedStaff={setCurrentEntry}
              openModal={openModal}
              handleDelete={handleDelete}
            />
          </>
        )}

        {activeTab === "child" && (
          <>
            {/* Stats Cards */}
            {/* <div style={statsRowStyle}>
              <div
                style={{
                  flex: 1,
                  borderRadius: 12,
                  padding: isMobile ? "16px 10px" : "24px 20px",
                  background: "#f1fcf6",
                  borderLeft: "3px solid #36d6b6",
                  minWidth: 120,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ color: "#222", opacity: 0.7, marginBottom: 8 }}>
                  Children Present
                </span>
                <span
                  style={{
                    fontSize: isMobile ? 20 : 28,
                    fontWeight: "bold",
                    color: "#222",
                  }}
                >
                {totalPresent} 
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  borderRadius: 12,
                  padding: isMobile ? "16px 10px" : "24px 20px",
                  background: "#fef6f6",
                  borderLeft: "3px solid #ff5c5c",
                  minWidth: 120,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ color: "#222", opacity: 0.7, marginBottom: 8 }}>
                  Children Absent
                </span>
                <span
                  style={{
                    fontSize: isMobile ? 20 : 28,
                    fontWeight: "bold",
                    color: "#222",
                  }}
                >
                  {totalAbsent}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  borderRadius: 12,
                  padding: isMobile ? "16px 10px" : "24px 20px",
                  background: "#f3f8fe",
                  borderLeft: "3px solid #3b82f6",
                  minWidth: 120,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ color: "#222", opacity: 0.7, marginBottom: 8 }}>
                  Late Arrivals
                </span>
                <span
                  style={{
                    fontSize: isMobile ? 20 : 28,
                    fontWeight: "bold",
                    color: "#222",
                  }}
                >
                  {totalLate}
                </span>
              </div>
            </div> */}
            {/* Filters */}
            <div style={filtersRowStyle}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="search"
                  placeholder="Search by name..."
                  value={childSearch}
                  onChange={e => setChildSearch(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    fontSize: isMobile ? 14 : 16,
                    padding: isMobile
                      ? "8px 12px 8px 32px"
                      : "10px 16px 10px 40px",
                    border: "1.5px solid #e5e7eb",
                    outline: "none",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#bbb",
                    fontSize: 18,
                  }}
                >
                  <i className="bi bi-search"></i>
                </span>
              </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    value={childDate ? dayjs(childDate, "MM-DD-YYYY") : null}
    onChange={(newValue) => {
      setChildDate(newValue ? newValue.format("MM-DD-YYYY") : "");
    }}
    format="MM-DD-YYYY"
    slotProps={{
      textField: {
        variant: "outlined",
        size: "small",
        sx: {
          backgroundColor: "#fff",
          borderRadius: "4px",
          "& .MuiOutlinedInput-root": {
            fontSize: isMobile ? 14 : 16,
            paddingRight: "8px",
            "& fieldset": {
              borderColor: "#ccc",
            },
            "&:hover fieldset": {
              borderColor: "#999",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
              borderWidth: 1.5,
            },
          },
          maxWidth: isMobile ? 100 : 180,
        },
      },
    }}
  />
</LocalizationProvider>
              {/* <div style={{ position: "relative" }}>
                <select
                  value={childClass}
                  onChange={e => setChildClass(e.target.value)}
                  style={{
                    borderRadius: 10,
                    fontSize: isMobile ? 14 : 16,
                    border: "1.5px solid #e5e7eb",
                    padding: isMobile
                      ? "8px 32px 8px 12px"
                      : "10px 36px 10px 16px",
                    minWidth: isMobile ? 100 : 180,
                    outline: "none",
                    background: "#fff",
                    appearance: "none",
                  }}
                >
                  <option>All Classes/Rooms</option>
                  {
                    classrooms.map((classroom) => (
                      <option key={classroom.id} value={classroom.name}>
                        {classroom.name}
                      </option>
                    ))
                  }
                
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#bbb",
                    fontSize: 18,
                    pointerEvents: "none",
                  }}
                >
                  <i className="bi bi-chevron-down"></i>
                </span>
              </div> */}
              <button
                style={{
                  borderRadius: 10,
                  fontSize: isMobile ? 14 : 16,
                  padding: isMobile ? "8px 12px" : "10px 22px",
                  background: "#36d6b6",
                  color: "#fff",
                  border: "none",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
                onClick={() => openModal()}
              >
                <i className="fa fa-plus"></i>
                Add Manual Entry
              </button>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {/* <button
                  className="btn btn-outline-primary d-flex align-items-center gap-2"
                  style={{ fontSize: isMobile ? 14 : 16 }}
                  onClick={handleFingerprintSignIn}
                >
                  <FaFingerprint className="me-1" />
                  Fingerprint Sign-In
                </button>
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  style={{ fontSize: isMobile ? 14 : 16 }}
                  onClick={handleFaceSignIn}
                >
                  <i className="bi bi-camera"></i>
                  Face Recognition Sign-In
                </button> */}
              </div>
            </div>
            {/* Table */}
            <ChildrenTable
              tableWrapperStyle={tableWrapperStyle}
              tableCellStyle={tableCellStyle}
              isMobile={isMobile}
              childrenData={filteredChildSignIns}
              openModal={openModal}
              handleDelet={handleDelete}
            />
          </>
        )}
      </div>
      {/* <Modal show={modalIsOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Entry" : "Add Entry"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select User</Form.Label>
              <Form.Select
                value={currentEntry?.user_id > 0 ? currentEntry.user_id : ""}
                onChange={(e) =>
                  setCurrentEntry({
                    ...currentEntry,
                    user_id: parseInt(e.target.value) || null,
                  })
                }
                // If you want to lock on Edit
              >
                <option value="">-- Select User --</option>
                {staffList.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={currentEntry?.date || ""}
                onChange={(e) =>
                  setCurrentEntry({ ...currentEntry, date: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sign In Time</Form.Label>
              <Form.Control
                type="text"
                placeholder="09:00 AM"
                value={currentEntry?.signInTime || ""}
                onChange={(e) =>
                  setCurrentEntry({
                    ...currentEntry,
                    signInTime: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sign Out Time</Form.Label>
              <Form.Control
                type="text"
                placeholder="05:30 PM"
                value={currentEntry?.signOutTime || ""}
                onChange={(e) =>
                  setCurrentEntry({
                    ...currentEntry,
                    signOutTime: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={currentEntry?.notes || ""}
                onChange={(e) =>
                  setCurrentEntry({ ...currentEntry, notes: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={isEditing ? "warning" : "primary"}
            onClick={handleSave}
            disabled={loading}
          >
            {isEditing ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal> */}


      <Modal show={modalIsOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Entry" : "Add Entry"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select User</Form.Label>
              <Form.Select
                value={currentEntry?.user_id > 0 ? currentEntry.user_id : ""}
                onChange={(e) =>
                  setCurrentEntry({
                    ...currentEntry,
                    user_id: parseInt(e.target.value) || null,
                  })
                }
              >
                <option value="">-- Select User --</option>
                {staffList.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <DatePicker
                  format="DD-MM-YYYY"
                  value={currentEntry?.date ? dayjs(currentEntry.date) : null}
                  onChange={(date) => {
                    setCurrentEntry({
                      ...currentEntry,
                      date: date ? dayjs(date).format('YYYY-MM-DD') : '',
                    });
                  }}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      variant: 'outlined',
                    },
                  }}
                />
              </Form.Group>
            </LocalizationProvider>


            <Form.Group className="mb-3">
              <Form.Label>Sign In Time</Form.Label>
              <Form.Control
                type="time"
                value={currentEntry?.signInTime || ""}
                onChange={(e) =>
                  setCurrentEntry({
                    ...currentEntry,
                    signInTime: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sign Out Time</Form.Label>
              <Form.Control
                type="time"
                value={currentEntry?.signOutTime || ""}
                onChange={(e) =>
                  setCurrentEntry({
                    ...currentEntry,
                    signOutTime: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={currentEntry?.notes || ""}
                onChange={(e) =>
                  setCurrentEntry({ ...currentEntry, notes: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={isEditing ? "warning" : "primary"}
            onClick={handleSave}
            disabled={loading}
          >
            {isEditing ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={fingerprintModalIsOpen}
        onHide={() => setFingerprintModalIsOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Fingerprint Sign-In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Place your finger on the scanner.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setFingerprintModalIsOpen(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={faceRecognitionModalIsOpen}
        onHide={() => setFaceRecognitionModalIsOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Face Recognition Sign-In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Align your face with the camera.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setFaceRecognitionModalIsOpen(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
