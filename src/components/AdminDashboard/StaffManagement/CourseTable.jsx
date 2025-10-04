import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaFileAlt, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import html2pdf from 'html2pdf.js';
import { useDispatch, useSelector } from "react-redux";
import { addCourse, deleteCourse, getAllCourses, updateCourse } from "../../../redux/slices/courseSlice";
import toast from "react-hot-toast";
import { useConfirmDelete } from "../../../hooks/useCustomDelete";

const CourseTable = () => {
      
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
     const dispatch = useDispatch();
  const { courses, courseloading } = useSelector((state) => state.courses);

  const user_id = 2; // replace with dynamic user ID if needed

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    user_id,
    course_name: "",
    completion_date: "",
    expiration_date: "",
    certificate: null,
  });

  const tableRef = useRef();

  const handleDownloadPDF = () => {
    const opt = {
      margin: 0.3,
      filename: "course-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(tableRef.current).save();
  };

  const user_Id =  2;

  const handleAddCourse = () => {
    const formData = new FormData();
    formData.append("user_id", newCourse.user_id);
    formData.append("name", newCourse.name);
    formData.append("completion_date", newCourse.completion_date);
    formData.append("expiration_date", newCourse.expiration_date);
    if (newCourse.certificate) {
      formData.append("certificate_file", newCourse.certificate);
    }

    dispatch(addCourse(formData))
      .unwrap()
      .then(() => {
        toast.success("Course added successfully");
        setShowAddModal(false);
        // reset form
        setNewCourse({
          user_id,
          course_name: "",
          completion_date: "",
          expiration_date: "",
          certificate: null,
        });
      })
      .catch(() => {
        toast.error("Failed to add course");
      });
  };



const handleEditCourse = () => {
  const formData = new FormData();
  formData.append("user_id",user_Id);
  formData.append("course_name", selectedCourse.course_name);
  formData.append("completion_date", selectedCourse.completion_date);
  formData.append("expiration_date", selectedCourse.expiration_date);

  if (selectedCourse.newCertificate) {
    formData.append("certificate_file", selectedCourse.newCertificate);
  }

  dispatch(updateCourse({ course_id: selectedCourse.course_id, formData }))
    .unwrap()
    .then(() => {
      toast.success("Course updated successfully");
      setShowEditModal(false);
      dispatch(getAllCourses());
    })
    .catch(() => {
      toast.error("Failed to update course");
    });
};



      const { confirmAndDelete } = useConfirmDelete();
    
      const handleDelete = (id) => {
        confirmAndDelete({
          id,
          action: deleteCourse,
          entity: "courses",
          onSuccess: () => {
            dispatch(getAllCourses());
    
          },
        });
      };
    

    const getDownloadableUrl = (url) => {
  if (!url.includes("res.cloudinary.com")) return url;

  // Force file download by inserting 'fl_attachment' into the URL
  return url.replace("/upload/", "/upload/fl_attachment/");
};

    return (
        <div className="mt-5 bg-white p-3 rounded shadow-sm" ref={tableRef}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h3 className="fw-semibold" style={{ color: "#2ab7a9" }}>Total Course</h3>
                <div className="d-flex flex-wrap gap-2">
  {/* <button
    className="btn btn-sm text-white"
    style={{ backgroundColor: "#2ab7a9" }}
    onClick={handleDownloadPDF}
  >
    <FaFileAlt size={14} className="me-1" /> Download Report
  </button> */}

  <button
    className="btn btn-sm text-white"
    style={{ backgroundColor: "#2ab7a9" }}
    onClick={() => setShowAddModal(true)}
  >
    <FaPlus size={14} className="me-1" /> Add New Course
  </button>
</div>

            </div>

            <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Course Name</th>
                            <th>Completion Date</th>
                            <th>Expiration Date</th>
                            {/* <th>Upload Certificate</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, course_id) => (
                            <tr key={course_id}>
                                <td>{course.name}</td>
                                <td>{ new Date(course.completion_date).toLocaleDateString()}</td>
                                <td>{ new Date(course.expiration_date).toLocaleDateString()}</td>
                                {/* <td>
                                    {course?.certificate_url ? (   <a
                                      href={course?.certificate_url &&  getDownloadableUrl(course?.certificate_file)}
                                        download
                                        title={course?.certificate_file}
                                        className="text-decoration-none"
                                    >
                                        <FaFileAlt color="#2ab7a9" />
                                    </a> ) : ( " ")}
                                 
                                </td> */}
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            title="View"
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                setShowViewModal(true);
                                            }}
                                        >
                                            <FaEye size={16} />
                                        </button>
                                        {/* <button
                                            className="btn btn-sm btn-outline-primary"
                                            title="Edit"
                                            onClick={() => {
                                                setSelectedCourse({
                                                  ...course,
                                                  course_name: course.name, // ensure course_name is set for backend
                                                  newCertificate: null
                                                });
                                                setShowEditModal(true);
                                            }}
                                        >
                                            <FaEdit size={16} />
                                        </button> */}
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            title="Delete"
                                            onClick={() => handleDelete(course.course_id)}
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Course Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control
                                value={newCourse.name}
                                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Completion Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newCourse.completion_date}
                                onChange={(e) => setNewCourse({ ...newCourse, completion_date: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Expiration Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newCourse.expiration_date}
                                onChange={(e) => setNewCourse({ ...newCourse, expiration_date: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Certificate File Name</Form.Label>
                            <Form.Control
                                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setNewCourse({ ...newCourse, certificate: e.target.files[0] })
                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleAddCourse}>Save</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Course Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCourse && (
                        <Form>
                           <Form.Group>
  <Form.Label>Course Name</Form.Label>
  <Form.Control
    value={selectedCourse.course_name}
    onChange={(e) => setSelectedCourse({ ...selectedCourse, name: e.target.value })}
  />
</Form.Group>
<Form.Group>
  <Form.Label>Completion Date</Form.Label>
  <Form.Control
    type="date"
    value={selectedCourse.completion_date?.slice(0, 10)}
    onChange={(e) => setSelectedCourse({ ...selectedCourse, completion_date: e.target.value })}
  />
</Form.Group>
<Form.Group>
  <Form.Label>Expiration Date</Form.Label>
  <Form.Control
    type="date"
    value={selectedCourse.expiration_date?.slice(0, 10)}
    onChange={(e) => setSelectedCourse({ ...selectedCourse, expiration_date: e.target.value })}
  />
</Form.Group>
<Form.Group>
  <Form.Label>Certificate File</Form.Label>
  <Form.Control
    type="file"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={(e) => setSelectedCourse({ ...selectedCourse, newCertificate: e.target.files[0] })}
  />
</Form.Group>

                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" disabled={courseloading} onClick={handleEditCourse}>
                        {courseloading ?  "Updating..." : "Update"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Course Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>View Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCourse && (
                        <div>
                            <p><strong>Course Name:</strong> {selectedCourse.name}</p>
                            <p><strong>Completion Date:</strong> {new Date(selectedCourse.completion_date).toLocaleDateString()}</p>
                            <p><strong>Expiration Date:</strong> {new Date(selectedCourse.expiration_date).toLocaleDateString()}</p>
                            {/* <p><strong>Certificate:</strong> {selectedCourse?.certificate_file ? (
                              <a
                                href={selectedCourse.certificate_file}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-block',
                                  maxWidth: '100%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  verticalAlign: 'middle',
                                  wordBreak: 'break-all',
                                }}
                                title={selectedCourse.certificate_file}
                              >
                                {selectedCourse.certificate_file}
                              </a>
                            ) : 'N/A'}</p> */}
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CourseTable;
