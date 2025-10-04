import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";

const ViewChild = ({ data }) => {
  if (!data) return <div>Loading...</div>;
  const { child, emergency_contacts, medical_info, documents } = data;
const safeParseArray = (data) => {
  if (!data) return [];
  try {
    return Array.isArray(data) ? data : JSON.parse(data);
  } catch {
    return [];
  }
};

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Personal Info */}
        <div className="card shadow-sm mb-4 overflow-hidden">
          <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
            <i className="ri-profile-line text-primary fs-5"></i>
            <h2 className="h5 mb-0">Personal Information</h2>
          </div>
          <div className="p-4">
            <div className="row g-4 align-items-start">
              <div className="col-md-3 text-center position-relative">
                <img
                  src={child.photo_url}
                  alt={child.full_name}
                  className="img-fluid rounded-circle mb-2"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-9">
                <div className="mb-3">
                  <strong>Full Name:</strong> {child.full_name}
                </div>
                <div className="row g-3">
                  <div className="col-md-6"><strong>Nickname (English):</strong> {child.nickname_english}</div>
                  <div className="col-md-6"><strong>Nickname (Hebrew):</strong> {child.nickname_hebrew}</div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6"><strong>Date of Birth (English):</strong> {child.dob_english && new Date(child.dob_english).toLocaleDateString()}</div>
                  <div className="col-md-6"><strong>Date of Birth (Hebrew):</strong> {child?.dob_hebrew }</div>
                </div>
                <div className="mb-3"><strong>Number in Family:</strong> {child.number_of_children_in_family}</div>
                <div className="mb-3"><strong>Assigned Classroom:</strong> {child.assigned_classroom}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Parent Details */}
        <div className="card shadow-sm mb-4 overflow-hidden">
          <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
            <i className="ri-parent-line text-success fs-5"></i>
            <h2 className="h5 mb-0">Parent Details</h2>
          </div>
          <div className="p-4">
            <div className="row g-3">
              <div className="col-md-6"><strong>Mother's Name:</strong> {child.mother_name}</div>
              <div className="col-md-6"><strong>Mother's Phone Number:</strong> {child.mother_cell}</div>
              <div className="col-md-6"><strong>Mother's Workplace:</strong> {child.mother_workplace}</div>
              <div className="col-md-6"><strong>Father's Name:</strong> {child.father_name}</div>
              <div className="col-md-6"><strong>Father's Phone Number:</strong> {child.father_cell}</div>
              <div className="col-md-6"><strong>Father's Workplace:</strong> {child.father_workplace}</div>
            </div>
          </div>
        </div>
        {/* Contact & Address */}
        <div className="card shadow-sm mb-4 overflow-hidden">
          <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
            <i className="ri-phone-line text-info fs-5"></i>
            <h2 className="h5 mb-0">Contact & Address</h2>
          </div>
          <div className="p-4">
            <div className="row g-3">
              <div className="col-md-6"><strong>Home Phone:</strong> {child.home_phone}</div>
              <div className="col-md-6"><strong>Email:</strong> {child.email}</div>
              <div className="col-12"><strong>Address:</strong> {child.address}</div>
            </div>
          </div>
        </div>
        {/* Emergency Contacts */}
        <div className="card shadow-sm mb-4 overflow-hidden">
          <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
            <i className="ri-alert-line text-warning fs-5"></i>
            <h2 className="h5 mb-0">Emergency Contacts</h2>
          </div>
          <div className="p-4">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Relation</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {emergency_contacts.map((contact, index) => (
                  <tr key={index}>
                    <td>{contact.name}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.relationship_to_child}</td>
                    <td>{contact.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Medical Info */}
        <div className="card shadow-sm mb-4 overflow-hidden">
          <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
            <i className="ri-hospital-line text-danger fs-5"></i>
            <h2 className="h5 mb-0">Medical Information</h2>
          </div>
          <div className="p-4">
            <div><strong>Physician Name:</strong> {medical_info?.physician_name}</div>
            <div><strong>Physician Phone:</strong> {medical_info?.physician_phone}</div>
            <div><strong>Allergies:</strong> {medical_info?.allergies ? "Yes" : "No"}</div>
            <div><strong>Vaccine Info:</strong> {medical_info?.vaccine_info}</div>
            <div><strong>Early Intervention Services:</strong> {medical_info?.early_intervention_services ? "Yes" : "No"}</div>
            <div><strong>Medical Notes:</strong> {medical_info?.medical_notes}</div>
          </div>
        </div>
        {/* Documents */}
        <div className="card shadow-sm mb-4 overflow-hidden">
          <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
            <i className="ri-file-list-3-line text-primary fs-5"></i>
            <h2 className="h5 mb-0">Documents</h2>
          </div>
      <div className="p-4">
  <ul className="list-group list-group-flush">
    {child?.medical_form_url && (
      <li className="list-group-item bg-transparent px-0 py-1">
        <i className="ri-file-pdf-line text-danger me-2"></i>
        <a
          href={child.medical_form_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Medical Form
        </a>
      </li>
    )}

    {child?.immunization_record_url && (
      <li className="list-group-item bg-transparent px-0 py-1">
        <i className="ri-file-pdf-line text-danger me-2"></i>
        <a
          href={child.immunization_record_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Immunization Record
        </a>
      </li>
    )}

    {child?.auth_affirmation_form_url && (
      <li className="list-group-item bg-transparent px-0 py-1">
        <i className="ri-file-pdf-line text-danger me-2"></i>
        <a
          href={child.auth_affirmation_form_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Auth Affirmation Form
        </a>
      </li>
    )}

    {/* Lunch Forms */}
    {safeParseArray(child?.lunch_form_url).map((url, idx) => (
      <li className="list-group-item bg-transparent px-0 py-1" key={idx}>
        <i className="ri-file-pdf-line text-danger me-2"></i>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Lunch Form {idx + 1}
        </a>
      </li>
    ))}

    {/* Agreement Docs */}
    {safeParseArray(child?.agreement_docs_url).map((url, idx) => (
      <li className="list-group-item bg-transparent px-0 py-1" key={idx}>
        <i className="ri-file-pdf-line text-danger me-2"></i>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Agreement Doc {idx + 1}
        </a>
      </li>
    ))}
  </ul>
</div>



        </div>
      </div>
    </div>
  );
};

export default ViewChild;