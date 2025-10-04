// import React, { useState } from 'react';
// import axiosInstance from '../../utils/axiosInstance';
// import { FaArrowLeft } from 'react-icons/fa';
// import { reusableColor } from '../ReusableComponent/reusableColor';
// import { BASE_URL } from '../../utils/config';

// const LunchForm = () => {
//   const [formData, setFormData] = useState({
//     meal_preference: '',
//     portionSize: '',
//     dietaryRestrictions: {
//       glutenFree: false,
//       dairyFree: false,
//       nutFree: false,
//       sugarFree: false,
//       lowSodium: false,
//     },
//     allergies: '',
//     additionalNotes: '',
//   });
//   const [formStatus, setFormStatus] = useState('Not Submitted');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name in formData) {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         dietaryRestrictions: {
//           ...prev.dietaryRestrictions,
//           [name]: checked,
//         },
//       }));
//     }
//   };

//   // Convert dietary restrictions object to array format expected by API
//   const getDietaryRestrictionsArray = () => {
//     const restrictions = [];
//     Object.entries(formData.dietaryRestrictions).forEach(([key, value]) => {
//       if (value) {
//         // Convert camelCase to Title Case with spaces
//         const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
//         restrictions.push(formattedKey);
//       }
//     });
//     return restrictions;
//   };

//   // Get user ID from localStorage or use a default value
//   const getUserId = () => {
//     // You might want to get this from your auth context or redux store
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     return user.id || 30; // Default to 30 as shown in your example
//   };

//   const handleSubmit = async () => {
//     // Validate required fields
//     if (!formData.meal_preference) {
//       setError('Please select a meal preference');
//       return;
//     }
//     if (!formData.portionSize) {
//       setError('Please select a portion size');
//       return;
//     }

//     setIsLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const payload = {
//         user_id: getUserId(),
//         meal_preference: formData.meal_preference,
//         portion_size: formData.portionSize,
//         dietary_restrictions: getDietaryRestrictionsArray(),
//         allergies: formData.allergies,
//         notes: formData.additionalNotes,
//         status: 'Submitted'
//       };

//       const response = await axiosInstance.post(`${BASE_URL}/lunch-form`, payload);

//       if (response.status === 200 || response.status === 201) {
//         setFormStatus('Submitted');
//         // Show success message from API response
//         const successMessage = response.data?.message || 'Lunch form submitted successfully!';
//         setSuccess(successMessage);
//         // Optionally reset form or redirect
//         setTimeout(() => {
//           setSuccess('');
//         }, 3000);
//       }
//     } catch (err) {
//       console.error('Error submitting lunch form:', err);
//       setError(err.response?.data?.message || 'Failed to submit lunch form. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSaveDraft = async () => {
//     setIsLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const payload = {
//         user_id: getUserId(),
//         meal_preference: formData.meal_preference,
//         portion_size: formData.portionSize,
//         dietary_restrictions: getDietaryRestrictionsArray(),
//         allergies: formData.allergies,
//         notes: formData.additionalNotes,
//         status: 'Draft'
//       };

//       const response = await axiosInstance.post(`${BASE_URL}/lunch-form`, payload);

//       if (response.status === 200 || response.status === 201) {
//         // Show success message from API response
//         const successMessage = response.data?.message || 'Draft saved successfully!';
//         setSuccess(successMessage);
//         setTimeout(() => {
//           setSuccess('');
//         }, 3000);
//       }
//     } catch (err) {
//       console.error('Error saving draft:', err);
//       setError(err.response?.data?.message || 'Failed to save draft. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-teal-300 min-vh-100 py-5">
//       <div className="container py-4" style={{ maxWidth: 1200 }}>
//         <div className="card shadow-lg rounded-lg overflow-hidden">
//           <div className="card-body p-4">
//             {/* Header */}
//             <div className="d-flex align-items-center mb-4">
//               <a href="/children/myform" className="text-secondary me-auto d-flex align-items-center">
//                 <FaArrowLeft />
//                 <span className="ms-2">Back to Forms</span>
//               </a>
//               <h3 className="flex-fill text-center me-5 fw-bold" style={{ color: reusableColor.customTextColor }}>Lunch Form</h3>
//             </div>

//             <div className='mb-3'>
//               <span className={`badge ${formStatus === 'Submitted' ? 'bg-success' : 'bg-warning'}`}>
//                 {formStatus}
//               </span>
//               <small className="text-muted ms-2">Last modified: June 20, 2025</small>
//             </div>

//             {/* Error and Success Messages */}
//             {error && (
//               <div className="alert alert-danger alert-dismissible fade show" role="alert">
//                 {error}
//                 <button type="button" className="btn-close" onClick={() => setError('')}></button>
//               </div>
//             )}
//             {success && (
//               <div className="alert alert-success alert-dismissible fade show" role="alert">
//                 {success}
//                 <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
//               </div>
//             )}

//             {/* Form */}
//             <form onSubmit={(e) => e.preventDefault()}>
//               {/* Meal Preferences */}
//               <div className="mb-4">
//                 <h6 className="fw-semibold">Meal Preferences <span className="text-danger">*</span></h6>
//                 <div className="form-check">
//                   <input
//                     id="Regular" name="meal_preference" type="radio" className="form-check-input"
//                     checked={formData.meal_preference === 'Regular'}
//                     onChange={() => setFormData(prev => ({ ...prev, meal_preference: 'Regular' }))}
//                   />
//                   <label htmlFor="Regular" className="form-check-label">Regular</label>
//                 </div>
//                 <div className="form-check">
//                   <input
//                     id="Vegetarian" name="meal_preference" type="radio" className="form-check-input"
//                     checked={formData.meal_preference === 'Vegetarian'}
//                     onChange={() => setFormData(prev => ({ ...prev, meal_preference: 'Vegetarian' }))}
//                   />
//                   <label htmlFor="Vegetarian" className="form-check-label">Vegetarian</label>
//                 </div>
//                 <div className="form-check">
//                   <input
//                     id="Vegan" name="meal_preference" type="radio" className="form-check-input"
//                     checked={formData.meal_preference === 'Vegan'}
//                     onChange={() => setFormData(prev => ({ ...prev, meal_preference: 'Vegan' }))}
//                   />
//                   <label htmlFor="Vegan" className="form-check-label">Vegan</label>
//                 </div>
//               </div>

//               {/* Portion Size */}
//               <div className="mb-4">
//                 <h6 className="fw-semibold">Portion Size <span className="text-danger">*</span></h6>
//                 <select
//                   name="portionSize"
//                   className="form-select"
//                   value={formData.portionSize}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select portion size</option>
//                   <option value="Small">Small</option>
//                   <option value="Medium">Medium</option>
//                   <option value="Large">Large</option>
//                 </select>
//               </div>

//               {/* Dietary Restrictions */}
//               <div className="mb-4">
//                 <h6 className="fw-semibold">Dietary Restrictions</h6>
//                 <div className="row">
//                   {Object.entries(formData.dietaryRestrictions).map(([key, val]) => (
//                     <div className="col-6" key={key}>
//                       <div className="form-check">
//                         <input
//                           id={key} name={key} type="checkbox" className="form-check-input"
//                           checked={val} onChange={handleChange}
//                         />
//                         <label htmlFor={key} className="form-check-label">
//                           {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
//                         </label>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Allergies */}
//               <div className="mb-4">
//                 <h6 className="fw-semibold">Allergies</h6>
//                 <input
//                   type="text"
//                   name="allergies"
//                   className="form-control"
//                   value={formData.allergies}
//                   onChange={handleChange}
//                   placeholder="e.g., Peanuts, Shellfish, etc."
//                 />
//               </div>

//               {/* Additional Notes */}
//               <div className="mb-4">
//                 <h6 className="fw-semibold">Additional Notes</h6>
//                 <textarea
//                   name="additionalNotes"
//                   className="form-control"
//                   value={formData.additionalNotes}
//                   onChange={handleChange}
//                   rows={4}
//                   placeholder="Any additional information we should know..."
//                 />
//               </div>

//               {/* Buttons */}
//               <div className="d-flex justify-content-end gap-3 mb-2">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary"
//                   onClick={handleSaveDraft}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Saving...' : 'Save Draft'}
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-success"
//                   onClick={handleSubmit}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Submitting...' : 'Submit Form'}
//                 </button>
//               </div>

//               <div className="text-center text-muted small">
//                 <span className="text-danger">*</span> Indicates required fields
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LunchForm;

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { FaArrowLeft } from 'react-icons/fa';
import { reusableColor } from '../ReusableComponent/reusableColor';
import { BASE_URL } from '../../utils/config';

const LunchForm = () => {
  const [lunchFormId, setLunchFormId] = useState(null);
  const [formData, setFormData] = useState({
    meal_preference: '',
    portionSize: '',
    dietaryRestrictions: {
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      sugarFree: false,
      lowSodium: false,
    },
    allergies: '',
    additionalNotes: '',
  });
  const [formStatus, setFormStatus] = useState('Not Submitted');
  const [lastModified, setLastModified] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helpers
  const toCamelCase = (s) =>
    s
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');

  const dietaryRestrictionsFromArray = (arr) => {
    const base = {
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      sugarFree: false,
      lowSodium: false,
    };
    arr.forEach((item) => {
      // Convert "Gluten Free" -> "glutenFree", "Low Sodium" -> "lowSodium"
      const camel = toCamelCase(item);
      if (camel in base) {
        // @ts-ignore
        base[camel] = true;
      }
    });
    return base;
  };

  const getDietaryRestrictionsArray = () => {
    const restrictions = [];
    Object.entries(formData.dietaryRestrictions).forEach(([key, value]) => {
      if (value) {
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (s) => s.toUpperCase());
        restrictions.push(formattedKey);
      }
    });
    return restrictions;
  };

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 30;
  };

  const formatLastModified = (iso) => {
    try {
      const dt = new Date(iso);
      return dt.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  // Fetch existing form(s) on mount
  useEffect(() => {
    const controller = new AbortController();
    const fetchExisting = async () => {
      setIsInitialLoading(true);
      setError('');
      const userId = getUserId();
      try {
        const resp = await axiosInstance.get(
          `${BASE_URL}/lunch-form?user_id=${userId}`,
          { signal: controller.signal }
        );
        if (resp.status === 200 && Array.isArray(resp.data?.data)) {
          const forms = resp.data.data;
          if (forms.length > 0) {
            // Pick most recent by last_modified
            forms.sort((a, b) => {
              return new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime();
            });
            const latest = forms[0];
            setFormData({
              meal_preference: latest.meal_preference || '',
              portionSize: latest.portion_size || '',
              dietaryRestrictions: dietaryRestrictionsFromArray(
                latest.dietary_restrictions || []
              ),
              allergies: latest.allergies || '',
              additionalNotes: latest.notes || '',
            });
            setFormStatus(latest.status || 'Not Submitted');
            setLastModified(latest.last_modified);
            setLunchFormId(latest.id);
          }
        } else {
          // If unexpected shape, silently ignore (keep blank)
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err?.response) {
          setError(
            err.response?.data?.message ||
            'Failed to load existing lunch form. Showing empty form.'
          );
        } else if (err.name !== 'CanceledError') {
          setError('Failed to load existing lunch form. Showing empty form.');
        }
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchExisting();
    return () => {
      controller.abort();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in formData && name !== 'dietaryRestrictions') {
      if (name === 'portionSize') {
        setFormData((prev) => ({ ...prev, portionSize: value }));
      } else if (name === 'allergies' || name === 'additionalNotes') {
        setFormData((prev) => ({ ...prev, [name]: value }));
      } else if (name === 'meal_preference') {
        setFormData((prev) => ({ ...prev, meal_preference: value }));
      }
    } else {
      // dietary restriction checkbox
      setFormData((prev) => ({
        ...prev,
        dietaryRestrictions: {
          ...prev.dietaryRestrictions,
          [name]: checked,
        },
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.meal_preference) {
      setError('Please select a meal preference');
      return;
    }
    if (!formData.portionSize) {
      setError('Please select a portion size');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      user_id: getUserId(),
      meal_preference: formData.meal_preference,
      portion_size: formData.portionSize,
      dietary_restrictions: getDietaryRestrictionsArray(),
      allergies: formData.allergies,
      notes: formData.additionalNotes,
      status: 'Submitted',
    };

    try {
      const url = lunchFormId
        ? `${BASE_URL}/lunch-form/${lunchFormId}`  // PATCH for update
        : `${BASE_URL}/lunch-form`;               // POST for new

      const response = lunchFormId
        ? await axiosInstance.patch(url, payload)
        : await axiosInstance.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        setFormStatus('Submitted');
        const successMessage = response.data?.message || 'Lunch form submitted successfully!';
        setSuccess(successMessage);
        setLastModified(new Date().toISOString());
        if (!lunchFormId && response.data?.data?.id) {
          setLunchFormId(response.data.data.id);
        }
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error submitting lunch form:', err);
      setError(err.response?.data?.message || 'Failed to submit lunch form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSaveDraft = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      user_id: getUserId(),
      meal_preference: formData.meal_preference,
      portion_size: formData.portionSize,
      dietary_restrictions: getDietaryRestrictionsArray(),
      allergies: formData.allergies,
      notes: formData.additionalNotes,
      status: 'Draft',
    };

    try {
      const url = lunchFormId
        ? `${BASE_URL}/lunch-form/${lunchFormId}`  // PATCH for update
        : `${BASE_URL}/lunch-form`;               // POST for new

      const response = lunchFormId
        ? await axiosInstance.patch(url, payload)
        : await axiosInstance.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        const successMessage = response.data?.message || 'Draft saved successfully!';
        setSuccess(successMessage);
        if (!lunchFormId && response.data?.data?.id) {
          setLunchFormId(response.data.data.id);
        }
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err.response?.data?.message || 'Failed to save draft. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-teal-300 min-vh-100 py-5">
      <div className="container py-4" style={{ maxWidth: 1200 }}>
        <div className="card shadow-lg rounded-lg overflow-hidden">
          <div className="card-body p-4">
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
              <a
                href="/children/myform"
                className="text-secondary me-auto d-flex align-items-center"
              >
                <FaArrowLeft />
                <span className="ms-2">Back to Forms</span>
              </a>
              <h3
                className="flex-fill text-center me-5 fw-bold"
                style={{ color: reusableColor.customTextColor }}
              >
                Lunch Form
              </h3>
            </div>

            <div className="mb-3">
              <span
                className={`badge ${formStatus === 'Submitted' ? 'bg-success' : 'bg-warning'
                  }`}
              >
                {formStatus}
              </span>
              <small className="text-muted ms-2">
                Last modified:{' '}
                {lastModified ? formatLastModified(lastModified) : '—'}
              </small>
              {isInitialLoading && (
                <small className="text-muted ms-3">Loading existing data...</small>
              )}
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError('')}
                ></button>
              </div>
            )}
            {success && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                {success}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccess('')}
                ></button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Meal Preferences */}
              <div className="mb-4">
                <h6 className="fw-semibold">
                  Meal Preferences <span className="text-danger">*</span>
                </h6>
                <div className="form-check">
                  <input
                    id="Regular"
                    name="meal_preference"
                    type="radio"
                    className="form-check-input"
                    value="Regular"
                    checked={formData.meal_preference === 'Regular'}
                    onChange={handleChange}
                  />
                  <label htmlFor="Regular" className="form-check-label">
                    Regular
                  </label>
                </div>
                <div className="form-check">
                  <input
                    id="Vegetarian"
                    name="meal_preference"
                    type="radio"
                    className="form-check-input"
                    value="Vegetarian"
                    checked={formData.meal_preference === 'Vegetarian'}
                    onChange={handleChange}
                  />
                  <label htmlFor="Vegetarian" className="form-check-label">
                    Vegetarian
                  </label>
                </div>
                <div className="form-check">
                  <input
                    id="Vegan"
                    name="meal_preference"
                    type="radio"
                    className="form-check-input"
                    value="Vegan"
                    checked={formData.meal_preference === 'Vegan'}
                    onChange={handleChange}
                  />
                  <label htmlFor="Vegan" className="form-check-label">
                    Vegan
                  </label>
                </div>
              </div>

              {/* Portion Size */}
              <div className="mb-4">
                <h6 className="fw-semibold">
                  Portion Size <span className="text-danger">*</span>
                </h6>
                <select
                  name="portionSize"
                  className="form-select"
                  value={formData.portionSize}
                  onChange={handleChange}
                >
                  <option value="">Select portion size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              {/* Dietary Restrictions */}
              <div className="mb-4">
                <h6 className="fw-semibold">Dietary Restrictions</h6>
                <div className="row">
                  {Object.entries(formData.dietaryRestrictions).map(
                    ([key, val]) => (
                      <div className="col-6" key={key}>
                        <div className="form-check">
                          <input
                            id={key}
                            name={key}
                            type="checkbox"
                            className="form-check-input"
                            checked={val}
                            onChange={handleChange}
                          />
                          <label htmlFor={key} className="form-check-label">
                            {key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, (s) => s.toUpperCase())}
                          </label>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div className="mb-4">
                <h6 className="fw-semibold">Allergies</h6>
                <input
                  type="text"
                  name="allergies"
                  className="form-control"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="e.g., Peanuts, Shellfish, etc."
                />
              </div>

              {/* Additional Notes */}
              <div className="mb-4">
                <h6 className="fw-semibold">Additional Notes</h6>
                <textarea
                  name="additionalNotes"
                  className="form-control"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any additional information we should know..."
                />
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-3 mb-2">
                {/* <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Draft'}
                </button> */}
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Form'}
                </button>
              </div>

              <div className="text-center text-muted small">
                <span className="text-danger">*</span> Indicates required fields
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LunchForm;
