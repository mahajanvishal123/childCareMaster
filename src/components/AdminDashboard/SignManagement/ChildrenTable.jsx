import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BASE_URL } from "../../../utils/config";

export default function ChildrenTable({
  tableWrapperStyle,
  tableCellStyle,
  isMobile,
  childrenData,
  openModal,
  handleDelet,
}) {
  const statusBadge = {
    success: "badge bg-success text-white",
    warning: "badge bg-warning text-dark",
    danger: "badge bg-danger text-white",
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = (childrenData || []).length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Calculate the rows to display
  const paginatedRows = (childrenData || []).slice(
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
  }, [childrenData]);

  return (
    <div style={tableWrapperStyle} id="children-table">
      <table className="table align-middle mb-0 sim-table" style={{ minWidth: 600 }}>
        <thead>
          <tr>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>Initials</th>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>Name</th>
            {/* <th className="text-secondary fw-semibold" style={tableCellStyle}>Role/Class</th> */}
            <th className="text-secondary fw-semibold" style={tableCellStyle}>Date</th>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>Sign In</th>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>Sign Out</th>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>Status</th>
            <th className="text-secondary fw-semibold" style={tableCellStyle}>Notes</th>
            {/* <th className="text-secondary fw-semibold text-end" style={tableCellStyle}>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {(paginatedRows || []).length > 0 ? (
            (paginatedRows || []).map((child, idx) => (
              <tr key={idx}>
                <td style={tableCellStyle}>{child.initials}</td>
                <td style={tableCellStyle}>{child.name}</td>
                {/* <td style={tableCellStyle}>{child.role}</td> */}
                <td style={tableCellStyle}>{child.date}</td>
                <td style={tableCellStyle}>{child.signIn}</td>
                <td style={tableCellStyle}>{child.signOut}</td>
                <td style={tableCellStyle}>
                  <span className={statusBadge[child.statusType]}>{child.status}</span>
                </td>
                <td style={tableCellStyle}>{child.notes}</td>
                {/* <td className="text-end" style={tableCellStyle}>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn p-1 border border-primary text-primary" style={{ borderRadius: 10 }} title="Edit" onClick={() => openModal(child)}>
                      <FiEdit size={18} />
                    </button>
                    <button className="btn p-1 border border-danger text-danger" style={{ borderRadius: 10 }} title="Delete" onClick={() => handleDelet(child)}>
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </div>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-muted">
                No child sign-in data found.
              </td>
            </tr>
          )}
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
}