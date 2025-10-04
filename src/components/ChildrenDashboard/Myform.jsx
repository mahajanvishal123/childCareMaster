import React, { useState } from 'react';
import LunchForm from './LunchForm';
import MedicalForm from './MedicalForm';
import SpecialNeedForm from './SpecialNeedForm';
import { reusableColor } from '../ReusableComponent/reusableColor';

const Myform = () => {
  const [activeForm, setActiveForm] = useState(null);

  const forms = [
    { title: 'Lunch Form', icon: 'fa-utensils', component: <LunchForm /> },
    { title: 'Medical Form', icon: 'fa-notes-medical', component: <MedicalForm /> },
    { title: 'Special Needs Form', icon: 'fa-clipboard-list', component: <SpecialNeedForm /> },
  ];

  return (
    <div className="d-flex flex-column justify-content-center align-items-center px-3 mt-2">
      <div className="w-100"> {/* ✅ Full width now */}
        <div className="bg-white   p-4 p-md-5">
          <header className="mb-4 text-center">
            <h3 className="display-5 fw-bold" style={{ color: reusableColor.customTextColor }}>My Forms</h3>
          </header>
          <h2 className="h4 fw-semibold text-dark mb-4"></h2>
          <ul className="list-unstyled">
            {forms.map((form, index) => (
              <li key={index} className="mb-3">
                <button
                  onClick={() => setActiveForm(form.component)}
                  className="btn btn-light w-100 text-start d-flex align-items-center gap-3 rounded-3 border shadow-sm"
                >
                  <i className={`fas ${form.icon} fs-5`} style={{ width: '2rem', color: reusableColor.customTextColor }}></i>
                  <span className="fw-medium text-dark">{form.title}</span>
                  <i className="fas fa-chevron-right ms-auto text-muted"></i>
                </button>
              </li>
            ))}
          </ul>

          {/* Render selected form */}
          {activeForm && (
            <div className="mt-4">
              {activeForm}
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-muted small">Click on a document to view its details</p>
          </div>
        </div>

        <footer className="mt-4 text-center text-white small opacity-75">
          <p>Last updated: June 20, 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default Myform;
