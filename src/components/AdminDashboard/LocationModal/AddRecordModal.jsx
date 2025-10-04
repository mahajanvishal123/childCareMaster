import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { BASE_URL } from '../../../utils/config';
import axios from 'axios';
import { getClassroom } from '../../../redux/slices/classRoomSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../../redux/slices/userSlice';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AddRecordModal = ({ show, handleClose, activeTab, formData, setFormData, themeColor, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [outstanding, setOutstanding] = useState([]); // NEW: For outstanding requirements
    const dispatch = useDispatch();

    const { classroom } = useSelector((state) => state.classroom);
    const { user } = useSelector((state) => state.user);

    console.log("users", user);


    const filteredstaff = user.filter((user) => user.role_id === 1);


    console.log("classrooms", classroom);

    console.log("data", data);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        dispatch(getClassroom());
        dispatch(getUsers());
    }, []);




    const fetchChildren = async () => {
        console.log("fetching children");
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/children`);
            console.log("res", res);
            if (res.data.status === 200) {
                const formattedData = res.data.data
                    .filter((child) => child.role_name === "Child")
                    .map((child) => ({
                        child_id: child.child_id,
                        user_id: child.user_id,
                        name: child?.first_name + " " + child?.last_name || "",
                        dob: child.dob_english
                            ? new Date(child.dob_english).toLocaleDateString()
                            : "-",
                        enroll: child.enrollment_date
                            ? new Date(child.enrollment_date).toLocaleDateString()
                            : "-",
                        parent: `${child.father_name || ""} & ${child.mother_name || ""}`,
                        phone: child.home_phone || child.father_cell || child.mother_cell || "-",
                        Staff: child.assigned_teacher_id ? "Assigned" : "Not Assigned",
                        status: child.user_status || "Active",
                        // ...add other fields as needed
                    }));
                setData(formattedData);
                // setCurrentData(formattedData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // useEffect to fetch children on mount
    useEffect(() => {

        fetchChildren();
    }, []);


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
  const handleSubmit = (e) => {
        e.preventDefault();
        setOutstanding([]); // Clear outstanding on submit
        onSubmit(activeTab, formData, file);
    };


    // NEW: Save Draft handler for Maintenance tab
    const handleSaveDraft = () => {
        if (activeTab !== 'Maintenance') return;
        const missing = [];
        if (!formData.title) missing.push("Request Title");
        if (!formData.location) missing.push("Location/Room");
        if (!formData.dateReported) missing.push("Date Reported");
        if (!formData.priority) missing.push("Priority");
        if (!formData.status) missing.push("Status");
        if (!formData.changed_by) missing.push("Assigned To");
        setOutstanding(missing);
        if (missing.length === 0) {
            alert("Draft saved!");
        } else {
            alert("Draft saved! Please complete the outstanding requirements.");
        }
        // Optionally: Save draft to localStorage or backend here
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className='text-white' style={{ backgroundColor: themeColor }} >
                <Modal.Title>{`Add ${activeTab}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {activeTab === 'Fire Drills' && (
                        <>
                            <Form.Group controlId="formDate">
                                <Form.Label>Date</Form.Label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        value={formData.date ? dayjs(formData.date) : null}
                                        onChange={(newValue) => {
                                            const event = {
                                                target: {
                                                    name: "date",
                                                    value: newValue ? dayjs(newValue).format("YYYY-MM-DD") : "",
                                                },
                                            };
                                            handleInputChange(event);
                                        }}
                                        slotProps={{
                                            textField: {
                                                variant: "outlined",
                                                fullWidth: true,
                                                required: true,
                                                InputProps: {
                                                    className: "form-control", // applies Bootstrap style
                                                    style: { height: "38px", fontSize: "14px" }, // matches other inputs
                                                },
                                                inputProps: {
                                                    placeholder: "YYYY-MM-DD",
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Form.Group>
                            <Form.Group controlId="formConductedBy">
                                <Form.Label>Conducted By</Form.Label>
                                <Form.Control type="text" name="conductedBy" onChange={handleInputChange} required />
                            </Form.Group>

                            <Form.Group controlId="formRemarks">
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control as="textarea" name="remarks" onChange={handleInputChange} required />
                            </Form.Group>

                            <Form.Group controlId="formFireDrillDocument">
                                <Form.Label>Upload Fire Drill Document</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="fireDrillDocument"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                />
                                <Form.Text className="text-muted">
                                    Accepted formats: PDF, DOC, JPG, PNG
                                </Form.Text>
                            </Form.Group>
                        </>
                    )}

                    {activeTab === 'Evacuation' && (
                        <>
                            <Form.Group controlId="formDate">
                                <Form.Label>Date</Form.Label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        value={formData.date ? dayjs(formData.date) : null}
                                        onChange={(newValue) => {
                                            const event = {
                                                target: {
                                                    name: "date",
                                                    value: newValue ? dayjs(newValue).format("YYYY-MM-DD") : "",
                                                },
                                            };
                                            handleInputChange(event);
                                        }}
                                        slotProps={{
                                            textField: {
                                                variant: "outlined",
                                                fullWidth: true,
                                                required: true,
                                                InputProps: {
                                                    className: "form-control", // applies Bootstrap style
                                                    style: { height: "38px", fontSize: "14px" }, // matches other inputs
                                                },
                                                inputProps: {
                                                    placeholder: "YYYY-MM-DD",
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Form.Group>
                            <Form.Group controlId="formConductedBy">
                                <Form.Label>Conducted By</Form.Label>
                                <Form.Control type="text" name="conductedBy" onChange={handleInputChange} required />
                            </Form.Group>

                            <Form.Group controlId="formRemarks">
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control as="textarea" name="remarks" onChange={handleInputChange} required />
                            </Form.Group>

                            <Form.Group controlId="formEvacuationDocument">
                                <Form.Label>Upload Evacuation Document</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="evacuationDocument"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                />
                                <Form.Text className="text-muted">
                                    Accepted formats: PDF, DOC, JPG, PNG
                                </Form.Text>
                            </Form.Group>
                        </>
                    )}


                    {activeTab === 'Epipen Tracker' && (
                        <>
                            <Form.Group controlId="formEpipenType" >

                                <Form.Check
                                    type="radio"
                                    label="Patient Specific"
                                    name="epipen_type"
                                    value="patient"
                                    checked={formData.epipen_type === "patient"}
                                    onChange={handleInputChange}
                                    required
                                    inline
                                />
                                <Form.Check
                                    type="radio"
                                    label="Non-Patient Specific"
                                    name="epipen_type"
                                    value="non_patient"
                                    checked={formData.epipen_type === "non_patient"}
                                    onChange={handleInputChange}
                                    required
                                    inline
                                />
                            </Form.Group>

                            {/* Patient Specific */}
                            {formData.epipen_type === "patient" && (
                                <>
                                    <Form.Group controlId="formChildName">
                                        <Form.Label>Child Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Select name="child_id" onChange={handleInputChange} required>
                                            <option value="">Select Child</option>
                                            {data.map((child) => (
                                                <option key={child.child_id} value={child.child_id}>{child.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId="formEpipenID">
                                        <Form.Label>Epipen ID <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" name="epipenID" onChange={handleInputChange} required />
                                    </Form.Group>
                                    <Form.Group controlId="formExpiryDate">
                                        <Form.Label>
                                            Expiry Date <span className="text-danger">*</span>
                                        </Form.Label>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                format="DD-MM-YYYY" // Still showing DD-MM-YYYY to user
                                                value={formData.expiryDate ? dayjs(formData.expiryDate) : null}
                                                onChange={(newValue) => {
                                                    const event = {
                                                        target: {
                                                            name: "expiryDate",
                                                            value: newValue ? dayjs(newValue).toISOString() : "", // <-- ISO format
                                                        },
                                                    };
                                                    handleInputChange(event);
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        variant: "outlined",
                                                        fullWidth: true,
                                                        required: true,
                                                        InputProps: {
                                                            className: "form-control",
                                                            style: { height: "38px", fontSize: "14px" },
                                                        },
                                                        inputProps: {
                                                            placeholder: "DD-MM-YYYY",
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Form.Group>

                                    <Form.Group controlId="formLocation">
                                        <Form.Label>Location / Appendix Details</Form.Label>
                                        <Form.Control type="text" name="location" onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group controlId="formNotes">
                                        <Form.Label>Notes</Form.Label>
                                        <Form.Control as="textarea" name="notes" onChange={handleInputChange} />
                                    </Form.Group>
                                </>
                            )}

                            {/* Non-Patient Specific */}
                            {formData.epipen_type === "non_patient" && (
                                <>
                                    <Form.Group controlId="formLocation">
                                        <Form.Label>Room / Location <span className="text-danger">*</span></Form.Label>
                                        <Form.Select name="classroom_id" onChange={handleInputChange} required>
                                            <option value="">Select Room/Location</option>
                                            {classroom.map((room) => (
                                                <option key={room.classroom_id} value={room.classroom_id}>{room.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId="formStaffInCharge">
                                        <Form.Label>Staff In-Charge <span className="text-danger">*</span></Form.Label>
                                        <Form.Select name="staff_incharge" onChange={handleInputChange} required>
                                            <option value="">Select Staff</option>
                                            {user.filter(u => u.role_id === 1).map((staff) => (
                                                <option key={staff.user_id} value={staff.user_id}>{staff.first_name} {staff.last_name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId="formEpipenID">
                                        <Form.Label>Epipen ID <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" name="epipenID" onChange={handleInputChange} required />
                                    </Form.Group>
                                    <Form.Group controlId="formExpiryDate">
                                        <Form.Label>
                                            Expiry Date <span className="text-danger">*</span>
                                        </Form.Label>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                format="DD-MM-YYYY" // Still showing DD-MM-YYYY to user
                                                value={formData.expiryDate ? dayjs(formData.expiryDate) : null}
                                                onChange={(newValue) => {
                                                    const event = {
                                                        target: {
                                                            name: "expiryDate",
                                                            value: newValue ? dayjs(newValue).toISOString() : "", // <-- ISO format
                                                        },
                                                    };
                                                    handleInputChange(event);
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        variant: "outlined",
                                                        fullWidth: true,
                                                        required: true,
                                                        InputProps: {
                                                            className: "form-control",
                                                            style: { height: "38px", fontSize: "14px" },
                                                        },
                                                        inputProps: {
                                                            placeholder: "DD-MM-YYYY",
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Form.Group>

                                    <Form.Group controlId="formStaffCertificate">
                                        <Form.Label>Upload Staff EpiPen (IPN) Certificate <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.jpg,.png"
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Accepted formats: PDF, DOC, JPG, PNG
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group controlId="formCertificateExpiry">
                                        <Form.Label>
                                            Certificate Expiration Date <span className="text-danger">*</span>
                                        </Form.Label>

                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={formData.certificate_expiry ? dayjs(formData.certificate_expiry) : null}
                                                onChange={(newValue) => {
                                                    const formattedDate = newValue ? dayjs(newValue).format("DD-MM-YYYY") : "";
                                                    handleInputChange({
                                                        target: {
                                                            name: "certificate_expiry",
                                                            value: formattedDate,
                                                        },
                                                    });
                                                }}
                                                 slotProps={{
                                                    textField: {
                                                        variant: "outlined",
                                                        fullWidth: true,
                                                        required: true,
                                                        InputProps: {
                                                            className: "form-control",
                                                            style: { height: "38px", fontSize: "14px" },
                                                        },
                                                        inputProps: {
                                                            placeholder: "DD-MM-YYYY",
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Form.Group>
                                    <Form.Group controlId="formNotes">
                                        <Form.Label>Notes</Form.Label>
                                        <Form.Control as="textarea" name="notes" onChange={handleInputChange} />
                                    </Form.Group>
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'Sleep Logs' && (
                        <>
                            <Form.Group controlId="formChildName">
                                <Form.Label>Child Name</Form.Label>
                                <Form.Select name="child_id" onChange={handleInputChange} required>
                                    <option value="">Select Child</option>
                                    {data.map((child) => (
                                        <option key={child.child_id} value={child.child_id}>{child.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="formClassroom">
                                <Form.Label>Classroom</Form.Label>
                                <Form.Select name="classroom_id" onChange={handleInputChange} required>
                                    <option value="">Select Classroom</option>
                                    {classroom.map((classroom) => (
                                        <option key={classroom.classroom_id} value={classroom.classroom_id}>{classroom.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="formNapStart">
                                <Form.Label>Nap Start</Form.Label>
                                <Form.Control type="time" name="nap_start" onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="formNapEnd">
                                <Form.Label>Nap End</Form.Label>
                                <Form.Control type="time" name="nap_end" onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="formNotes">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control as="textarea" name="notes" onChange={handleInputChange} required />
                            </Form.Group>
                        </>
                    )}

                    {activeTab === 'Diaper Logs' && (
                        <>
                            <Form.Group controlId="formChildName">
                                <Form.Label>Child Name</Form.Label>
                                <Form.Select name="child_id" onChange={handleInputChange} required>
                                    <option value="">Select Child</option>
                                    {data.map((child) => (
                                        <option key={child.child_id} value={child.child_id}>{child.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="formClassroom">
                                <Form.Label>Classroom</Form.Label>
                                <Form.Select name="classroom_id" onChange={handleInputChange} required>
                                    <option value="">Select Classroom</option>
                                    {classroom.map((classroom) => (
                                        <option key={classroom.classroom_id} value={classroom.classroom_id}>{classroom.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="formTime">
                                <Form.Label>Time</Form.Label>
                                <Form.Control type="time" name="time" onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="formChangedBy">
                                <Form.Label>Changed By</Form.Label>
                                <Form.Select name="changed_by" onChange={handleInputChange} required>
                                    <option value="">Select Staff</option>
                                    {filteredstaff.map((staff) => (
                                        <option key={staff.user_id} value={staff.user_id}>{staff.first_name} {staff.last_name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="formType">
                                <Form.Label>Type</Form.Label>
                                <Form.Control type="text" name="type" onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="formNotes">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control as="textarea" name="notes" onChange={handleInputChange} required />
                            </Form.Group>
                        </>
                    )}

                    {activeTab === 'Maintenance' && (
                        <>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Request Title</Form.Label>
                                <Form.Control type="text" name="title" onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="formLocation">
                                <Form.Label>Location/Room</Form.Label>
                                <Form.Control type="text" name="location" onChange={handleInputChange} required />
                            </Form.Group>

                            <Form.Group controlId="formDateReported">
                                <Form.Label>Date Reported <span className="text-danger">*</span></Form.Label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        format="DD-MM-YYYY"
                                        value={formData.dateReported ? dayjs(formData.dateReported) : null}
                                        onChange={(newValue) => {
                                            handleInputChange({
                                                target: {
                                                    name: 'dateReported',
                                                    value: newValue ? dayjs(newValue).format('YYYY-MM-DD') : ''
                                                }
                                            });
                                        }}
                                         slotProps={{
                                                    textField: {
                                                        variant: "outlined",
                                                        fullWidth: true,
                                                        required: true,
                                                        InputProps: {
                                                            className: "form-control",
                                                            style: { height: "38px", fontSize: "14px" },
                                                        },
                                                        inputProps: {
                                                            placeholder: "DD-MM-YYYY",
                                                        },
                                                    },
                                                }}
                                    />
                                </LocalizationProvider>
                            </Form.Group>
                            <Form.Group controlId="formPriority">
                                <Form.Label>Priority</Form.Label>
                                <Form.Control as="select" name="priority" onChange={handleInputChange} required>
                                    <option value="">Select Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control as="select" name="status" onChange={handleInputChange} required>
                                    <option value="">Select Status</option>
                                    <option value="Open">Open</option>
                                    <option value="Closed">Closed</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formAssignedTo">
                                <Form.Label>Assigned To</Form.Label>
                                <Form.Select name="changed_by" onChange={handleInputChange} >
                                    <option value="">Select</option>
                                    {user.filter((user) => user.role_id !== 2).map((staff) => (
                                        <option key={staff.user_id} value={staff.user_id}>{staff.first_name} {staff.last_name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            {/* Save Draft and Outstanding Requirements */}
                            <div className="d-flex justify-content-end gap-2 mt-3">
                                {/* <Button
                                    variant="outline-primary"
                                    onClick={handleSaveDraft}
                                    style={{ borderColor: themeColor, color: themeColor }}
                                    type="button"
                                >
                                    Save Draft
                                </Button> */}
                                {/* <Button
                                    type="submit"
                                    style={{ backgroundColor: themeColor, borderColor: themeColor }}
                                >
                                    Submit
                                </Button> */}
                            </div>
                            {outstanding.length > 0 && (
                                <div className="mt-3">
                                    <h6>Outstanding Requirements</h6>
                                    <ul>
                                        {outstanding.map((item, idx) => (
                                            <li key={idx} className="text-danger">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}

                    <Button type="submit" className="mt-3" style={{ backgroundColor: themeColor }}>
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddRecordModal;
