import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { reusableColor } from '../ReusableComponent/reusableColor';
import { BASE_URL } from '../../utils/config';

const MedicalForm = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [formData, setFormData] = useState({
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    dob: user.dob ? user.dob.split('T')[0] : '',
    gender: user.gender || '',
    phone: user.phone || '',
    email: user.email || '',
    address: user.address || '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    consentChecked: false,
    documents: [],
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [existingFormId, setExistingFormId] = useState(null);

  // Fetch existing medical form if present
  useEffect(() => {
    const fetchMedicalForm = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/medical-forms/${user.id || user.user_id}`);
        if (res.data && res.data.success && res.data.data) {
          const data = res.data.data;
          setFormData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            dob: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
            gender: data.gender || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            medicalHistory: data.medical_history || '',
            currentMedications: data.medications || '',
            allergies: data.allergies || '',
            emergencyName: data.emergency_contact_name || '',
            emergencyRelation: data.emergency_contact_relationship || '',
            emergencyPhone: data.emergency_contact_phone || '',
            consentChecked: data.information_accurate_confirmation === 'true' || data.information_accurate_confirmation === true,
            documents: [],
          });
          setIsUpdate(true);
          setExistingFormId(data.id);
        }
      } catch (err) {
        // No existing form, keep defaults
        setIsUpdate(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicalForm();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.dob) errors.dob = 'Date of birth is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.email) errors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.emergencyName) errors.emergencyName = 'Emergency contact name is required';
    if (!formData.emergencyPhone) errors.emergencyPhone = 'Emergency contact phone is required';
    if (!formData.consentChecked) errors.consentChecked = 'You must consent to the terms';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(formErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      const payload = new FormData();
      payload.append('user_id', user?.id || user?.user_id || 9);
      payload.append('first_name', formData.firstName);
      payload.append('last_name', formData.lastName);
      payload.append('date_of_birth', formData.dob);
      payload.append('gender', formData.gender);
      payload.append('address', formData.address);
      payload.append('phone', formData.phone);
      payload.append('email', formData.email);
      payload.append('medical_history', formData.medicalHistory);
      payload.append('medications', formData.currentMedications);
      payload.append('allergies', formData.allergies);
      payload.append('emergency_contact_name', formData.emergencyName);
      payload.append('emergency_contact_relationship', formData.emergencyRelation);
      payload.append('emergency_contact_phone', formData.emergencyPhone);
      payload.append('information_accurate_confirmation', formData.consentChecked ? 'true' : 'false');

      // Append uploaded documents (multiple)
      if (formData.documents && formData.documents.length > 0) {
        formData.documents.forEach((file) => {
          payload.append('documents', file);
        });
      }

      let response;
      if (isUpdate && existingFormId) {
        // Update existing form
        response = await axios.put(`${BASE_URL}/medical-forms/${existingFormId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Create new form
        response = await axios.post(`${BASE_URL}/medical-forms`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      alert('Form submitted successfully!');
      setIsUpdate(true);
      if (response.data && response.data.data && response.data.data.id) {
        setExistingFormId(response.data.data.id);
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="container my-4 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading medical form...</p>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center" style={{ color: reusableColor.customTextColor }}>
        Medical Form
      </h2>

      <ul className="nav nav-tabs mb-4">
        {['personal', 'medical', 'medications', 'allergies', 'emergency'].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        {/* PERSONAL */}
        {activeTab === 'personal' && (
          <>
            <div className="mb-3">
              <label>First Name *</label>
              <input
                className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {formErrors.firstName && <div className="invalid-feedback">{formErrors.firstName}</div>}
            </div>
            <div className="mb-3">
              <label>Last Name *</label>
              <input
                className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
            </div>
            <div className="mb-3">
              <label>Date of Birth *</label>
              <input
                type="date"
                className={`form-control ${formErrors.dob ? 'is-invalid' : ''}`}
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
              />
              {formErrors.dob && <div className="invalid-feedback">{formErrors.dob}</div>}
            </div>
            <div className="mb-3">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="form-select">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label>Phone *</label>
              <input
                className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
            </div>
            <div className="mb-3">
              <label>Email *</label>
              <input
                type="email"
                className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
            </div>
            <div className="mb-3">
              <label>Address</label>
              <textarea className="form-control" name="address" value={formData.address} onChange={handleInputChange} />
            </div>
          </>
        )}

        {/* MEDICAL HISTORY */}
        {activeTab === 'medical' && (
          <div className="mb-3">
            <label>Medical History</label>
            <textarea className="form-control" name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} />
          </div>
        )}

        {/* MEDICATIONS */}
        {activeTab === 'medications' && (
          <div className="mb-3">
            <label>Current Medications</label>
            <textarea className="form-control" name="currentMedications" value={formData.currentMedications} onChange={handleInputChange} />
          </div>
        )}

        {/* ALLERGIES */}
        {activeTab === 'allergies' && (
          <div className="mb-3">
            <label>Allergies</label>
            <textarea className="form-control" name="allergies" value={formData.allergies} onChange={handleInputChange} />
          </div>
        )}

        {/* EMERGENCY CONTACT */}
        {activeTab === 'emergency' && (
          <>
            <div className="mb-3">
              <label>Emergency Contact Name *</label>
              <input
                className={`form-control ${formErrors.emergencyName ? 'is-invalid' : ''}`}
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleInputChange}
              />
              {formErrors.emergencyName && <div className="invalid-feedback">{formErrors.emergencyName}</div>}
            </div>
            <div className="mb-3">
              <label>Relationship</label>
              <input className="form-control" name="emergencyRelation" value={formData.emergencyRelation} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label>Emergency Contact Phone *</label>
              <input
                className={`form-control ${formErrors.emergencyPhone ? 'is-invalid' : ''}`}
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
              />
              {formErrors.emergencyPhone && <div className="invalid-feedback">{formErrors.emergencyPhone}</div>}
            </div>

            {/* File Upload */}
            <div className="mb-3">
              <label>Upload Documents (optional)</label>
              <input
                type="file"
                multiple
                className="form-control"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, documents: Array.from(e.target.files) }))
                }
              />
            </div>

            {/* Consent Checkbox */}
            <div className="form-check mb-3">
              <input
                className={`form-check-input ${formErrors.consentChecked ? 'is-invalid' : ''}`}
                type="checkbox"
                id="consentChecked"
                name="consentChecked"
                checked={formData.consentChecked}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="consentChecked">
                I confirm the above information is accurate *
              </label>
              {formErrors.consentChecked && (
                <div className="invalid-feedback d-block">{formErrors.consentChecked}</div>
              )}
            </div>
          </>
        )}

        {/* Navigation & Submit */}
        <div className="d-flex justify-content-between">
          {activeTab !== 'personal' && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                const tabs = ['personal', 'medical', 'medications', 'allergies', 'emergency'];
                const idx = tabs.indexOf(activeTab);
                setActiveTab(tabs[idx - 1]);
              }}
            >
              Previous
            </button>
          )}
          {activeTab !== 'emergency' ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const tabs = ['personal', 'medical', 'medications', 'allergies', 'emergency'];
                const idx = tabs.indexOf(activeTab);
                setActiveTab(tabs[idx + 1]);
              }}
            >
              Next
            </button>
          ) : (
            <button type="submit" className="btn btn-success">
              {isUpdate ? 'Update' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MedicalForm;
