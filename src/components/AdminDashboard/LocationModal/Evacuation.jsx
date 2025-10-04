import React, { useState, useRef } from 'react';
import { Row, Col, Card, Table, Button, InputGroup, Form, Pagination } from 'react-bootstrap';
import { FaFileAlt, FaTrash, FaRunning } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

const Evacuation = ({ records = [], themeColor, handleShow, loading, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 2; // Show 5 rows per page
  const tableRef = useRef();

  const filteredRecords = records.filter((item) => {
    const dateStr = item.date ? new Date(item.date).toLocaleDateString() : '';
    const conductedBy = item.conducted_by ? item.conducted_by.toLowerCase() : '';
    const remarks = item.remarks ? item.remarks.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    return (
      dateStr.includes(search) ||
      conductedBy.includes(search) ||
      remarks.includes(search)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleDownloadPDF = () => {
    const element = tableRef.current;
    const opt = {
      margin: 0.3,
      filename: 'evacuation-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <Row className="mb-3 align-items-center justify-content-between">
        <Col md={6}>
          <h5 className="fw-semibold">Evacuation In-Place</h5>
          <p className="text-muted small">Bi-annual evacuation drills and records</p>
        </Col>
        <Col md={6} className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
          <InputGroup style={{ maxWidth: '250px' }}>
            <Form.Control
              placeholder="Search evacuations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Button variant="outline-secondary" onClick={handleDownloadPDF}>
            <FaFileAlt className="me-1" /> Report
          </Button>
          <Button style={{ backgroundColor: themeColor }} onClick={handleShow}>
            + Add New Record
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm border-0" ref={tableRef}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle p-2" style={{ backgroundColor: themeColor }}>
                <FaRunning className="text-white" size={20} />
              </div>
              <strong className="text-dark">Evacuation Records</strong>
            </div>
            <div className="small text-success">Next evacuation due: September 15, 2025</div>
          </div>

          <Table responsive bordered hover className="align-middle">
            <thead className="table-light">
              <tr className="small text-dark">
                <th className="text-center"><Form.Check /></th>
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
                  <td colSpan="6" className="text-center text-muted">Loading...</td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((item, idx) => (
                  <tr key={idx} className="text-dark">
                    <td className="text-center"><Form.Check /></td>
                    <td>{item.date ? new Date(item.date).toLocaleDateString() : ''}</td>
                    <td>{item.conducted_by}</td>
                    <td>{item.remarks}</td>
                    <td>
                      {item.document ? (
                        <a
                          href={item.document}
                          download
                          title={item.document}
                          className="text-decoration-none"
                          style={{ color: '#2ab7a9' }}
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
                          onClick={() => onDelete(item.evacuation_id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No records found.</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-end mt-3">
              <Pagination>
                {[...Array(totalPages).keys()].map((page) => (
                  <Pagination.Item
                    key={page + 1}
                    active={page + 1 === currentPage}
                    onClick={() => handlePageChange(page + 1)}
                    style={{
                      backgroundColor: page + 1 === currentPage ? '#2ab7a9' : 'transparent',
                      borderColor: '#2ab7a9',
                      color: page + 1 === currentPage ? '#fff' : '#2ab7a9',
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

export default Evacuation;
