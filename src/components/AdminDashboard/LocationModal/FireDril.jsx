import React, { useState, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  InputGroup,
  Form,
  Pagination,
} from "react-bootstrap";
import { FaFileAlt, FaTrash, FaFireAlt } from "react-icons/fa";
import html2pdf from "html2pdf.js";

const FireDrills = ({ themeColor, handleShow, records = [], loading, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef();

  const itemsPerPage = 5; // adjust page size here

  // Filter records by search term (date, conductedby, remarks)
  const filteredRecords = records.filter((item) => {
    const dateStr = item.date ? new Date(item.date).toLocaleDateString() : "";
    const conductedBy = item.conductedby ? item.conductedby.toLowerCase() : "";
    const remarks = item.remarks ? item.remarks.toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    return (
      dateStr.includes(search) ||
      conductedBy.includes(search) ||
      remarks.includes(search)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDownloadPDF = () => {
    const element = tableRef.current;
    const opt = {
      margin: 0.3,
      filename: "fire-drill-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <Row className="mb-3 align-items-center justify-content-between">
        <Col md={6}>
          <h5 className="fw-semibold">Fire Drill Records</h5>
          <p className="text-muted small">
            Regular fire safety drills and documentation
          </p>
        </Col>
        <Col
          md={6}
          className="d-flex justify-content-end align-items-center gap-2 flex-wrap"
        >
          <InputGroup style={{ maxWidth: "250px" }}>
            <Form.Control
              placeholder="Search fire drills..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to first page when searching
              }}
            />
          </InputGroup>
          <Button variant="outline-secondary" onClick={handleDownloadPDF}>
            <FaFileAlt className="me-1" /> Report
          </Button>
          <Button
            style={{ backgroundColor: themeColor }}
            onClick={() => handleShow()}
          >
            + Add Fire Drill
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm border-0" ref={tableRef}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle p-2"
                style={{ backgroundColor: themeColor }}
              >
                <FaFireAlt className="text-white" size={20} />
              </div>
              <strong className="text-dark">Fire Drill History</strong>
            </div>
            <div className="small text-success">
              {/* Last conducted: January 10, 2025 */}
            </div>
          </div>

          <Table responsive bordered hover className="align-middle">
            <thead className="table-light">
              <tr className="small text-dark">
                <th className="text-center">
                  <Form.Check />
                </th>
                <th>Date</th>
                <th>Conducted By</th>
                <th>Remarks</th>
                <th>Document</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    Loading...
                  </td>
                </tr>
              ) : paginatedRecords.length > 0 ? (
                paginatedRecords.map((item, idx) => (
                  <tr key={idx} className="text-dark">
                    <td className="text-center">
                      <Form.Check />
                    </td>
                    <td>
                      {item.date ? new Date(item.date).toLocaleDateString() : ""}
                    </td>
                    <td>{item.conductedby}</td>
                    <td>{item.remarks}</td>
                    <td>
                      {item.document ? (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={item.document}
                          download
                          title={item.document}
                          className="text-decoration-none"
                          style={{ color: "#2ab7a9" }}
                        >
                          <FaFileAlt /> report
                        </a>
                      ) : (
                        <span className="text-muted">No document</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-3">
                        <FaTrash
                          className="text-danger cursor-pointer"
                          title="Delete"
                          onClick={() => onDelete(item.fire_drill_id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination controls */}
         {totalPages > 1 && (
  <div className="d-flex justify-content-end">
    <Pagination>
      {[...Array(totalPages).keys()].map((page) => (
        <Pagination.Item
          key={page + 1}
          active={page + 1 === currentPage}
          onClick={() => handlePageChange(page + 1)}
          style={{
            backgroundColor: page + 1 === currentPage ? "#2ab7a9" : "transparent",
            borderColor: "#2ab7a9",
            color: page + 1 === currentPage ? "#fff" : "#2ab7a9",
          }}
        >
          {page + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  </div>
)}

        </Card.Body>
      </Card>
    </>
  );
};

export default FireDrills;
