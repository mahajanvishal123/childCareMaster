import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Pagination,
  Modal,
} from 'react-bootstrap';
import {
  FaEdit,
  FaTrash,
  FaFileAlt,
  FaFireAlt,
  FaDownload,
  FaCog,
  FaUserCircle,
  FaRunning,
  FaChevronDown,
  FaUser,
} from 'react-icons/fa';
import { MdOutlineNightlight } from 'react-icons/md';
import { MdOutlineCheckroom } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { reusableColor } from '../reusableColor';
import FireDrills from './FireDril';
import Evacuation from './Evacuation';
import EpipenTracker from './EpipenTracker';
import SleepLogs from './SleepLogs';
import DiaperLogs from './DiaperLogs';
import Maintenance from './Maintenance';
import AddRecordModal from './AddRecordModal';
import DocumentVault from '../DocumentVault/DocumentsVault';
import axios from "axios";
import { BASE_URL } from "../../../utils/config";

const LocationManagement = () => {
  const themeColor = `${reusableColor.customTextColor}`;
  const [activeTab, setActiveTab] = useState('Fire Drills');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [fireDrillForm, setFireDrillForm] = useState({
    date: "",
    conductedby: "",
    remarks: "",
  });
  const [fireDrillFile, setFireDrillFile] = useState(null);

  // Dynamic data states
  const [fireDrills, setFireDrills] = useState([]);
  const [evacuations, setEvacuations] = useState([]);
  const [epipens, setEpipens] = useState([]);
  const [sleepLogs, setSleepLogs] = useState([]);
  const [diaperLogs, setDiaperLogs] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [documentVault, setDocumentVault] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    'Fire Drills',
    'Evacuation',
    'Epipen Tracker',
    'Sleep Logs',
    'Diaper Logs',
    'Maintenance',
    // 'Documents',

  ];

  const getPriorityBadge = (priority) => {
    if (priority === 'High')
      return <span className="badge bg-danger">High</span>;
    if (priority === 'Medium')
      return <span className="badge bg-warning">Medium</span>;
    return <span className="badge bg-success">Low</span>;
  };

  const getStatusBadge = (status) => {
    if (status === 'Open')
      return <span className="badge bg-success">Open</span>;
    return <span className="badge bg-secondary">Closed</span>;
  };

  // Fetch functions
  const fetchFireDrills = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/safety/fire-drills`);
      setFireDrills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvacuations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/safety/evacuations`);
      setEvacuations(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEpipens = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/safety/epipens`);
      setEpipens(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSleepLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/safety/sleep-logs`);
      setSleepLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiaperLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/safety/diaper-logs`);
      setDiaperLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/safety/maintenance-logs`);
      setMaintenanceLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch doccument vault in case if we have too use it 
  const fetchDocumentVault = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/document-vault`);
      setDocumentVault(res.data.data);
    } catch (err) {
      console.error(err);
    }finally{
      setLoading(false);
    }
  }
  // Fetch data on tab change
  useEffect(() => {
    if (activeTab === 'Fire Drills') fetchFireDrills();
    else if (activeTab === 'Evacuation') fetchEvacuations();
    else if (activeTab === 'Epipen Tracker') fetchEpipens();
    else if (activeTab === 'Sleep Logs') fetchSleepLogs();
    else if (activeTab === 'Diaper Logs') fetchDiaperLogs();
    else if (activeTab === 'Maintenance') fetchMaintenanceLogs();
  }, [activeTab]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleFireDrillInput = (e) => {
    const { name, value } = e.target;
    setFireDrillForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleFireDrillFile = (e) => {
    setFireDrillFile(e.target.files[0]);
  };

  const handleFireDrillSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("date", fireDrillForm.date);
    formData.append("conductedby", fireDrillForm.conductedby);
    formData.append("remarks", fireDrillForm.remarks);
    if (fireDrillFile) formData.append("document", fireDrillFile);

    try {
      const res = await axios.post(`${BASE_URL}/safety/fire-drills`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201 || (res.data && res.data.message && res.data.message.toLowerCase().includes("success"))) {
        alert("Fire drill added successfully!");
        setShowModal(false);
        // Optionally refresh the fire drill list here
      } else {
        alert("Failed to add fire drill.");
      }
    } catch (err) {
      alert("Error adding fire drill.");
      console.error(err);
    }
  };

  const handleAddRecordSubmit = async (activeTab, formData, file) => {
    console.log("formData", formData);
    let url = "";
    let data;
    let config = {};

    if (activeTab === "Fire Drills") {
      url = `${BASE_URL}/safety/fire-drills`;
      data = new FormData();
      data.append("date", formData.date);
      data.append("conductedby", formData.conductedBy);
      data.append("remarks", formData.remarks);
      if (file) data.append("document", file);
      config.headers = { "Content-Type": "multipart/form-data" };
    } else if (activeTab === "Evacuation") {
      url = `${BASE_URL}/safety/evacuations`;
      data = new FormData();
      data.append("date", formData.date);
      data.append("conducted_by", formData.conductedBy);
      data.append("remarks", formData.remarks);
      if (file) data.append("document", file);
      config.headers = { "Content-Type": "multipart/form-data" };
    }
    
  else if (activeTab === "Epipen Tracker") {
  url = `${BASE_URL}/safety/epipens`;
  data = new FormData();

  // type = patient | non-patient
  data.append("type", formData.epipen_type);

  if (formData.epipen_type === "patient") {
    data.append("child_id", formData.child_id);
    data.append("epipen_unique_id", formData.epipenID);
    data.append("expiry_date", formData.expiryDate);
    data.append("location_details", formData.location || "");
    data.append("notes", formData.notes || "");
    data.append("status", formData.status || "active");
  } else if (formData.epipen_type === "non_patient") {
    data.append("room_id", formData.classroom_id);
    data.append("staff_id", formData.staff_incharge);
    data.append("epipen_unique_id", formData.epipenID);
    data.append("expiry_date", formData.expiryDate);
    data.append("certificate_expiry_date", formData.certificate_expiry || "");
    data.append("notes", formData.notes || "");
    data.append("status", formData.status || "active");

    if (file) data.append("file", file); // ✅ Attach file
  }

  config.headers = { "Content-Type": "multipart/form-data" };




    } else if (activeTab === "Sleep Logs") {
      url = `${BASE_URL}/safety/sleep-logs`;
      data = JSON.stringify({
        child_id: formData.child_id,
        classroom_id: formData.classroom_id,
        nap_start: formData.nap_start,
        nap_end: formData.nap_end,
        notes: formData.notes
      });
      config.headers = { "Content-Type": "application/json" };
    } else if (activeTab === "Diaper Logs") {
      url = `${BASE_URL}/safety/diaper-logs`;
      data = JSON.stringify({
        child_id: formData.child_id,
        classroom_id: formData.classroom_id,
        time: formData.time,
        changed_by: formData.changed_by,
        type: formData.type,
        notes: formData.notes
      });
      config.headers = { "Content-Type": "application/json" };
    } else if (activeTab === "Maintenance") {
      url = `${BASE_URL}/safety/maintenance-logs`; // <-- Make sure this matches your backend route
      data = JSON.stringify({
        request_title: formData.title,
        location: formData.location,
        date_reported: formData.dateReported,
        priority: formData.priority,
        status: formData.status,
        assigned_to: formData.changed_by,
      });
      config.headers = { "Content-Type": "application/json" };
    } else {
      // ...handle other tabs if needed
      return;
    }

    try {
      const res = await axios.post(url, data, config);
      if (res.status === 201 || (res.data && res.data.message && res.data.message.toLowerCase().includes("success"))) {
        alert(`${activeTab} record added successfully!`);
        setShowModal(false);
        if (activeTab === 'Fire Drills') fetchFireDrills();
        else if (activeTab === 'Evacuation') fetchEvacuations();
        else if (activeTab === 'Epipen Tracker') fetchEpipens();
        else if (activeTab === 'Sleep Logs') fetchSleepLogs();
        else if (activeTab === 'Diaper Logs') fetchDiaperLogs();
        else if (activeTab === 'Maintenance') fetchMaintenanceLogs();
        else if (activeTab === 'Documents') fetchDocumentVault(); // Fetch document vault if needed
        // Optionally refresh the list for the active tab here
      } else {
        alert(`Failed to add ${activeTab} record.`);
      }
    } catch (err) {
      alert(`Error adding ${activeTab} record.`);
      console.error(err);
    }
  };

  // Delete handlers for each tab
  const handleDelete = async (tab, id) => {
    let url = '';
    if (tab === 'Fire Drills') url = `${BASE_URL}/safety/fire-drills/${id}`;
    else if (tab === 'Evacuation') url = `${BASE_URL}/safety/evacuations/${id}`;
    else if (tab === 'Epipen Tracker') url = `${BASE_URL}/safety/epipens/${id}`;
    else if (tab === 'Sleep Logs') url = `${BASE_URL}/safety/sleep-logs/${id}`;
    else if (tab === 'Diaper Logs') url = `${BASE_URL}/safety/diaper-logs/${id}`;
    else if (tab === 'Maintenance') url = `${BASE_URL}/safety/maintenance-logs/${id}`;
    else return;
    try {
      await axios.delete(url);
      // Refresh the list for the active tab
      if (tab === 'Fire Drills') fetchFireDrills();
      else if (tab === 'Evacuation') fetchEvacuations();
      else if (tab === 'Epipen Tracker') fetchEpipens();
      else if (tab === 'Sleep Logs') fetchSleepLogs();
      else if (tab === 'Diaper Logs') fetchDiaperLogs();
      else if (tab === 'Maintenance') fetchMaintenanceLogs();
      else if (tab === 'Documents') fetchDocumentVault(); // Fetch document vault if needed
    } catch (err) {
      alert(`Failed to delete ${tab} record.`);
    }
  };

  return (
    <Container fluid className="p-2 p-md-4 bg-light min-vh-100">
      <Row className="mb-3 mb-md-4 align-items-center justify-content-between flex-column flex-md-row">
        <Col xs="auto">
          <h4 className={`fw-bold mb-2 mb-md-0`} style={{ color: themeColor }}>
            Location Management
          </h4>
        </Col>
        <Col xs="auto" className="d-flex align-items-center gap-3">
          {/* <FaDownload className="fs-5 text-muted" />
          <FaCog className="fs-5 text-muted" />
          <FaUser Circle className="fs-5 text-muted" /> */}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <div className="d-flex gap-3 gap-md-4 border-bottom pb-2 flex-wrap">
            {tabs.map((tab) => (
              <span
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`fw-semibold pb-1 cursor-pointer ${activeTab === tab ? 'border-bottom' : 'text-muted'}`}
                style={{ color: activeTab === tab ? themeColor : 'inherit', cursor: 'pointer' }}
              >
                {tab === 'Fire Drills' && <FaFireAlt className="me-1" />}
                {tab === 'Evacuation' && <FaRunning className="me-1" />}
                {tab}
                

              </span>
            ))}
          </div>
        </Col>
      </Row>

      {/* Tab Content - pass dynamic data and delete handler */}
      {activeTab === 'Fire Drills' && (
        <FireDrills themeColor={themeColor} handleShow={handleShow} records={fireDrills} loading={loading} onDelete={(id) => handleDelete('Fire Drills', id)} />
      )}
      {activeTab === 'Evacuation' && (
        <Evacuation records={evacuations} themeColor={themeColor} handleShow={handleShow} loading={loading} onDelete={(id) => handleDelete('Evacuation', id)} />
      )}
      {activeTab === 'Epipen Tracker' && (
        <EpipenTracker records={epipens} themeColor={themeColor} handleShow={handleShow} loading={loading} onDelete={(id) => handleDelete('Epipen Tracker', id)} />
      )}
      {activeTab === 'Sleep Logs' && (
        <SleepLogs records={sleepLogs} themeColor={themeColor} handleShow={handleShow} loading={loading} onDelete={(id) => handleDelete('Sleep Logs', id)} />
      )}
      {activeTab === 'Diaper Logs' && (
        <DiaperLogs records={diaperLogs} themeColor={themeColor} handleShow={handleShow} loading={loading} onDelete={(id) => handleDelete('Diaper Logs', id)} />
      )}
      {activeTab === 'Maintenance' && (
        <Maintenance records={maintenanceLogs} themeColor={themeColor} handleShow={handleShow} getPriorityBadge={getPriorityBadge} getStatusBadge={getStatusBadge} loading={loading} onDelete={(id) => handleDelete('Maintenance', id)} />
      )}
      {activeTab === 'Documents' && (
        <DocumentVault records={documentVault} themeColor={themeColor} handleShow={handleShow} loading={loading} onDelete={(id) => handleDelete('Documents', id)} />
      )}
     

      <AddRecordModal
        show={showModal}
        handleClose={handleClose}
        activeTab={activeTab}
        formData={formData}
        setFormData={setFormData}
        themeColor={themeColor}
        onSubmit={handleAddRecordSubmit}
      />
    </Container>
  );
};

export default LocationManagement;

// ===== reusable===
