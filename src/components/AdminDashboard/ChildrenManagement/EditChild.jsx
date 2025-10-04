import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
const EditChild = ({ data, onSaveSuccess }) => {

  const { child, emergency_contacts, medical_info, documents } = data;

  // Main child fields
  const [photoPreview, setPhotoPreview] = useState(child?.photo_url || "");
  const [fullName, setFullName] = useState(child?.full_name || "");
  const [firstName, setFirstName] = useState(child?.first_name || "");
  const [lastName, setLastName] = useState(child?.last_name || "");
  const [englishNickname, setEnglishNickname] = useState(child?.nickname_english || "");
  const [hebrewNickname, setHebrewNickname] = useState(child?.nickname_hebrew || "");
  const [dobEnglish, setDobEnglish] = useState(child?.dob_english ? child.dob_english.slice(0, 10) : "");
  const [dobHebrew, setDobHebrew] = useState(child?.dob_hebrew ? child.dob_hebrew.slice(0, 10) : "");
  const [numberInFamily, setNumberInFamily] = useState(child?.number_of_children_in_family || "");
  const [classroom, setClassroom] = useState(child?.assigned_classroom || "");
  const [motherName, setMotherName] = useState(child?.mother_name || "");
  const [motherPhone, setMotherPhone] = useState(child?.mother_cell || "");
  const [motherWorkplace, setMotherWorkplace] = useState(child?.mother_workplace || "");
  const [fatherName, setFatherName] = useState(child?.father_name || "");
  const [fatherPhone, setFatherPhone] = useState(child?.father_cell || "");
  const [fatherWorkplace, setFatherWorkplace] = useState(child?.father_workplace || "");
  const [homePhone, setHomePhone] = useState(child?.home_phone || "");
  const [address, setAddress] = useState(child?.address || "");
  const [email, setEmail] = useState(child?.email || "");
  const [isDraft, setIsDraft] = useState(child?.is_draft === 1);

  // Emergency contacts (editable array)
  const [emergencyContacts, setEmergencyContacts] = useState(
    emergency_contacts?.length > 0
      ? emergency_contacts.map((c) => ({ ...c }))
      : [
        { name: "", phone: "", relationship_to_child: "", address: "", could_release: false },
        { name: "", phone: "", relationship_to_child: "", address: "", could_release: false },
      ]
  );

  // Medical info (editable object)
  const [medicalInfo, setMedicalInfo] = useState({
    physician_name: medical_info?.physician_name || "",
    physician_phone: medical_info?.physician_phone || "",
    allergies: medical_info?.allergies ? true : false,
    vaccine_info: medical_info?.vaccine_info || "",
    early_intervention_services: medical_info?.early_intervention_services ? true : false,
    medical_notes: medical_info?.medical_notes || "",
  });

  // Handlers for emergency contacts
  const handleEmergencyContactChange = (idx, field, value) => {
    setEmergencyContacts((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  // Handlers for medical info
  const handleMedicalInfoChange = (field, value) => {
    setMedicalInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Save handler
  const handleSave = async (completeDraft = false) => {
    try {
      const formData = new FormData();

      // Append child fields individually (bracket notation)
      formData.append("child[full_name]", fullName);
      formData.append("child[first_name]", firstName);
      formData.append("child[last_name]", lastName);
      formData.append("child[nickname_english]", englishNickname);
      formData.append("child[nickname_hebrew]", hebrewNickname);
      formData.append("child[dob_english]", dobEnglish);
      formData.append("child[dob_hebrew]", dobHebrew);
      formData.append("child[number_of_children_in_family]", numberInFamily);
      formData.append("child[assigned_classroom]", classroom);
      formData.append("child[mother_name]", motherName);
      formData.append("child[mother_cell]", motherPhone);
      formData.append("child[mother_workplace]", motherWorkplace);
      formData.append("child[father_name]", fatherName);
      formData.append("child[father_cell]", fatherPhone);
      formData.append("child[father_workplace]", fatherWorkplace);
      formData.append("child[home_phone]", homePhone);
      formData.append("child[address]", address);
      formData.append("child[email]", email);
      
      // Set draft status - if completeDraft is true, set is_draft to 0, otherwise use current state
      const newDraftStatus = completeDraft ? 0 : (isDraft ? 1 : 0);
      formData.append("child[is_draft]", newDraftStatus);

      // Append emergency contacts
      emergencyContacts.forEach((contact, idx) => {
        formData.append(`emergency_contacts[${idx}][name]`, contact.name);
        formData.append(`emergency_contacts[${idx}][phone]`, contact.phone);
        formData.append(`emergency_contacts[${idx}][relationship_to_child]`, contact.relationship_to_child);
        formData.append(`emergency_contacts[${idx}][address]`, contact.address);
        formData.append(`emergency_contacts[${idx}][could_release]`, contact.could_release);
      });

      // Append medical info fields
      formData.append("medical_info[physician_name]", medicalInfo.physician_name);
      formData.append("medical_info[physician_phone]", medicalInfo.physician_phone);
      formData.append("medical_info[allergies]", medicalInfo.allergies ? 1 : 0);
      formData.append("medical_info[vaccine_info]", medicalInfo.vaccine_info);
      formData.append("medical_info[early_intervention_services]", medicalInfo.early_intervention_services ? 1 : 0);
      formData.append("medical_info[medical_notes]", medicalInfo.medical_notes);

      // Handle file uploads if needed
      const photoInput = document.querySelector("input[type='file']");
      if (photoInput && photoInput.files[0]) {
        formData.append("photo", photoInput.files[0]);
      }

      // Debug: Log the form data being sent
      console.log("Form data being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await axios.patch(`${BASE_URL}/children/${child.child_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200 || res.data.success) {
        const message = completeDraft ? "Draft completed successfully!" : "Child updated successfully!";
        alert(message);
        if (onSaveSuccess) onSaveSuccess();
      } else {
        alert("Failed to update child.");
      }
    } catch (err) {
      alert("Error updating child.");
      console.error(err);
    }
  };
  
  const handleCompleteDraft = () => {
    handleSave(true);
  };


  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{ width: "40px", height: "40px" }}>
            <i className="ri-user-line ri-lg"></i>
          </div>
          <h1 className="h3 mb-0"> Update Details</h1>
          {isDraft && (
            <span className="badge bg-warning text-dark ms-2">Draft</span>
          )}
        </div>

        {/* Profile Card */}
        <div className="card shadow-sm mb-4 overflow-hidden">
          <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
            <i className="ri-profile-line text-primary fs-5"></i>
            <h2 className="h5 mb-0">Personal Information</h2>
          </div>
          <div className="p-4">
            <div className="row g-4 align-items-start">
              <div className="col-md-3 text-center position-relative">
                <img
                  src={photoPreview}
                  alt={fullName}
                  className="img-fluid rounded-circle mb-2"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className="btn btn-outline-primary mt-2 w-100"
                  onClick={() => alert("Upload Photo")}
                >
                  <i className="ri-upload-line me-2"></i> Update  Photo
                </button>
              </div>
              <div className="col-md-9">
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    className="form-control"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="englishNickname" className="form-label">Nickname (English)</label>
                    <input
                      type="text"
                      id="englishNickname"
                      className="form-control"
                      value={englishNickname}
                      onChange={e => setEnglishNickname(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="hebrewNickname" className="form-label">Nickname (Hebrew)</label>
                    <input
                      type="text"
                      id="hebrewNickname"
                      className="form-control"
                      value={hebrewNickname}
                      onChange={e => setHebrewNickname(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="dateOfBirthEnglish" className="form-label">
                      Date of Birth (English)
                    </label>

                    <LocalizationProvider dateAdapter={AdapterDayjs} className="col-md-6">
                      <DatePicker
                        format="YYYY-MM-DD"
                        value={dobEnglish ? dayjs(dobEnglish) : null}
                        onChange={(newValue) => {
                          setDobEnglish(newValue ? newValue.format("YYYY-MM-DD") : "");
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
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="dateOfBirthHebrew" className="form-label">Date of Birth (Hebrew)</label>
                    <input
                      type="text"
                      id="dateOfBirthHebrew"
                      className="form-control"
                      value={dobHebrew}
                      onChange={e => setDobHebrew(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="numberInFamily" className="form-label">Number in Family</label>
                  <input
                    type="text"
                    id="numberInFamily"
                    className="form-control"
                    value={numberInFamily}
                    onChange={e => setNumberInFamily(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="classroom" className="form-label">Assigned Classroom</label>
                  <input
                    type="text"
                    id="classroom"
                    className="form-control"
                    value={classroom}
                    onChange={e => setClassroom(e.target.value)}
                  />
                </div>
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
              <div className="col-md-6">
                <label htmlFor="motherName" className="form-label">Mother's Name</label>
                <input
                  type="text"
                  id="motherName"
                  className="form-control"
                  value={motherName}
                  onChange={e => setMotherName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="motherPhone" className="form-label">Mother's Phone Number</label>
                <input
                  type="tel"
                  id="motherPhone"
                  className="form-control"
                  value={motherPhone}
                  onChange={e => setMotherPhone(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="motherWorkplace" className="form-label">Mother's Workplace</label>
                <input
                  type="text"
                  id="motherWorkplace"
                  className="form-control"
                  value={motherWorkplace}
                  onChange={e => setMotherWorkplace(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="fatherName" className="form-label">Father's Name</label>
                <input
                  type="text"
                  id="fatherName"
                  className="form-control"
                  value={fatherName}
                  onChange={e => setFatherName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="fatherPhone" className="form-label">Father's Phone Number</label>
                <input
                  type="tel"
                  id="fatherPhone"
                  className="form-control"
                  value={fatherPhone}
                  onChange={e => setFatherPhone(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="fatherWorkplace" className="form-label">Father's Workplace</label>
                <input
                  type="text"
                  id="fatherWorkplace"
                  className="form-control"
                  value={fatherWorkplace}
                  onChange={e => setFatherWorkplace(e.target.value)}
                />
              </div>
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
              <div className="col-md-6">
                <label htmlFor="homePhone" className="form-label">Home Phone</label>
                <input
                  type="tel"
                  id="homePhone"
                  className="form-control"
                  value={homePhone}
                  onChange={e => setHomePhone(e.target.value)}
                />
              </div>
              {/* <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div> */}
              <div className="col-12">
                <label htmlFor="address" className="form-label">Address</label>
                <textarea
                  id="address"
                  rows="3"
                  className="form-control"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts (Editable) */}
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
                  <th>Could Release</th>
                </tr>
              </thead>
              <tbody>
                {emergencyContacts.map((contact, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={contact.name}
                        onChange={e => handleEmergencyContactChange(idx, "name", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={contact.phone}
                        onChange={e => handleEmergencyContactChange(idx, "phone", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={contact.relationship_to_child}
                        onChange={e => handleEmergencyContactChange(idx, "relationship_to_child", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={contact.address}
                        onChange={e => handleEmergencyContactChange(idx, "address", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!contact.could_release}
                        onChange={e => handleEmergencyContactChange(idx, "could_release", e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Medical Info (Editable) */}
        <div className="card shadow-sm mb-4 overflow-hidden">
          <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
            <i className="ri-hospital-line text-danger fs-5"></i>
            <h2 className="h5 mb-0">Medical Information</h2>
          </div>
          <div className="p-4">
            <div className="mb-3">
              <label className="form-label">Physician Name</label>
              <input
                type="text"
                className="form-control"
                value={medicalInfo.physician_name}
                onChange={e => handleMedicalInfoChange("physician_name", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Physician Phone</label>
              <input
                type="text"
                className="form-control"
                value={medicalInfo.physician_phone}
                onChange={e => handleMedicalInfoChange("physician_phone", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Allergies?</label>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  name="allergies"
                  value="yes"
                  checked={medicalInfo.allergies === true}
                  onChange={() => handleMedicalInfoChange("allergies", true)}
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  name="allergies"
                  value="no"
                  checked={medicalInfo.allergies === false}
                  onChange={() => handleMedicalInfoChange("allergies", false)}
                />
                <label className="form-check-label">No</label>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Vaccine Info</label>
              <input
                type="text"
                className="form-control"
                value={medicalInfo.vaccine_info}
                onChange={e => handleMedicalInfoChange("vaccine_info", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Early Intervention Services?</label>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  name="early_intervention_services"
                  value="yes"
                  checked={medicalInfo.early_intervention_services === true}
                  onChange={() => handleMedicalInfoChange("early_intervention_services", true)}
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  name="early_intervention_services"
                  value="no"
                  checked={medicalInfo.early_intervention_services === false}
                  onChange={() => handleMedicalInfoChange("early_intervention_services", false)}
                />
                <label className="form-check-label">No</label>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Medical Notes</label>
              <textarea
                className="form-control"
                value={medicalInfo.medical_notes}
                onChange={e => handleMedicalInfoChange("medical_notes", e.target.value)}
              ></textarea>
            </div>
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
              {documents?.medical_form_url && (
                <li className="list-group-item bg-transparent px-0 py-1">
                  <i className="ri-file-pdf-line text-danger me-2"></i>
                  <a href={documents.medical_form_url} target="_blank" rel="noopener noreferrer">Medical Form</a>
                </li>
              )}
              {documents?.immunization_record_url && (
                <li className="list-group-item bg-transparent px-0 py-1">
                  <i className="ri-file-pdf-line text-danger me-2"></i>
                  <a href={documents.immunization_record_url} target="_blank" rel="noopener noreferrer">Immunization Record</a>
                </li>
              )}
              {documents?.lunch_form_urls?.map((url, idx) => (
                <li className="list-group-item bg-transparent px-0 py-1" key={idx}>
                  <i className="ri-file-pdf-line text-danger me-2"></i>
                  <a href={url} target="_blank" rel="noopener noreferrer">Lunch Form {idx + 1}</a>
                </li>
              ))}
              {documents?.agreement_docs_urls?.map((url, idx) => (
                <li className="list-group-item bg-transparent px-0 py-1" key={idx}>
                  <i className="ri-file-pdf-line text-danger me-2"></i>
                  <a href={url} target="_blank" rel="noopener noreferrer">Agreement Doc {idx + 1}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          {isDraft && (
            <button
              className="btn btn-primary"
              onClick={handleCompleteDraft}
            >
              Complete Draft
            </button>
          )}
          <button
            className="btn btn-success"
            onClick={handleSave}
          >
            Update Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditChild;