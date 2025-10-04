import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { reusableColor } from '../ReusableComponent/reusableColor';
import axiosInstance from '../../utils/axiosInstance';
import { BASE_URL } from '../../utils/config';

const SpecialNeedForm = () => {

  const user = localStorage.getItem('user_id') || '30';
  const [formData, setFormData] = useState({
    user_id: user,
    special_needs_type: '',
    accommodation_details: '',
    dietary_restrictions: '',
    medication_required: false,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    documents: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.special_needs_type) {
      setError('Please select a special needs type');
      return;
    }
    if (!formData.accommodation_details) {
      setError('Please provide accommodation details');
      return;
    }
    if (!formData.emergency_contact_name) {
      setError('Please provide emergency contact name');
      return;
    }
    if (!formData.emergency_contact_phone) {
      setError('Please provide emergency contact phone');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('special_needs_type', formData.special_needs_type);
      formDataToSend.append('accommodation_details', formData.accommodation_details);
      formDataToSend.append('dietary_restrictions', formData.dietary_restrictions);
      formDataToSend.append('medication_required', formData.medication_required.toString());
      formDataToSend.append('emergency_contact_name', formData.emergency_contact_name);
      formDataToSend.append('emergency_contact_phone', formData.emergency_contact_phone);
      
      // Add files
      formData.documents.forEach((file, index) => {
        formDataToSend.append('documents', file);
      });

      const response = await axiosInstance.post(`${BASE_URL}/specialneeds`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.status === 200 || response.status === 201) {
        // Show success message from API response
        const successMessage = response.data?.message || 'Special needs form submitted successfully!';
        setSuccess(successMessage);
        
        // Reset form after successful submission
        setTimeout(() => {
          setSuccess('');
          setFormData({
            user_id: user,
            special_needs_type: '',
            accommodation_details: '',
            dietary_restrictions: '',
            medication_required: false,
            emergency_contact_name: '',
            emergency_contact_phone: '',
            documents: []
          });
        }, 3000);
      }
    } catch (err) {
      console.error('Error submitting special needs form:', err);
      setError(err.response?.data?.message || 'Failed to submit special needs form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <style>{`
        .form-section {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .upload-area {
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          padding: 30px 20px;
          text-align: center;
          background-color: #f8f9fa;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .upload-area:hover {
          border-color: ${reusableColor.customTextColor};
          background-color: #e8f5f4;
        }
        .upload-icon {
          font-size: 32px;
          color: #6c757d;
          margin-bottom: 10px;
        }
        .form-label {
          font-weight: 500;
          color: #495057;
        }
        .form-control:focus, .form-select:focus {
          border-color: ${reusableColor.customTextColor};
          box-shadow: 0 0 0 0.2rem rgba(78, 205, 196, 0.25);
        }
        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background-color: #f8f9fa;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .remove-file {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 18px;
        }
      `}</style>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">

          {/* Heading inside same container */}
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: reusableColor.customTextColor }}>Special Needs Form</h2>
            <small className="text-muted">Last modified: June 20, 2025</small>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Special Needs */}
            <div className="form-section">
              <h5 className="mb-3">Special Needs Details</h5>
              <div className="mb-3">
                <label className="form-label">Type of Special Needs <span className="text-danger">*</span></label>
                <select className="form-select" name="special_needs_type" value={formData.special_needs_type} onChange={handleInputChange}>
                  <option value="">Select type</option>
                  <option value="Physical">Physical</option>
                  <option value="Visual">Visual</option>
                  <option value="Hearing">Hearing</option>
                  <option value="Cognitive">Cognitive</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Accommodation Details <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows={3}
                  name="accommodation_details"
                  value={formData.accommodation_details}
                  onChange={handleInputChange}
                  placeholder="Describe any accommodations needed"
                ></textarea>
              </div>
            </div>

            {/* Dietary */}
            <div className="form-section">
              <h5 className="mb-3">Dietary Restrictions</h5>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows={3}
                  name="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={handleInputChange}
                  placeholder="e.g., Gluten-free, Nut allergies"
                ></textarea>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="medication_required" checked={formData.medication_required} onChange={handleInputChange} />
                <label className="form-check-label">
                  Medication required during event
                </label>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="form-section">
              <h5 className="mb-3">Emergency Contact</h5>
              <div className="row">
                <div className="col-12 col-sm-6 mb-3">
                  <label className="form-label">Contact Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleInputChange} />
                </div>
                <div className="col-12 col-sm-6 mb-3">
                  <label className="form-label">Contact Phone <span className="text-danger">*</span></label>
                  <input type="tel" className="form-control" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            {/* Upload Documents */}
            <div className="form-section">
              <h5 className="mb-3">Supporting Documents</h5>
              <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                <div className="upload-icon">📁</div>
                <div><strong>Click or drag files here</strong></div>
                <small className="text-muted d-block mt-2">.pdf, .jpg, .png, .docx (max 10MB)</small>
              </div>
              <input
                type="file"
                id="fileInput"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              {formData.documents.length > 0 && (
                <div className="mt-3">
                  <h6>Selected Files:</h6>
                  {formData.documents.map((file, idx) => (
                    <div key={idx} className="file-item">
                      <span>📄 {file.name}</span>
                      <button 
                        type="button" 
                        className="remove-file" 
                        onClick={() => removeFile(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="text-center">
              <button 
                type="submit" 
                className="btn btn-lg w-100 mt-2" 
                style={{ backgroundColor: reusableColor.customTextColor, color: '#fff' }}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>

            <div className="text-center text-muted small mt-3">
              <span className="text-danger">*</span> Indicates required fields
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SpecialNeedForm;
