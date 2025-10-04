import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const Transaction = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [dateRange, setDateRange] = useState({
    start: '2025-06-01',
    end: '2025-06-23'
  });
  const [transactionType, setTransactionType] = useState('All');
  const [linkedTo, setLinkedTo] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const tableRef = useRef();

  const handleExportPDF = () => {
    const element = tableRef.current;
    const opt = {
      margin: 0.5,
      filename: 'transactions.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const handleExportExcel = () => {
    const table = tableRef.current;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table);

    // Fix date column (assuming first column is date)
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 }); // 0 = first column (Date)
      const cell = ws[cellAddress];
      if (cell && typeof cell.v === 'string') {
        // Parse and convert to date object
        const parsedDate = new Date(cell.v);
        if (!isNaN(parsedDate)) {
          cell.v = parsedDate;
          cell.t = 'd'; // Set cell type to date
          cell.z = XLSX.SSF._table[14]; // Apply default date format (e.g. "mm/dd/yyyy")
        }
      }
    }

    // Optional: Set column widths to avoid "#######"
    ws['!cols'] = [
      { wch: 15 }, // Date
      { wch: 10 }, // Type
      { wch: 20 }, // Category
      { wch: 15 }, // Amount
      { wch: 25 }, // Linked To
      { wch: 10 }, // Class
      { wch: 30 }, // Notes
      { wch: 15 }, // Mode
      { wch: 15 }, // Added By
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'transactions.xlsx');
  };


  const transactions = [
    {
      id: 1,
      date: '2025-06-23',
      type: 'Income',
      category: 'Tuition Fee',
      amount: 1500.00,
      linkedTo: { name: 'Emma Watson', role: 'Child', class: 'Nursery', avatar: 'https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20little%20girl%20with%20brown%20hair%20and%20blue%20eyes%2C%20minimalist%2C%20clean%20background%2C%20soft%20colors%2C%20professional%20childcare%20app%20style&width=40&height=40&seq=1&orientation=squarish' },
      notes: 'Monthly tuition payment',
      mode: 'Bank Transfer',
      addedBy: 'Admin'
    },
    {
      id: 2,
      date: '2025-06-20',
      type: 'Expense',
      category: 'Teacher Salary',
      amount: 2200.00,
      linkedTo: { name: 'John Smith', role: 'Teacher', class: '', avatar: 'https://readdy.ai/api/search-image?query=professional%20cartoon%20avatar%20of%20a%20male%20teacher%20with%20glasses%2C%20minimalist%2C%20clean%20background%2C%20soft%20colors%2C%20professional%20childcare%20app%20style&width=40&height=40&seq=2&orientation=squarish' },
      notes: 'Monthly salary payment',
      mode: 'Bank Transfer',
      addedBy: 'Accountant'
    },
    {
      id: 3,
      date: '2025-06-18',
      type: 'Income',
      category: 'Registration Fee',
      amount: 500.00,
      linkedTo: { name: 'Oliver Brown', role: 'Child', class: '1st', avatar: 'https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20little%20boy%20with%20blonde%20hair%2C%20minimalist%2C%20clean%20background%2C%20soft%20colors%2C%20professional%20childcare%20app%20style&width=40&height=40&seq=3&orientation=squarish' },
      notes: 'New enrollment',
      mode: 'UPI',
      addedBy: 'Admin'
    },
    {
      id: 4,
      date: '2025-06-15',
      type: 'Expense',
      category: 'Supplies',
      amount: 350.75,
      linkedTo: { name: '-', role: 'General', class: '', avatar: '' },
      notes: 'Art supplies and stationery',
      mode: 'Cash',
      addedBy: 'Admin'
    },
    {
      id: 5,
      date: '2025-06-12',
      type: 'Income',
      category: 'Late Fee',
      amount: 75.00,
      linkedTo: { name: 'Sophia Garcia', role: 'Child', class: '5th', avatar: 'https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20little%20girl%20with%20dark%20hair%2C%20minimalist%2C%20clean%20background%2C%20soft%20colors%2C%20professional%20childcare%20app%20style&width=40&height=40&seq=4&orientation=squarish' },
      notes: 'Late payment penalty',
      mode: 'UPI',
      addedBy: 'Admin'
    },
    {
      id: 6,
      date: '2025-06-10',
      type: 'Expense',
      category: 'Utilities',
      amount: 420.50,
      linkedTo: { name: '-', role: 'General', class: '', avatar: '' },
      notes: 'Electricity and water bill',
      mode: 'Bank Transfer',
      addedBy: 'Accountant'
    },
    {
      id: 7,
      date: '2025-06-08',
      type: 'Income',
      category: 'Tuition Fee',
      amount: 1500.00,
      linkedTo: { name: 'Ethan Lee', role: 'Child', class: '12th', avatar: 'https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20little%20boy%20with%20black%20hair%2C%20minimalist%2C%20clean%20background%2C%20soft%20colors%2C%20professional%20childcare%20app%20style&width=40&height=40&seq=5&orientation=squarish' },
      notes: 'Monthly tuition payment',
      mode: 'Bank Transfer',
      addedBy: 'Admin'
    },
    {
      id: 8,
      date: '2025-06-05',
      type: 'Expense',
      category: 'Maintenance',
      amount: 850.00,
      linkedTo: { name: '-', role: 'General', class: '', avatar: '' },
      notes: 'Playground equipment repair',
      mode: 'Bank Transfer',
      addedBy: 'Admin'
    }
  ];

  const classes = [
    'All', 'Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th',
    '6th', '7th', '8th', '9th', '10th', '11th', '12th'
  ];

  const filteredTransactions = transactions.filter(transaction => {
    // Filter by tab
    if (activeTab !== 'All' && transaction.linkedTo.role !== activeTab) {
      return false;
    }

    // Filter by class (only if Children tab is active and a class is selected)
    if (activeTab === 'Child' && selectedClass !== 'All' && transaction.linkedTo.class !== selectedClass) {
      return false;
    }

    // Filter by transaction type
    if (transactionType !== 'All' && transaction.type !== transactionType) {
      return false;
    }

    // Filter by linked to
    if (linkedTo !== 'All' && transaction.linkedTo.role !== linkedTo) {
      return false;
    }

    // Filter by search query
    if (searchQuery && !transaction.linkedTo.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by date range
    const transactionDate = new Date(transaction.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    if (transactionDate < startDate || transactionDate > endDate) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h1 className="h2 text-dark mb-4">View Transactions</h1>
        {/* tabs */}
            <div className="d-flex flex-wrap gap-2 border-bottom pb-2 mb-4">
  <button
    onClick={() => { setActiveTab('All'); setSelectedClass('All'); }}
    className="btn btn-sm"
    style={activeTab === 'All'
      ? { backgroundColor: '#2ab7a9', color: 'white', borderRadius: '5px' }
      : {}}
  >
    All Transactions
  </button>

  <button
    onClick={() => { setActiveTab('Child'); setLinkedTo('Child'); }}
    className="btn btn-sm"
    style={activeTab === 'Child'
      ? { backgroundColor: '#2ab7a9', color: 'white', borderRadius: '5px' }
      : {}}
  >
    <i className="fas fa-child me-1"></i> Children
  </button>

  <button
    onClick={() => { setActiveTab('Teacher'); setLinkedTo('Teacher'); setSelectedClass('All'); }}
    className="btn btn-sm"
    style={activeTab === 'Teacher'
      ? { backgroundColor: '#2ab7a9', color: 'white', borderRadius: '5px' }
      : {}}
  >
    <i className="fas fa-chalkboard-Staff me-1"></i> Staff
  </button>


</div>

            {/* Filter Section */}
            <div className="bg-light rounded p-3 mb-4">
              <div className="row g-3">
                {/* Date Range Picker */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Date Range</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Transaction Type */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Transaction Type</label>
                  <select
                    className="form-select form-select-sm"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>

                {/* Class or Linked To */}
                {activeTab === 'Child' ? (
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Class</label>
                    <select
                      className="form-select form-select-sm"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      {classes.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Linked To</label>
                    <select
                      className="form-select form-select-sm"
                      value={linkedTo}
                      onChange={(e) => setLinkedTo(e.target.value)}
                      disabled={activeTab !== 'All'}
                    >
                      <option value="All">All</option>
                      <option value="Child">Children</option>
                      <option value="Staff">Staff</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                )}

                {/* Search */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Search</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white">
                      <i className="fas fa-search text-secondary"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button onClick={handleExportPDF} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                  <i className="fas fa-file-pdf text-danger"></i>
                  <span>Export PDF</span>
                </button>
                <button onClick={handleExportExcel} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                  <i className="fas fa-file-excel text-success"></i>
                  <span>Export Excel</span>
                </button>
              </div>

            </div>


            {/* Transactions Table */}
            <div className="table-responsive" ref={tableRef}>
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-nowrap">Date</th>
                    <th scope="col" className="text-nowrap">Type</th>
                    <th scope="col" className="text-nowrap">Category</th>
                    <th scope="col" className="text-nowrap">Amount</th>
                    <th scope="col" className="text-nowrap">Linked To</th>
                    {activeTab === 'Child' && (
                      <th scope="col" className="text-nowrap">Class</th>
                    )}
                    <th scope="col" className="text-nowrap">Notes</th>
                    <th scope="col" className="text-nowrap">Mode</th>
                    <th scope="col" className="text-nowrap">Added By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="text-nowrap">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: '2-digit'
                          })}
                        </td>
                        <td>
                          <span className={`badge ${transaction.type === 'Income' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                            {transaction.type === 'Income' ? (
                              <><i className="fas fa-arrow-down me-1"></i> {transaction.type}</>
                            ) : (
                              <><i className="fas fa-arrow-up me-1"></i> {transaction.type}</>
                            )}
                          </span>
                        </td>
                        <td>{transaction.category}</td>
                        <td className={`fw-medium ${transaction.type === 'Income' ? 'text-success' : 'text-danger'}`}>
                          {transaction.type === 'Income' ? '+' : '-'} ₹{transaction.amount.toFixed(2)}
                        </td>
                        <td>
                          {transaction.linkedTo.name !== '-' ? (
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-2">
                                <img
                                  className="rounded-circle"
                                  src={transaction.linkedTo.avatar}
                                  width="32"
                                  height="32"
                                  alt=""
                                />
                                <span className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1">
                                  {transaction.linkedTo.role === 'Child' ? (
                                    <i className="fas fa-baby text-primary" style={{ fontSize: '0.6rem' }}></i>
                                  ) : transaction.linkedTo.role === 'Teacher' ? (
                                    <i className="fas fa-chalkboard-teacher text-purple" style={{ fontSize: '0.6rem' }}></i>
                                  ) : (
                                    <i className="fas fa-building text-secondary" style={{ fontSize: '0.6rem' }}></i>
                                  )}
                                </span>
                              </div>
                              <div>
                                <div className="fw-medium">{transaction.linkedTo.name}</div>
                                <small className="text-muted">{transaction.linkedTo.role}</small>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted">General</span>
                          )}
                        </td>
                        {activeTab === 'Child' && (
                          <td>
                            {transaction.linkedTo.class ? (
                              <span className="badge bg-primary bg-opacity-10 text-primary">
                                {transaction.linkedTo.class}
                              </span>
                            ) : '-'}
                          </td>
                        )}
                        <td className="text-truncate" style={{ maxWidth: '200px' }}>{transaction.notes}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {transaction.mode === 'Cash' && <i className="fas fa-money-bill-wave text-warning me-1"></i>}
                            {transaction.mode === 'Bank Transfer' && <i className="fas fa-university text-primary me-1"></i>}
                            {transaction.mode === 'UPI' && <i className="fas fa-mobile-alt text-purple me-1"></i>}
                            {transaction.mode}
                          </div>
                        </td>
                        <td>{transaction.addedBy}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab === 'Child' ? 9 : 8} className="text-center py-5">
                        <div className="d-flex flex-column align-items-center justify-content-center">
                          <i className="fas fa-search text-muted mb-3" style={{ fontSize: '2rem' }}></i>
                          <p className="h5">No transactions found</p>
                          <p className="text-muted">Try adjusting your filters to see more results</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredTransactions.length > 0 && (
              <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                <p className="small text-muted mb-0">
                  Showing <span className="fw-medium">1</span> to <span className="fw-medium">{filteredTransactions.length}</span> of <span className="fw-medium">{filteredTransactions.length}</span> results
                </p>

                <nav aria-label="Page navigation">
                  <ul className="pagination pagination-sm mb-0 custom-pagination">
                    <li className="page-item">
                      <button className="page-link">
                        <i className="fas fa-chevron-left"></i>
                      </button>
                    </li>
                    <li className="page-item active">
                      <button className="page-link">1</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link">
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for color matching */}
      <style>{`
        .text-teal-600 {
          color: #0d9488;
        }
        .border-teal-500 {
          border-color: #14b8a6 !important;
        }
        .nav-tabs .nav-link.active {
          border-bottom: 2px solid;
          font-weight: 500;
        }
        .nav-tabs .nav-link {
          border: none;
          color: #6c757d;
        }
        .nav-tabs .nav-link:hover {
          color: #495057;
          border-bottom: 2px solid #dee2e6;
        }
        .bg-light {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
};

export default Transaction;