import React, { useState, useRef } from 'react';
import { Row, Col, Card, Table, Button, InputGroup, Form } from 'react-bootstrap';
import { FaDownload, FaEdit, FaTrash } from 'react-icons/fa';
import { MdOutlineCheckroom } from 'react-icons/md';
import html2pdf from 'html2pdf.js';

const DiaperLogs = ({ records = [], themeColor, handleShow, loading, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const tableRef = useRef();

    const filteredRecords = records.filter((log) => {
        return log.child_name ? log.child_name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    });

    const handleDownloadPDF = () => {
        const element = tableRef.current;
        const opt = {
            margin: 0.3,
            filename: 'diaper-logs-report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <>
            <Card className="shadow-sm border-0" ref={tableRef}>
                <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                        {/* Left Title */}
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle p-2" style={{ backgroundColor: themeColor }}>
                                <MdOutlineCheckroom size={22} className="text-white" />
                            </div>
                            <div>
                                <div className="fw-bold">Diaper Change Records</div>
                                <div className="text-muted">Today: June 18, 2025</div>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <InputGroup style={{ maxWidth: '150px' }}>
                                <Form.Control
                                    placeholder="Search by child name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>

                            <Button
                                variant="secondary"
                                onClick={handleDownloadPDF}
                                style={{ fontWeight: 500 }}
                                title="Download PDF"
                            >
                                <FaDownload className="me-1" />
                                Report
                            </Button>

                            <Button
                                style={{ backgroundColor: themeColor, color: 'white' }}
                                onClick={handleShow}
                            >
                                + Add Diaper Log
                            </Button>
                        </div>
                    </div>

                    <Table className="mb-0">
                        <thead>
                            <tr>
                                <th><Form.Check type="checkbox" /></th>
                                <th>Child Name</th>
                                <th>Classroom</th>
                                <th>Time</th>
                                <th>Changed By</th>
                                <th>Type</th>
                                <th>Notes</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">Loading...</td>
                                </tr>
                            ) : filteredRecords.length > 0 ? (
                                filteredRecords.map((log, idx) => (
                                    <tr key={idx}>
                                        <td><Form.Check type="checkbox" /></td>
                                        <td>{log.child_name}</td>
                                        <td>{log.classroom_name}</td>
                                        <td>{log.time ? new Date(log.time).toLocaleTimeString() : ''}</td>
                                        <td>{log.changed_by_name}</td>
                                        <td>{log.type}</td>
                                        <td>{log.notes}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                {/* <FaEdit className="text-success cursor-pointer" title="Edit" onClick={handleShow} /> */}
                                                <FaTrash className="text-danger cursor-pointer" title="Delete" onClick={() => onDelete(log.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">
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

export default DiaperLogs;
