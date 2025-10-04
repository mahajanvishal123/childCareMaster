import React, { useState, useRef } from 'react';
import { Row, Col, Card, Table, Button, InputGroup, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { MdOutlineNightlight } from 'react-icons/md';
import html2pdf from 'html2pdf.js';

const SleepLogs = ({ records = [], themeColor, handleShow, loading, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [classroomFilter, setClassroomFilter] = useState('All Classrooms');
    const [dateFilter, setDateFilter] = useState('This Month');
    const tableRef = useRef();

    // Simulate date filtering logic (update this as per your actual data)
    const isDateMatch = (log) => {
        // You can implement real date filtering here if needed
        return true;
    };

    const filteredRecords = records.filter((log) => {
        const matchesName = log.child_name ? log.child_name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const matchesClassroom = classroomFilter === 'All Classrooms' || (log.classroom_name === classroomFilter);
        const matchesDate = isDateMatch(log);
        return matchesName && matchesClassroom && matchesDate;
    });

    const handleDownloadPDF = () => {
        const element = tableRef.current;
        const opt = {
            margin: 0.3,
            filename: 'sleep-logs-report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <>
            <Row className="mb-3">
                <Col xs={12} className="d-flex flex-wrap gap-2 justify-content-end align-items-center">
                    <div className="d-flex gap-2">
                        {/* <Form.Select value={classroomFilter} onChange={(e) => setClassroomFilter(e.target.value)}>
                            <option>All Classrooms</option>
                          
                           
                        </Form.Select> */}
                        <Form.Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                            <option>This Month</option>
                            <option>This Week</option>
                            <option>Today</option>
                        </Form.Select>
                    </div>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm" ref={tableRef}>
                <Card.Body className="p-0">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center p-3 pb-0">
                        <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle p-2" style={{ backgroundColor: themeColor }}>
                                <MdOutlineNightlight size={20} className="text-white" />
                            </div>
                            <div>
                                <div className="fw-bold">Sleep Records</div>
                                <div className="text-muted">Today: June 18, 2025</div>
                            </div>
                        </div>
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                            <InputGroup style={{ maxWidth: '220px' }}>
                                <Form.Control
                                    placeholder="Search by child name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                            <Button variant="outline-secondary" onClick={handleDownloadPDF}>
                                <FaDownload className="me-1" /> Report
                            </Button>
                            <Button style={{ backgroundColor: themeColor }} onClick={handleShow}>
                                + Add Sleep Log
                            </Button>
                        </div>
                    </div>
                    <Table className="mb-0">
                        <thead>
                            <tr>
                                <th><Form.Check type="checkbox" /></th>
                                <th>Child Name</th>
                                <th>Classroom</th>
                                <th>Nap Start</th>
                                <th>Nap End</th>
                                <th>Duration</th>
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
                                        <td>{log.nap_start ? new Date(log.nap_start).toLocaleTimeString() : ''}</td>
                                        <td>{log.nap_end ? new Date(log.nap_end).toLocaleTimeString() : ''}</td>
                                        <td>{log.duration}</td>
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

export default SleepLogs;
