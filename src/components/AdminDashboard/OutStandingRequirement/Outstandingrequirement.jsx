//update on click of row  , abhi proper working nhi h , backend se cors error h  or krna h 


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import html2pdf from "html2pdf.js";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from "dayjs";
// import { Modal, Button } from "react-bootstrap";
// import AddChild from "../ChildrenManagement/AddChild";
// import AddStaff from "../StaffManagement/AddStaff";
// import { BASE_URL } from "../../../utils/config";

// const Outstandingrequirement = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [dateRange, setDateRange] = useState({
//     start: "2025-06-01",
//     end: "2025-06-23",
//   });
//   const [status, setStatus] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Modal states
//   const [showChildModal, setShowChildModal] = useState(false);
//   const [showStaffModal, setShowStaffModal] = useState(false);
//   const [selectedChildData, setSelectedChildData] = useState(null);
//   const [selectedStaffData, setSelectedStaffData] = useState(null);

//   // Data
//   const [teachers, setTeachers] = useState([]);
//   const [children, setChildren] = useState([]);
//   const [maintenance, setMaintenance] = useState([]);

//   // ✅ Fetch data from your API
//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get(
//         "https://3ktt3vxd-5000.inc1.devtunnels.ms/api/outstanding-requirements/outstanding"
//       )
//       .then((res) => {
//         if (res.data.success) {
//           setTeachers(res.data.teachers.data || []);
//           setChildren(res.data.children.data || []);
//           setMaintenance(res.data.maintenanceRequirements.data || []);
//         }
//       })
//       .catch((err) => console.error("Fetch error:", err))
//       .finally(() => setLoading(false));
//   }, [dateRange, status, searchTerm]);

//   // ✅ Simple date range check
//   const isDateInRange = (dateString, start, end) => {
//     if (!dateString) return true;
//     const date = new Date(dateString);
//     return (
//       date >= new Date(start) &&
//       date <= new Date(end)
//     );
//   };

//   // ✅ Filters
//   const filteredTeachers = teachers.filter((item) => {
//     const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim();
//     return (
//       fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (item.user_id || "").toString().includes(searchTerm)
//     );
//   });

//   const filteredChildren = children.filter((child) => {
//     return (
//       (child.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (child.child_id || "").toString().includes(searchTerm)
//     );
//   });

//   const filteredMaintenance = maintenance.filter((item) => {
//     return (
//       (item.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (item.request_title || "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   // Handle opening child modal for editing
//   const handleOpenChildModal = async (child) => {
//     try {
//       // Fetch full child details for editing
//       const res = await axios.get(`${BASE_URL}/children/${child.child_id}`);
//       if (res.data && res.data.child) {
//         setSelectedChildData(res.data);
//         setShowChildModal(true);
//       }
//     } catch (err) {
//       console.error("Error fetching child details:", err);
//       alert("Failed to fetch child details for editing");
//     }
//   };

//   // Handle opening staff modal for editing
//   const handleOpenStaffModal = async (teacher) => {
//     try {
//       // Fetch full staff details for editing
//       const res = await axios.get(`${BASE_URL}/api/teachers/${teacher.user_id}`);
//       if (res.data) {
//         setSelectedStaffData(res.data);
//         setShowStaffModal(true);
//       }
//     } catch (err) {
//       console.error("Error fetching staff details:", err);
//       alert("Failed to fetch staff details for editing");
//     }
//   };

//   // Handle modal close and refresh data
//   const handleChildModalClose = () => {
//     setShowChildModal(false);
//     setSelectedChildData(null);
//     // Refresh the outstanding requirements data
//     window.location.reload(); // Simple refresh, you can implement a more sophisticated refresh if needed
//   };

//   const handleStaffModalClose = () => {
//     setShowStaffModal(false);
//     setSelectedStaffData(null);
//     // Refresh the outstanding requirements data
//     window.location.reload(); // Simple refresh, you can implement a more sophisticated refresh if needed
//   };

//   // ✅ Export PDF
//   const handleExportPDF = () => {
//     const element = document.getElementById("reportContent");
//     const opt = {
//       margin: 0.5,
//       filename: "outstanding_report.pdf",
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };
//     html2pdf().set(opt).from(element).save();
//   };

//   // ✅ Export Excel
//   const handleExportExcel = () => {
//     const table = document.querySelector("#reportContent table");
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.table_to_sheet(table);
//     XLSX.utils.book_append_sheet(wb, ws, "Report");
//     const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(
//       new Blob([wbout], { type: "application/octet-stream" }),
//       "outstanding_report.xlsx"
//     );
//   };

//   return (
//     <div className="bg-light min-vh-100" id="reportContent">
//       <div className="container-fluid px-4 py-4">
//         {/* Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h1 className="h2 text-dark mb-0">Outstanding Requirements</h1>
//           <div className="d-flex gap-2">
//             <button
//               className="btn btn-outline-danger btn-sm"
//               onClick={handleExportPDF}
//             >
//               <i className="fas fa-file-pdf me-2"></i> Export PDF
//             </button>
//             <button
//               className="btn btn-outline-success btn-sm"
//               onClick={handleExportExcel}
//             >
//               <i className="fas fa-file-excel me-2"></i> Export Excel
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="card mb-4">
//           <div className="card-body">
//             <div className="row g-3 align-items-end">
//               {/* Date Range */}
//               <div className="col-12 col-md-6 col-lg-3">
//                 <label className="form-label">Date Range</label>
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                   <DatePicker
//                     label="Start Date"
//                     format="DD/MM/YYYY"
//                     value={dayjs(dateRange.start)}
//                     onChange={(newValue) =>
//                       setDateRange({
//                         ...dateRange,
//                         start: newValue ? newValue.format("YYYY-MM-DD") : "",
//                       })
//                     }
//                   />
//                 </LocalizationProvider>
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                   <DatePicker
//                     label="End Date"
//                     format="DD/MM/YYYY"
//                     value={dayjs(dateRange.end)}
//                     onChange={(newValue) =>
//                       setDateRange({
//                         ...dateRange,
//                         end: newValue ? newValue.format("YYYY-MM-DD") : "",
//                       })
//                     }
//                   />
//                 </LocalizationProvider>
//               </div>

//               {/* Search */}
//               <div className="col-12 col-md-6 col-lg-4">
//                 <label className="form-label">Search</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search by name, ID, or location..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p className="mt-2">Loading requirements...</p>
//           </div>
//         )}

//         {!loading && (
//           <div className="card">
//             {/* Staff Section */}
//             {(activeTab === "all" || activeTab === "Staff") && (
//               <div className="mb-4">
//                 <div className="card-header bg-primary bg-opacity-10">
//                   <h2 className="h5 mb-0">Staff Requirements</h2>
//                 </div>
//                 {filteredTeachers.length > 0 ? (
//                   <table className="table table-hover mb-0">
//                     <thead className="table-light">
//                       <tr>
//                         <th>Staff Name</th>
//                         <th>ID</th>
//                         <th>Missing Fields</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredTeachers.map((item) => (
//                         <tr key={item.user_id}>
//                           <td>{item.first_name} {item.last_name}</td>
//                           <td>{item.user_id}</td>
//                           <td>
//                             {item.missing_fields?.length > 0 ? (
//                               <span className="badge bg-danger">
//                                 {item.missing_fields.length} missing
//                               </span>
//                             ) : (
//                               <span className="badge bg-success">Complete</span>
//                             )}
//                           </td>
//                           <td>
//                             {item.missing_fields?.length > 0 && (
//                               <button
//                                 className="btn btn-sm btn-warning"
//                                 onClick={() => handleOpenStaffModal(item)}
//                                 title="Complete missing requirements"
//                               >
//                                 <i className="fas fa-edit me-1"></i>
//                                 Complete
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p className="text-center py-3">No Staff Requirements</p>
//                 )}
//               </div>
//             )}

//             {/* Children Section */}
//             {(activeTab === "all" || activeTab === "immunization") && (
//               <div className="mb-4">
//                 <div className="card-header bg-success bg-opacity-10">
//                   <h2 className="h5 mb-0">Children Requirements</h2>
//                 </div>
//                 {filteredChildren.length > 0 ? (
//                   <table className="table table-hover mb-0">
//                     <thead className="table-light">
//                       <tr>
//                         <th>Child Name</th>
//                         <th>ID</th>
//                         <th>Missing Fields</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredChildren.map((child) => (
//                         <tr key={child.child_id}>
//                           <td>{child.full_name}</td>
//                           <td>{child.child_id}</td>
//                           <td>
//                             {child.missing_fields?.length > 0 ? (
//                               <span className="badge bg-danger">
//                                 {child.missing_fields.length} missing
//                               </span>
//                             ) : (
//                               <span className="badge bg-success">Complete</span>
//                             )}
//                           </td>
//                           <td>
//                             {child.missing_fields?.length > 0 && (
//                               <button
//                                 className="btn btn-sm btn-warning"
//                                 onClick={() => handleOpenChildModal(child)}
//                                 title="Complete missing requirements"
//                               >
//                                 <i className="fas fa-edit me-1"></i>
//                                 Complete
//                               </button>
//                               )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p className="text-center py-3">No Children Requirements</p>
//                 )}
//               </div>
//             )}

//             {/* Maintenance Section */}
//             {(activeTab === "all" || activeTab === "maintenance") && (
//               <div className="mb-4">
//                 <div className="card-header bg-warning bg-opacity-10">
//                   <h2 className="h5 mb-0">Location Requirements</h2>
//                 </div>
//                 {filteredMaintenance.length > 0 ? (
//                   <table className="table table-hover mb-0">
//                     <thead className="table-light">
//                       <tr>
//                         <th>Location</th>
//                         <th>Request Title</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredMaintenance.map((item) => (
//                         <tr key={item.id}>
//                           <td>{item.location}</td>
//                           <td>{item.request_title}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p className="text-center py-3">No Maintenance Requirements</p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Child Edit Modal */}
//       <Modal show={showChildModal} onHide={handleChildModalClose} size="xl" centered>
//         <Modal.Header closeButton style={{ backgroundColor: "#2ab7a9", color: "white" }}>
//           <Modal.Title>Complete Child Requirements</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedChildData && (
//             <AddChild 
//               existingChildData={selectedChildData.child || selectedChildData}
//               isCompletingDraft={true}
//               handleClose={handleChildModalClose}
//               onSaveSuccess={handleChildModalClose}
//             />
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* Staff Edit Modal */}
//       <Modal show={showStaffModal} onHide={handleStaffModalClose} size="xl" centered>
//         <Modal.Header closeButton style={{ backgroundColor: "#2ab7a9", color: "white" }}>
//           <Modal.Title>Complete Staff Requirements</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedStaffData && (
//             <AddStaff 
//               existingStaffData={selectedStaffData}
//               isEditing={true}
//               handleModalClose={handleStaffModalClose}
//               onStaffAdded={handleStaffModalClose}
//             />
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default Outstandingrequirement;


import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { BASE_URL } from "../../../utils/config";

const Outstandingrequirement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: "2025-06-01",
    end: "2025-06-23",
  });
  const [status, setStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Data
  const [teachers, setTeachers] = useState([]);
  const [children, setChildren] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  // ✅ Fetch data from your API
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${BASE_URL}/outstanding-requirements/outstanding`
      )
      .then((res) => {
        if (res.data.success) {
          setTeachers(res.data.teachers.data || []);
          setChildren(res.data.children.data || []);
          setMaintenance(res.data.maintenanceRequirements.data || []);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [dateRange, status, searchTerm]);

  // ✅ Simple date range check
  const isDateInRange = (dateString, start, end) => {
    if (!dateString) return true;
    const date = new Date(dateString);
    return (
      date >= new Date(start) &&
      date <= new Date(end)
    );
  };

  // ✅ Filters
  const filteredTeachers = teachers.filter((item) => {
    const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim();
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.user_id || "").toString().includes(searchTerm)
    );
  });

  const filteredChildren = children.filter((child) => {
    return (
      (child.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (child.child_id || "").toString().includes(searchTerm)
    );
  });

  const filteredMaintenance = maintenance.filter((item) => {
    return (
      (item.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.request_title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ✅ Export PDF
  const handleExportPDF = () => {
    const element = document.getElementById("reportContent");
    const opt = {
      margin: 0.5,
      filename: "outstanding_report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  // ✅ Export Excel
  const handleExportExcel = () => {
    const table = document.querySelector("#reportContent table");
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "outstanding_report.xlsx"
    );
  };

  return (
    <div className="bg-light min-vh-100" id="reportContent">
      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 text-dark mb-0">Outstanding Requirements</h1>
          <div className="d-flex gap-2">
            {/* <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleExportPDF}
            >
              <i className="fas fa-file-pdf me-2"></i> Export PDF
            </button>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={handleExportExcel}
            >
              <i className="fas fa-file-excel me-2"></i> Export Excel
            </button> */}
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              {/* Date Range */}
             


              {/* Search */}
              <div className="col-12 col-md-6 col-lg-4">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, ID, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading requirements...</p>
          </div>
        )}

        {!loading && (
          <div className="card">
            {/* Staff Section */}
            {(activeTab === "all" || activeTab === "Staff") && (
              <div className="mb-4">
                <div className="card-header bg-primary bg-opacity-10">
                  <h2 className="h5 mb-0">Staff Requirements</h2>
                </div>
                {filteredTeachers.length > 0 ? (
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Staff Name</th>
                        <th>ID</th>
                        <th>Missing Fields</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.map((item) => (
                        <tr key={item.user_id}>
                          <td>{item.first_name} {item.last_name}</td>
                          <td>{item.user_id}</td>
                          <td>
                            {item.missing_fields?.length > 0 ? (
                              <span className="badge bg-danger">
                                {item.missing_fields.length} missing
                              </span>
                            ) : (
                              <span className="badge bg-success">Complete</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-3">No Staff Requirements</p>
                )}
              </div>
            )}

            {/* Children Section */}
            {(activeTab === "all" || activeTab === "immunization") && (
              <div className="mb-4">
                <div className="card-header bg-success bg-opacity-10">
                  <h2 className="h5 mb-0">Children Requirements</h2>
                </div>
                {filteredChildren.length > 0 ? (
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Child Name</th>
                        <th>ID</th>
                        <th>Missing Fields</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredChildren.map((child) => (
                        <tr key={child.child_id}>
                          <td>{child.full_name}</td>
                          <td>{child.child_id}</td>
                          <td>
                            {child.missing_fields?.length > 0 ? (
                              <span className="badge bg-danger">
                                {child.missing_fields.length} missing
                              </span>
                            ) : (
                              <span className="badge bg-success">Complete</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-3">No Children Requirements</p>
                )}
              </div>
            )}

            {/* Maintenance Section */}
            {(activeTab === "all" || activeTab === "maintenance") && (
              <div className="mb-4">
                <div className="card-header bg-warning bg-opacity-10">
                  <h2 className="h5 mb-0">Location Requirements</h2>
                </div>
                {filteredMaintenance.length > 0 ? (
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Location</th>
                        <th>Request Title</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaintenance.map((item) => (
                        <tr key={item.id}>
                          <td>{item.location}</td>
                          <td>{item.request_title}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-3">No Maintenance Requirements</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Outstandingrequirement;
