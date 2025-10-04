import React, { useState, useRef } from 'react';
import { Row, Col, Card, Table, Button, InputGroup, Form } from 'react-bootstrap';
import { FaCheckCircle, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

const Maintenance = ({ records = [], themeColor, handleShow, getPriorityBadge, getStatusBadge, loading, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const tableRef = useRef();

    const filteredRecords = records.filter((req) => {
        const lower = searchTerm.toLowerCase();
        return (
            (req.request_title && req.request_title.toLowerCase().includes(lower)) ||
            (req.location && req.location.toLowerCase().includes(lower)) ||
            (req.assignedto_name && req.assignedto_name.toLowerCase().includes(lower))
        );
    });

    const handleDownloadPDF = () => {
        const element = tableRef.current;
        const opt = {
            margin: 0.3,
            filename: 'maintenance-report.pdf',
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
                    <h5 className="fw-semibold">Maintenance Requests</h5>
                    <p className="text-muted small">All facility maintenance tasks</p>
                </Col>
                <Col md={6} className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                    <InputGroup style={{ maxWidth: '250px' }}>
                        <Form.Control
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <Button variant="secondary" onClick={handleDownloadPDF}>
                        <FaDownload className="me-1" />
                        Report
                    </Button>
                    <Button style={{ backgroundColor: themeColor, color: 'white' }} onClick={handleShow}>
                        + New Request
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm border-0" ref={tableRef}>
                <Card.Body>
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="rounded-circle p-2" style={{ backgroundColor: themeColor }}>
                            <FaCheckCircle size={22} className="text-white" />
                        </div>
                        <div>
                            <div className="fw-bold">Maintenance Requests</div>
                            <div className="text-muted">All facility maintenance tasks</div>
                        </div>
                    </div>

                    <Table className="align-middle mb-0">
                        <thead>
                            <tr>
                                <th><Form.Check type="checkbox" /></th>
                                <th>Request Title</th>
                                <th>Location/Room</th>
                                <th>Date Reported</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">Loading...</td>
                                </tr>
                            ) : filteredRecords.length > 0 ? (
                                filteredRecords.map((req, idx) => (
                                    <tr key={idx}>
                                        <td><Form.Check type="checkbox" /></td>
                                        <td>{req.request_title}</td>
                                        <td>{req.location}</td>
                                        <td>{req.date_reported ? new Date(req.date_reported).toLocaleDateString() : ''}</td>
                                        <td>{getPriorityBadge(req.priority)}</td>
                                        <td>{getStatusBadge(req.status)}</td>
                                        <td>{req.assignedto_name}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                {/* <FaEdit className="text-success cursor-pointer" title="Edit" onClick={handleShow} /> */}
                                                <FaTrash className="text-danger cursor-pointer" title="Delete" onClick={() => onDelete(req.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">No matching records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
};

export default Maintenance;
