import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BASE_URL } from "../../../utils/config";

const TeacherTable = ({ tableWrapperStyle, isMobile, setSelectedStaff, openModal, handleDelete, selectedStaff, staffData }) => {
  const statusBadge = {
    success: "badge bg-success text-white",
    warning: "badge bg-warning text-dark",
    danger: "badge bg-danger text-white",
  };

  const tableCellStyle = {
    verticalAlign: "middle",
    padding: "10px",
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = (staffData || []).length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Calculate the rows to display
  const paginatedRows = (staffData || []).slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handlers
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Reset to page 1 if data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [staffData]);

  return (
    <div style={tableWrapperStyle} id="table-to-pdf">
      <table className="table align-middle mb-0 sim-table" style={{ minWidth: 600 }}>
        <thead>
          <tr>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>NAME</th>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>DATE</th>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>SIGN-IN TIME</th>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>SIGN-OUT TIME</th>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>STATUS</th>
            {!isMobile && <th className="text-secondary fw-semibold" style={tableCellStyle}>NOTES</th>}
            {/* <th className="text-secondary fw-semibold text-end" style={tableCellStyle}>ACTIONS</th> */}
          </tr>
        </thead>
        <tbody>
          {(paginatedRows || []).map((row, idx) => (
            <tr key={idx}>
              <td style={tableCellStyle}>
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="sim-avatar d-flex align-items-center justify-content-center rounded-circle fw-bold"
                    style={{
                      width: isMobile ? 28 : 38,
                      height: isMobile ? 28 : 38,
                      background: "#eaf6f0",
                      color: "#16a34a",
                      fontSize: isMobile ? 13 : 16,
                    }}
                  >
                    {row.initials}
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: isMobile ? 13 : 16 }}>{row.name}</div>
                    {/* <div className="text-secondary small" style={{ fontSize: isMobile ? 11 : 13 }}>{row.role}</div> */}
                  </div>
                </div>
              </td>
              <td style={tableCellStyle}>{row.date}</td>
              <td style={tableCellStyle}>{row.signIn}</td>
              <td style={tableCellStyle}>{row.signOut}</td>
              <td style={tableCellStyle}>
                <span className={statusBadge[row.statusType]}>{row.status}</span>
              </td>
              {!isMobile && (
                <td style={tableCellStyle}>
                  <span className="sim-notes text-truncate d-inline-block" style={{ maxWidth: 100 }}>
                    {row.notes}
                  </span>
                </td>
              )}
              {/* <td className="text-end" style={tableCellStyle}>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn p-1 border border-primary text-primary"
                    style={{ borderRadius: 10 }}
                    title="Edit"
                    onClick={() => openModal(row)}
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    className="btn p-1 border border-danger text-danger"
                    style={{ borderRadius: 10 }}
                    title="Delete"
                    onClick={() => handleDelete(row)}
                  >
                    <RiDeleteBin6Line size={18} />
                  </button>
                </div>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 px-1" style={{ fontSize: isMobile ? 12 : 14 }}>
        <span className="text-secondary small">
          {totalRows === 0
            ? "No results"
            : `Showing ${(currentPage - 1) * rowsPerPage + 1} to ${Math.min(currentPage * rowsPerPage, totalRows)} of ${totalRows} results`}
        </span>
        <nav>
          <ul className="pagination sim-pagination mb-0">
            <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item${currentPage === i + 1 ? " active" : ""}`}>
                <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item${currentPage === totalPages || totalRows === 0 ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalRows === 0}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TeacherTable;