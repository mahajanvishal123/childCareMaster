import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { reusableColor } from '../ReusableComponent/reusableColor';
import { BASE_URL } from '../../utils/config';

const MyNotes = () => {
  // 🚀 Get childId (or user_id) from localStorage
  // Example: localStorage.setItem("user", JSON.stringify({ childId: 19 }));
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const childId = storedUser?.childId || storedUser?.user_id || null;

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      if (!childId) {
        setNotesError("Child ID not found.");
        setNotesLoading(false);
        return;
      }

      setNotesLoading(true);
      setNotesError('');
      try {
        const res = await axios.get(`${BASE_URL}/notes/child/${childId}`);
        if (Array.isArray(res.data)) {
          setNotes(res.data);
        } else {
          setNotes([]);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
        setNotes([]);
        setNotesError('Failed to load notes.');
      } finally {
        setNotesLoading(false);
      }
    };
    fetchNotes();
  }, [childId]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-vh-100 py-4">
      <div className="">
        {/* Page Header */}
        <div className="mb-4">
          <h4 className="fw-bold text-teal">My Notes</h4>
          <p className="text-muted">View your child's daily activities and reports</p>
        </div>

        {/* Staff Notes Section */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <h4 className="card-title text-teal mb-3">
              <i className="fas fa-sticky-note me-2"></i>Staff Notes
            </h4>
            {notesLoading ? (
              <p className="text-muted">Loading...</p>
            ) : notesError ? (
              <p className="text-danger">{notesError}</p>
            ) : notes.length > 0 ? (
              notes.map((note, idx) => (
                <div key={note.id || idx} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between text-muted small mb-1">
                    <span>{note.category || 'General'}</span>
                    <span>{formatDate(note.created_at)}</span>
                  </div>
                  <p className="mb-0">{note.note}</p>
                </div>
              ))
            ) : (
              <p className="fst-italic text-muted">No staff notes available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNotes;
