import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (userId) {
          const response = await axios.get(`${BASE_URL}/users/${userId}`);
          setUser(response.data.data);
          setFormData(response.data.data); // Initialize form data
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle update via PATCH
const handleUpdate = async () => {
  
 

  try {
    setUpdating(true);
    const userId = localStorage.getItem("user_id");
    await axios.patch(`${BASE_URL}/users/${userId}`, formData);
    setUser(formData); // Update UI immediately
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile.");
  } finally {
    setUpdating(false);
  }
};


  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>No user found. Please log in.</p>;

  return (
    <div className="container mt-3">
      <h2>My Profile</h2>
      <div className="card p-3 shadow-sm">
        <div className="mb-2">
          <label><strong>First Name:</strong></label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label><strong>Last Name:</strong></label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>
  <div className="mb-2">
          <label><strong>Email:</strong></label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label><strong>Date of Birth:</strong></label>
          <input
            type="date"
            name="dob"
            value={formData.dob ? formData.dob.split("T")[0] : ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label><strong>SSN:</strong></label>
          <input
            type="text"
            name="ssn"
            value={formData.ssn || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label><strong>Gender:</strong></label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

       <div className="mb-2">
  <label><strong>Phone:</strong></label>
  <input
    type="text"
    name="phone"
    value={formData.phone || ""}
    onChange={handleChange}
    className="form-control"
    placeholder="(xxx) xxx-xxxx"
    pattern="\(\d{3}\) \d{3}-\d{4}"
  />
</div>


       

        <div className="mb-2">
          <label><strong>Address:</strong></label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

      

        <button
          onClick={handleUpdate}
          className="btn btn-primary mt-2"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
