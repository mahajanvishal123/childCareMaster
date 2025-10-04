import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const Autodialerivr = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showEditCampaignModal, setShowEditCampaignModal] = useState(false);
  const [showIVRFlowModal, setShowIVRFlowModal] = useState(false);
  const [ivrFlow, setIvrFlow] = useState({
    welcome: {
      message: 'Welcome to KidsCare',
      options: [
        { key: '1', label: 'Contact Admin', action: 'transfer' },
        { key: '2', label: 'Leave Message', action: 'voicemail' }
      ]
    }
  });
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    group: 'Parents'
  });
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
    targetGroup: 'all',
    scheduleDate: '',
    scheduleTime: '',
    messageType: 'text',
    message: '',
    retryCount: '3',
    retryInterval: '30'
  });

  const callStatsChartRef = useRef(null);

  const handleCampaignFormChange = (e) => {
    const { name, value } = e.target;
    setCampaignForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateCampaign = () => {
    setShowNewCampaignModal(false);
    setCampaignForm({
      name: '',
      description: '',
      targetGroup: 'all',
      scheduleDate: '',
      scheduleTime: '',
      messageType: 'text',
      message: '',
      retryCount: '3',
      retryInterval: '30'
    });
  };

  useEffect(() => {
    if (callStatsChartRef.current) {
      const chart = echarts.init(callStatsChartRef.current);
      const option = {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Completed', 'No Answer', 'Failed']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Completed',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: [32, 45, 29, 38, 42, 18, 25],
            color: '#2ab7a9'
          },
          {
            name: 'No Answer',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: [12, 18, 15, 20, 16, 8, 10],
            color: '#F59E0B'
          },
          {
            name: 'Failed',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: [5, 8, 6, 4, 7, 3, 2],
            color: '#EF4444'
          }
        ]
      };
      chart.setOption(option);

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Main Content */}
      <div className="container-fluid p-4">
        <div className="row align-items-center justify-content-between mb-4">
          {/* Left: Title and Subtitle */}
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <h1 className="fs-4 fw-bold text-dark">Auto Dialer & IVR</h1>
            <p className="text-muted mt-1 mb-0">
              Manage your automated calling system and interactive voice response
            </p>
          </div>

          {/* Right: Buttons */}
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
            <button
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={() => setShowUploadModal(true)}
            >
              <i className="fas fa-upload me-2"></i>
              Upload Contacts
            </button>

            <button
              className="btn text-white d-flex align-items-center"
              style={{ backgroundColor: '#2ab7a9' }}
              onClick={() => setShowNewCampaignModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              New Campaign
            </button>
          </div>
        </div>


        <div className="row mb-4">
          {/* Quick Stats */}
          <div className="col-md-4 mb-3">
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Active Campaigns</h3>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ab7a9' }}>3</span>
              </div>
              <div className="d-flex align-items-center" style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <i className="fas fa-arrow-up me-2" style={{ color: '#2ab7a9' }}></i>
                <span>12% increase from last week</span>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Total Contacts</h3>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ab7a9' }}>1,234</span>
              </div>
              <div className="d-flex align-items-center" style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <i className="fas fa-user-plus me-2" style={{ color: '#3b82f6' }}></i>
                <span>89 new contacts this month</span>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Call Success Rate</h3>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ab7a9' }}>85%</span>
              </div>
              <div className="d-flex align-items-center" style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <i className="fas fa-check-circle me-2" style={{ color: '#2ab7a9' }}></i>
                <span>Based on last 500 calls</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          {/* Call Statistics Chart */}
          <div className="col-12">
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Weekly Call Statistics</h2>
              <div ref={callStatsChartRef} style={{ height: '300px' }}></div>
            </div>
          </div>

          {/* IVR Flow Setup */}
          {/* <div className="col-lg-4 mb-3">
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>IVR Flow</h2>
                <button
                  onClick={() => setShowIVRFlowModal(true)}
                  style={{
                    color: '#2ab7a9',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none'
                  }}
                >
                  <i className="fas fa-edit me-1"></i> Edit Flow
                </button>
              </div>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                <div className="d-flex flex-column align-items-center">
                  <div style={{ width: '10rem', backgroundColor: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}>
                    <i className="fas fa-phone-volume mb-2"></i>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Welcome Message</div>
                  </div>
                  <i className="fas fa-arrow-down mb-3" style={{ color: '#9ca3af' }}></i>
                  <div className="row g-2 w-100">
                    <div className="col-6">
                      <div style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Press 1</div>
                        <div style={{ fontSize: '0.75rem' }}>Contact Admin</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Press 2</div>
                        <div style={{ fontSize: '0.75rem' }}>Leave Message</div>
                      </div>
                    </div>
                  </div>
                  <i className="fas fa-arrow-down my-3" style={{ color: '#9ca3af' }}></i>
                  <div style={{ width: '10rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                    <i className="fas fa-check-circle mb-2"></i>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>End Call</div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Recent Campaigns */}
        <div className="mb-4" style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Recent Campaigns</h2>
            <button style={{ color: '#2ab7a9', fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', background: 'none' }}>
              View All <i className="fas fa-chevron-right ms-1"></i>
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Campaign Name</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Target Group</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Calls</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Success Rate</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Created</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Parent Meeting Reminder', status: 'Active', group: 'Parents', calls: 150, success: 75, date: 'June 20, 2025' },
                  { name: 'Emergency Drill Notice', status: 'Completed', group: 'All Contacts', calls: 200, success: 92, date: 'June 18, 2025' },
                  { name: 'Fee Payment Reminder', status: 'Scheduled', group: 'Parents', calls: 0, success: 0, date: 'June 22, 2025' },
                  { name: 'Staff Training Notification', status: 'Active', group: 'Staff', calls: 45, success: 82, date: 'June 19, 2025' },
                  { name: 'Holiday Announcement', status: 'Draft', group: 'All Contacts', calls: 0, success: 0, date: 'June 15, 2025' }
                ].map((campaign, index) => (
                  <tr key={index} style={{ cursor: 'pointer' }}>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: '500', color: '#111827' }}>{campaign.name}</div>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: campaign.status === 'Active' ? '#d1fae5' :
                          campaign.status === 'Completed' ? '#dbeafe' :
                            campaign.status === 'Scheduled' ? '#fef3c7' : '#f3f4f6',
                        color: campaign.status === 'Active' ? '#065f46' :
                          campaign.status === 'Completed' ? '#1e40af' :
                            campaign.status === 'Scheduled' ? '#92400e' : '#374151'
                      }}>
                        {campaign.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                      {campaign.group}
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                      {campaign.calls}
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <div className="d-flex align-items-center">
                        <div style={{ width: '6rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem', marginRight: '0.5rem' }}>
                          <div
                            style={{
                              height: '0.5rem',
                              borderRadius: '9999px',
                              backgroundColor: campaign.status === 'Completed' ? '#3b82f6' : '#2ab7a9',
                              width: `${campaign.success}%`
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{campaign.success}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                      {campaign.date}
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedCampaign({
                              name: campaign.name,
                              description: 'Campaign description here',
                              targetGroup: campaign.group.toLowerCase(),
                              scheduleDate: '2025-06-21',
                              scheduleTime: '09:00',
                              messageType: 'text',
                              message: 'Default campaign message',
                              retryCount: '3',
                              retryInterval: '30'
                            });
                            setShowEditCampaignModal(true);
                          }}
                          style={{ color: '#3b82f6', cursor: 'pointer', border: 'none', background: 'none' }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button style={{ color: '#2ab7a9', cursor: 'pointer', border: 'none', background: 'none' }}>
                          <i className="fas fa-play"></i>
                        </button>
                        <button style={{ color: '#ef4444', cursor: 'pointer', border: 'none', background: 'none' }}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Management */}
        <div className="mb-4 bg-white rounded shadow-sm p-4">
          {/* Header Row */}
          <div className="row align-items-center justify-content-between mb-4">
            <div className="col-12 col-md-auto mb-3 mb-md-0">
              <h2 className="fs-5 fw-semibold text-dark mb-0">Contact Management</h2>
            </div>
            <div className="col-12 col-md d-flex justify-content-md-end gap-2 flex-wrap">
              <button className="btn btn-outline-secondary d-flex align-items-center">
                <i className="fas fa-filter me-2"></i> Filter
              </button>
              <button className="btn btn-outline-secondary d-flex align-items-center">
                <i className="fas fa-upload me-2"></i> Import CSV
              </button>
              <button
                onClick={() => setShowAddContactModal(true)}
                className="btn text-white d-flex align-items-center"
                style={{ backgroundColor: '#2ab7a9' }}
              >
                <i className="fas fa-plus me-2"></i> Add Contact
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="bg-light">
                <tr className="text-uppercase text-secondary small fw-semibold">
                  <th>
                    <input type="checkbox" className="form-check-input" />
                  </th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Group</th>
                  <th>Last Called</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item}>
                    <td>
                      <input type="checkbox" className="form-check-input" />
                    </td>
                    <td>
                      <div className="fw-medium text-dark">Parent {item}</div>
                      <div className="small text-muted">parent{item}@example.com</div>
                    </td>
                    <td className="text-muted small">+1 (555) 123-456{item}</td>
                    <td className="text-muted small">{item % 2 === 0 ? 'Parents' : 'Staff'}</td>
                    <td className="text-muted small">{item % 3 === 0 ? 'Never' : 'June 19, 2025'}</td>
                    <td>
                      <span
                        className="badge rounded-pill fw-semibold"
                        style={{
                          backgroundColor:
                            item % 3 === 0 ? '#d1fae5' :
                              item % 3 === 1 ? '#fef3c7' : '#f3f4f6',
                          color:
                            item % 3 === 0 ? '#065f46' :
                              item % 3 === 1 ? '#92400e' : '#374151'
                        }}
                      >
                        {item % 3 === 0 ? 'Active' : item % 3 === 1 ? 'Pending' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm text-primary border-0 bg-transparent">
                          <i className="fas fa-phone"></i>
                        </button>
                        <button
                          className="btn btn-sm text-info border-0 bg-transparent"
                          onClick={() => {
                            setSelectedContact({
                              name: `Parent ${item}`,
                              email: `parent${item}@example.com`,
                              phone: `+1 (555) 123-456${item}`,
                              group: item % 2 === 0 ? 'Parents' : 'Staff',
                            });
                            setShowEditContactModal(true);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm text-danger border-0 bg-transparent">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-2">
            <div className="text-muted small">Showing 1 to 5 of 24 results</div>
            <div className="btn-group  custom-btn-pagination">
              <button className="btn btn-sm">Previous</button>
              <button className="btn btn-sm active-page">1</button>
              <button className="btn btn-sm">2</button>
              <button className="btn btn-sm">3</button>
              <button className="btn btn-sm">Next</button>
            </div>
          </div>

        </div>


        {/* Call Logs */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Recent Call Logs</h2>
            <button style={{ color: '#2ab7a9', fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', background: 'none' }}>
              View All Logs <i className="fas fa-chevron-right ms-1"></i>
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Contact</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Campaign</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Duration</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Time</th>
                  <th scope="col" style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} style={{ cursor: 'pointer' }}>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: '500', color: '#111827' }}>John Smith</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>+1 (555) 123-4567</div>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                      Parent Meeting Reminder
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: item % 3 === 0 ? '#d1fae5' :
                          item % 3 === 1 ? '#fee2e2' : '#fef3c7',
                        color: item % 3 === 0 ? '#065f46' :
                          item % 3 === 1 ? '#b91c1c' : '#92400e'
                      }}>
                        {item % 3 === 0 ? 'Completed' : item % 3 === 1 ? 'Failed' : 'No Answer'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                      {item % 3 === 0 ? '1:23' : item % 3 === 1 ? '0:45' : '-'}
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                      {item === 1 ? '10 minutes ago' : item === 2 ? '1 hour ago' : item === 3 ? '3 hours ago' : item === 4 ? 'Yesterday' : '2 days ago'}
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                      <div className="d-flex gap-2">
                        <button style={{ color: '#3b82f6', cursor: 'pointer', border: 'none', background: 'none' }}>
                          <i className="fas fa-info-circle"></i>
                        </button>
                        {item % 3 === 0 && (
                          <button style={{ color: '#2ab7a9', cursor: 'pointer', border: 'none', background: 'none' }}>
                            <i className="fas fa-play-circle"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '56rem'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>Create New Campaign</h3>
              <button
                onClick={() => setShowNewCampaignModal(false)}
                style={{ color: '#9ca3af', cursor: 'pointer', border: 'none', background: 'none' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="space-y-4">
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="campaign-name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Campaign Name</label>
                  <input
                    id="campaign-name"
                    type="text"
                    name="name"
                    value={campaignForm.name}
                    onChange={handleCampaignFormChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                    placeholder="Enter campaign name"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="campaign-description" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Description</label>
                  <textarea
                    id="campaign-description"
                    name="description"
                    value={campaignForm.description}
                    onChange={handleCampaignFormChange}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                    placeholder="Enter campaign description"
                  ></textarea>
                </div>
                <div className="col-12">
                  <label htmlFor="target-group" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Target Group</label>
                  <select
                    id="target-group"
                    name="targetGroup"
                    value={campaignForm.targetGroup}
                    onChange={handleCampaignFormChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  >
                    <option value="all">All Contacts</option>
                    <option value="parents">Parents</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
             <div className="col-md-6">
  <label
    htmlFor="schedule-date"
    style={{
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.25rem'
    }}
  >
    Schedule Date
  </label>

  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      format="DD-MM-YYYY"
      value={campaignForm.scheduleDate ? dayjs(campaignForm.scheduleDate) : null}
      onChange={(newValue) => {
        handleCampaignFormChange({
          target: {
            name: 'scheduleDate',
            value: newValue ? newValue.format('YYYY-MM-DD') : ''
          }
        });
      }}
      slotProps={{
        textField: {
          id: 'schedule-date',
          fullWidth: true,
          variant: 'outlined',
          InputProps: {
            style: {
              width: '100%',
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              outline: 'none',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
              transition: 'box-shadow 0.15s ease-in-out',
              height: '42px',
              fontSize: '0.875rem'
            }
          },
          inputProps: {
            placeholder: 'dd-mm-yyyy'
          }
        }
      }}
    />
  </LocalizationProvider>
</div>
                <div className="col-md-6">
                  <label htmlFor="schedule-time" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Schedule Time</label>
                  <input
                    id="schedule-time"
                    type="time"
                    name="scheduleTime"
                    value={campaignForm.scheduleTime}
                    onChange={handleCampaignFormChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  />
                </div>
                <div className="col-12">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Message Type</label>
                  <div className="d-flex gap-4">
                    <label className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="messageType"
                        value="text"
                        checked={campaignForm.messageType === 'text'}
                        onChange={handleCampaignFormChange}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Text to Speech
                    </label>
                    <label className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="messageType"
                        value="recording"
                        checked={campaignForm.messageType === 'recording'}
                        onChange={handleCampaignFormChange}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Voice Recording
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="message" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Message</label>
                  {campaignForm.messageType === 'text' ? (
                    <textarea
                      id="message"
                      name="message"
                      value={campaignForm.message}
                      onChange={handleCampaignFormChange}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                        transition: 'box-shadow 0.15s ease-in-out'
                      }}
                      placeholder="Enter message for text-to-speech"
                    ></textarea>
                  ) : (
                    <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center' }}>
                      <i className="fas fa-microphone" style={{ color: '#9ca3af', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to record or upload audio file</p>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="retry-count" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Retry Count</label>
                  <input
                    id="retry-count"
                    type="number"
                    name="retryCount"
                    value={campaignForm.retryCount}
                    onChange={handleCampaignFormChange}
                    min="0"
                    max="5"
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="retry-interval" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Retry Interval (minutes)</label>
                  <input
                    id="retry-interval"
                    type="number"
                    name="retryInterval"
                    value={campaignForm.retryInterval}
                    onChange={handleCampaignFormChange}
                    min="15"
                    max="120"
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCampaign}
                  style={{
                    backgroundColor: '#2ab7a9',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Campaign Modal */}
      {showEditCampaignModal && selectedCampaign && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '56rem'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>Edit Campaign</h3>
              <button
                onClick={() => setShowEditCampaignModal(false)}
                style={{ color: '#9ca3af', cursor: 'pointer', border: 'none', background: 'none' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="space-y-4">
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="edit-campaign-name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Campaign Name</label>
                  <input
                    id="edit-campaign-name"
                    type="text"
                    value={selectedCampaign.name}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="edit-campaign-description" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Description</label>
                  <textarea
                    id="edit-campaign-description"
                    value={selectedCampaign.description}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, description: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  ></textarea>
                </div>
                <div className="col-12">
                  <label htmlFor="edit-target-group" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Target Group</label>
                  <select
                    id="edit-target-group"
                    value={selectedCampaign.targetGroup}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, targetGroup: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  >
                    <option value="all">All Contacts</option>
                    <option value="parents">Parents</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="edit-schedule-date" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Schedule Date</label>
                  <input
                    id="edit-schedule-date"
                    type="date"
                    value={selectedCampaign.scheduleDate}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, scheduleDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="edit-schedule-time" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Schedule Time</label>
                  <input
                    id="edit-schedule-time"
                    type="time"
                    value={selectedCampaign.scheduleTime}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, scheduleTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  />
                </div>
                <div className="col-12">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Message Type</label>
                  <div className="d-flex gap-4">
                    <label className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="edit-messageType"
                        value="text"
                        checked={selectedCampaign.messageType === 'text'}
                        onChange={(e) => setSelectedCampaign({ ...selectedCampaign, messageType: e.target.value })}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Text to Speech
                    </label>
                    <label className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="edit-messageType"
                        value="recording"
                        checked={selectedCampaign.messageType === 'recording'}
                        onChange={(e) => setSelectedCampaign({ ...selectedCampaign, messageType: e.target.value })}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Voice Recording
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="edit-message" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Message</label>
                  {selectedCampaign.messageType === 'text' ? (
                    <textarea
                      id="edit-message"
                      value={selectedCampaign.message}
                      onChange={(e) => setSelectedCampaign({ ...selectedCampaign, message: e.target.value })}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                        transition: 'box-shadow 0.15s ease-in-out'
                      }}
                    ></textarea>
                  ) : (
                    <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center' }}>
                      <i className="fas fa-microphone" style={{ color: '#9ca3af', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to record or upload audio file</p>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="edit-retry-count" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Retry Count</label>
                  <input
                    id="edit-retry-count"
                    type="number"
                    value={selectedCampaign.retryCount}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, retryCount: e.target.value })}
                    min="0"
                    max="5"
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="edit-retry-interval" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Retry Interval (minutes)</label>
                  <input
                    id="edit-retry-interval"
                    type="number"
                    value={selectedCampaign.retryInterval}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, retryInterval: e.target.value })}
                    min="15"
                    max="120"
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditCampaignModal(false);
                    setSelectedCampaign(null);
                  }}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditCampaignModal(false);
                    setSelectedCampaign(null);
                  }}
                  style={{
                    backgroundColor: '#2ab7a9',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '32rem'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Add New Contact</h3>
              <button
                onClick={() => {
                  setShowAddContactModal(false);
                  setNewContact({
                    name: '',
                    email: '',
                    phone: '',
                    group: 'Parents'
                  });
                }}
                style={{ color: '#9ca3af', cursor: 'pointer', border: 'none', background: 'none' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="space-y-3">
              <div>
                <label htmlFor="add-contact-name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Name</label>
                <input
                  id="add-contact-name"
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                    transition: 'box-shadow 0.15s ease-in-out'
                  }}
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <label htmlFor="add-contact-email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Email</label>
                <input
                  id="add-contact-email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                    transition: 'box-shadow 0.15s ease-in-out'
                  }}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label htmlFor="add-contact-phone" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Phone Number</label>
                <input
                  id="add-contact-phone"
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                    transition: 'box-shadow 0.15s ease-in-out'
                  }}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label htmlFor="add-contact-group" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Group</label>
                <select
                  id="add-contact-group"
                  value={newContact.group}
                  onChange={(e) => setNewContact({ ...newContact, group: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                    transition: 'box-shadow 0.15s ease-in-out'
                  }}
                >
                  <option value="Parents">Parents</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
            </form>
            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowAddContactModal(false);
                  setNewContact({
                    name: '',
                    email: '',
                    phone: '',
                    group: 'Parents'
                  });
                }}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddContactModal(false);
                  setNewContact({
                    name: '',
                    email: '',
                    phone: '',
                    group: 'Parents'
                  });
                }}
                style={{
                  backgroundColor: '#2ab7a9',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showEditContactModal && selectedContact && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '32rem'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Edit Contact</h3>
              <button
                onClick={() => {
                  setShowEditContactModal(false);
                  setSelectedContact(null);
                }}
                style={{ color: '#9ca3af', cursor: 'pointer', border: 'none', background: 'none' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="space-y-3">
              <div>
                <label htmlFor="edit-contact-name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Name</label>
                <input
                  id="edit-contact-name"
                  type="text"
                  value={selectedContact.name}
                  onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                    transition: 'box-shadow 0.15s ease-in-out'
                  }}
                />
              </div>
              <div>
                <label htmlFor="edit-contact-email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Email</label>
                <input
                  id="edit-contact-email"
                  type="email"
                  value={selectedContact.email}
                  onChange={(e) => setSelectedContact({ ...selectedContact, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                    transition: 'box-shadow 0.15s ease-in-out'
                  }}
                />
              </div>
              <div>
                <label htmlFor="edit-contact-phone" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Phone Number</label>
                <input
                  id="edit-contact-phone"
                  type="tel"
                  value={selectedContact.phone}
                  onChange={(e) => setSelectedContact({ ...selectedContact, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                    transition: 'box-shadow 0.15s ease-in-out'
                  }}
                />
              </div>
              <div>
                <label htmlFor="edit-contact-group" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Group</label>
                <select
                  id="edit-contact-group"
                  value={selectedContact.group}
                  onChange={(e) => setSelectedContact({ ...selectedContact, group: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                    transition: 'box-shadow 0.15s ease-in-out'
                  }}
                >
                  <option value="Parents">Parents</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
            </form>
            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowEditContactModal(false);
                  setSelectedContact(null);
                }}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEditContactModal(false);
                  setSelectedContact(null);
                }}
                style={{
                  backgroundColor: '#2ab7a9',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IVR Flow Editor Modal */}
      {showIVRFlowModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '56rem',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>Edit IVR Flow</h3>
              <button
                onClick={() => setShowIVRFlowModal(false)}
                style={{ color: '#9ca3af', cursor: 'pointer', border: 'none', background: 'none' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div className="mb-4">
                <h4 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.75rem' }}>Welcome Message</h4>
                <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Greeting Message
                  </label>
                  <textarea
                    value={ivrFlow.welcome.message}
                    onChange={(e) => setIvrFlow({
                      ...ivrFlow,
                      welcome: { ...ivrFlow.welcome, message: e.target.value }
                    })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      transition: 'box-shadow 0.15s ease-in-out'
                    }}
                    rows={3}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1f2937' }}>Menu Options</h4>
                  <button
                    onClick={() => {
                      const newOptions = [...ivrFlow.welcome.options];
                      newOptions.push({
                        key: `${newOptions.length + 1}`,
                        label: 'New Option',
                        action: 'transfer'
                      });
                      setIvrFlow({
                        ...ivrFlow,
                        welcome: { ...ivrFlow.welcome, options: newOptions }
                      });
                    }}
                    style={{
                      backgroundColor: '#2ab7a9',
                      color: 'white',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    <i className="fas fa-plus me-1"></i> Add Option
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ivrFlow.welcome.options.map((option, index) => (
                    <div key={option.key} style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <div style={{
                            backgroundColor: '#2ab7a9',
                            color: 'white',
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '0.75rem'
                          }}>
                            {option.key}
                          </div>
                          <input
                            value={option.label}
                            onChange={(e) => {
                              const newOptions = [...ivrFlow.welcome.options];
                              newOptions[index].label = e.target.value;
                              setIvrFlow({
                                ...ivrFlow,
                                welcome: { ...ivrFlow.welcome, options: newOptions }
                              });
                            }}
                            style={{
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.5rem',
                              outline: 'none',
                              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                              transition: 'box-shadow 0.15s ease-in-out'
                            }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newOptions = ivrFlow.welcome.options.filter((_, i) => i !== index);
                            setIvrFlow({
                              ...ivrFlow,
                              welcome: { ...ivrFlow.welcome, options: newOptions }
                            });
                          }}
                          style={{ color: '#ef4444', cursor: 'pointer', border: 'none', background: 'none' }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          Action
                        </label>
                        <select
                          value={option.action}
                          onChange={(e) => {
                            const newOptions = [...ivrFlow.welcome.options];
                            newOptions[index].action = e.target.value;
                            setIvrFlow({
                              ...ivrFlow,
                              welcome: { ...ivrFlow.welcome, options: newOptions }
                            });
                          }}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            outline: 'none',
                            boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                            transition: 'box-shadow 0.15s ease-in-out'
                          }}
                        >
                          <option value="transfer">Transfer to Staff</option>
                          <option value="voicemail">Leave Voicemail</option>
                          <option value="playback">Play Message</option>
                          <option value="submenu">Sub-menu</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setShowIVRFlowModal(false)}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowIVRFlowModal(false);
                }}
                style={{
                  backgroundColor: '#2ab7a9',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 3,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '32rem'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Upload Contact CSV</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ color: '#9ca3af', cursor: 'pointer', border: 'none', background: 'none' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-3">
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Upload a CSV file with your contacts. The file should include name, phone number, and email at minimum.
              </p>
              <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center' }}>
                {selectedFile ? (
                  <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                    <i className="fas fa-file-csv" style={{ color: '#2ab7a9', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                    <p style={{ fontWeight: '500' }}>{selectedFile.name}</p>
                    <p style={{ color: '#6b7280' }}>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div>
                    <i className="fas fa-cloud-upload-alt" style={{ color: '#9ca3af', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Drag and drop your file here or</p>
                    <label style={{
                      marginTop: '0.5rem',
                      display: 'inline-block',
                      backgroundColor: '#2ab7a9',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }}>
                      Browse Files
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                style={{
                  backgroundColor: '#2ab7a9',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none',
                  opacity: !selectedFile ? 0.5 : 1
                }}
                disabled={!selectedFile}
              >
                Upload Contacts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Autodialerivr;