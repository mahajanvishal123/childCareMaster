import React, { useState, useEffect } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addDocument, getDocuments, deleteDocument } from "../../../redux/slices/documentSlice";
import { getUsers } from "../../../redux/slices/userSlice";
import dayjs from "dayjs";

export default function DocumentsVault() {
  const dispatch = useDispatch();

  // Redux state
  const { documents, loading, error } = useSelector((state) => state.document);
  const { user } = useSelector((state) => state.user);

  // Local state
  const [showModal, setShowModal] = useState(false);
  const loggedInUser = localStorage.getItem("user_id");

  const [form, setForm] = useState({
    document_title: "",
    upload_for_user_id: "",
    expiry_date: "",
    submitted_by_user_id: loggedInUser,
    document_file: null,
  });

  // Fetch docs + users
  useEffect(() => {
    dispatch(getDocuments());
    dispatch(getUsers());
  }, [dispatch]);

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Submit form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("document_title", form.document_title);
    formData.append("upload_for_user_id", form.upload_for_user_id);
    formData.append("expiry_date", form.expiry_date);
    formData.append("submitted_by_user_id", form.submitted_by_user_id);
    formData.append("document_file", form.document_file);

    await dispatch(addDocument(formData));
    setShowModal(false);
    setForm({
      document_title: "",
      upload_for_user_id: "",
      expiry_date: "",
      submitted_by_user_id: loggedInUser,
      document_file: null,
    });
    dispatch(getDocuments());
  };

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      dispatch(deleteDocument(id));
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold" style={{ color: "#2ab7a9" }}>
          Documents Vault
        </h4>
        <Button onClick={() => setShowModal(true)} style={{ background: "#2ab7a9" }}>
          + Add Document
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <p className="text-danger">Failed to load documents.</p>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Uploaded For</th>
              <th>Upload Date</th>
              <th>Expiry Date</th>
              <th>File</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents && documents.length > 0 ? (
              documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.document_title}</td>
                  <td>{doc.first_name} {doc.last_name}</td>
                  <td>{dayjs(doc.created_at).format("YYYY-MM-DD")}</td>
                  <td>{doc.expiry_date}</td>
                  <td>
                    <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No documents found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog">
            <form onSubmit={handleFormSubmit} encType="multipart/form-data">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Upload Document</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Document Title</label>
                    <input
                      type="text"
                      name="document_title"
                      value={form.document_title}
                      onChange={handleFormChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Upload For</label>
                    <select
                      name="upload_for_user_id"
                      value={form.upload_for_user_id}
                      onChange={handleFormChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select User</option>
                      {user &&
                        user.map((u) => (
                          <option key={u.user_id} value={u.user_id}>
                            {u.first_name} {u.last_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="date"
                      name="expiry_date"
                      value={form.expiry_date}
                      onChange={handleFormChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Document File</label>
                    <input
                      type="file"
                      name="document_file"
                      onChange={handleFormChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="success">
                    Upload
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
