import React, { useState, useRef } from 'react';
import { Row, Col, Card, Table, Button, InputGroup, Form } from 'react-bootstrap';
import { FaChevronDown, FaDownload, FaEdit, FaTrash } from 'react-icons/fa';
import { MdOutlineNightlight } from 'react-icons/md';
import html2pdf from 'html2pdf.js';

const EpipenTracker = ({ records = [], themeColor, handleShow, loading, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const tableRef = useRef();

    const filteredRecords = records.filter((rec) =>
        rec.child_name ? rec.child_name.toLowerCase().includes(searchTerm.toLowerCase()) : false
    );

    const handleDownloadPDF = () => {
        const element = tableRef.current;
        const opt = {
            margin: 0.3,
            filename: 'epipen-inventory-report.pdf',
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
                    <h5 className="fw-semibold">Epipen Expiration Tracker</h5>
                    <p className="text-muted small">Monitor and manage epipens for all children</p>
                </Col>
                <Col md={6} className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                    <InputGroup style={{ maxWidth: '250px' }}>
                        <Form.Control
                            placeholder="Search by child name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <Button variant="outline-secondary" title="Export" onClick={handleDownloadPDF}>
                        <FaDownload />
                    </Button>
                    <Button style={{ backgroundColor: themeColor }} onClick={handleShow}>
                        + Add New Epipen
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm border-0" ref={tableRef}>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle p-2" style={{ backgroundColor: themeColor }}>
                                <MdOutlineNightlight size={20} className="text-white" />
                            </div>
                            <div>
                                <div className="fw-semibold">Epipen Inventory</div>
                                {/* <div className="text-danger small">2 epipens expiring soon</div> */}
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                            <Button variant="light" title="Filter">
                                {/* <FaChevronDown /> */}
                            </Button>
                            <Button variant="light" title="Export PDF" onClick={handleDownloadPDF}>
                                <FaDownload />
                            </Button>
                        </div>
                    </div>

                    <Table className="table align-middle">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>
                                    <Form.Check type="checkbox" />
                                </th>
                                <th>Child Name</th>
                                <th>Epipen ID</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">Loading...</td>
                                </tr>
                            ) : filteredRecords.length > 0 ? (
                                filteredRecords.map((rec, idx) => (
                                    <tr key={idx}>
                                        <td><Form.Check type="checkbox" /></td>
                                        <td>{rec.child_name}</td>
                                        <td>{rec.epipen_unique_id}</td>
                                        <td>{rec.expiry_date ? new Date(rec.expiry_date).toLocaleDateString() : ''}</td>
                                        <td>{rec.status}</td>
                                        <td>
                                            <div className="d-flex gap-3">
                                                {/* <FaEdit className="text-success cursor-pointer" title="Edit" onClick={handleShow} /> */}
                                                <FaTrash className="text-danger cursor-pointer" title="Delete" onClick={() => onDelete(rec.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">
                                        No matching records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
};

export default EpipenTracker;
