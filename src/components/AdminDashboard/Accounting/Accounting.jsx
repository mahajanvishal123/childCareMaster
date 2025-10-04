import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaEye, FaEdit, FaTrash, FaPrint } from 'react-icons/fa';
import { Button, Dropdown, Modal, Table } from 'react-bootstrap';
import { reusableColor } from '../reusableColor';
import AccountAddTransaction from '../../AccountDashboard/AccountAddTransaction';
import html2pdf from 'html2pdf.js';
import TransactionModal from './TransactionModal';
import './account.css';
import axios from 'axios';
import { BASE_URL } from '../../../utils/config';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const chartData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 0 },
];

const Accounting = () => {
  const userRole = localStorage.getItem('role');
  const financialSummary = {
    totalIncome: 0.0,
    totalExpenses: 0.0,
    netProfit: 0.0,
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);


  const tableRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryType, setCategoryType] = useState("");
  const [showMore, setShowMore] = useState(false); // State to manage "See More"
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [msg, setMsg] = useState("");
   const [amountDisplay, setAmountDisplay] = useState("$0.00");


  const handlePrint = (transaction) => {
    setSelectedTransaction(transaction);
    setShowPrintModal(true);
  };
  const handleDownloadPDF = () => {
    const element = tableRef.current;
    const opt = {
      margin: 0.5,
      filename: 'Transaction_Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  


    useEffect(() => {
    const fetchTransactions = async () => {
      const access_token = localStorage.getItem("access_token");
      try {
        const response = await axios.post(
          `${BASE_URL}/plaid/transactions`,
          { access_token }
        );

         const mapped = (response.data.transactions || []).map(tx => ({
        id: tx.transaction_id,
        date: tx.date,
        name: tx.merchant_name || tx.name,
        logo: tx.logo_url,
        category: tx.personal_finance_category?.primary || '',
        amount: tx.amount,
        type: tx.payment_channel,
        pending: tx.pending
      }));

      setTransactions(mapped);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

    fetchTransactions();
  }, []);

  // Fetch transactions (move this to a function so we can call after delete)
  // const fetchTransactions = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       "https://childcare-backend-production-14ca.up.railway.app/api/accounting/transactions"
  //     );
  //     setTransactions(response.data || []);
  //   } catch (error) {
  //     setTransactions([]);
  //     console.error("Error fetching transactions:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!desc || !amount || !date || !category || !transactionType) {
      setMsg("Please fill all fields.");
      return;
    }
    setLoadingAdd(true);
    try {
      await axios.post(
       `${BASE_URL}accounting/transaction`,
        {
          transaction_type: transactionType,
          category,
          amount: parseFloat(amount),
          date,
          note: desc, // map description to note
        }
      );
      setMsg("Transaction added successfully!");
      setDesc("");
      setAmount("");
      setDate("");
      setCategory("");
      setTransactionType("");
      // Optionally, refresh transactions list here
    } catch (err) {
      setMsg("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAdd(false);
    }
  };

  // Delete handler


  return (
    <div className="py-4" style={{ backgroundColor: '#f9f9f9' }}>
    
      {/* Summary Cards */}
  { userRole === '3' ? (
    <div className="row g-3 mb-4">
        {[
          { title: 'Total Earnings', value: '$0.0', color: '#2ab7a9' },
          { title: 'Total Expenses', value: '$0.0', color: '#dc3545' },
          { title: 'Net Profit', value: '$0.0', color: '#007bff' },
        ].map((card, i) => (
          <div className="col-md-4" key={i}>
            <div className="bg-white shadow-sm p-3 rounded">
              <h6 className="text-muted">{card.title}</h6>
              <h4 className="text" style={{ color: card.color }}>{card.value}</h4>
              <div style={{ height: '80px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={card.color} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>) : null }


      {/* Transactions Table */}
     { userRole === '3' ? (
      <div className="card shadow-sm mb-4">
        <div className="card-body" ref={tableRef}>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h5 className="mb-3" style={{ color: '#2ab7a9' }}>Recent Transactions</h5>
            <div className='d-flex gap-2'>
              <Button
                className="mb-3"
                style={{
                  borderColor: '#2ab7a9',
                  backgroundColor: reusableColor.customTextColor,
                  color: 'white'
                }}
                onClick={handleDownloadPDF}
              >
                <i className="bi bi-file-earmark-pdf"></i> Report
              </Button>

              <Button
                className="mb-3"
                style={{
                  borderColor: '#2ab7a9',
                  backgroundColor: reusableColor.customTextColor,
                  color: 'white'
                }}
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus"></i> Add Transaction
              </Button>
            </div>
          </div>
          <div className="table-responsive">
       <Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>Date</th>
      <th>Merchant</th>
      <th>Category</th>
      <th>Amount</th>
      <th>Channel</th>
      <th>Status</th>
      <th className="text-center">Actions</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      <tr>
        <td colSpan="7" className="text-center text-muted">
          Loading...
        </td>
      </tr>
    ) : transactions.length === 0 ? (
      <tr>
        <td colSpan="7" className="text-center text-muted">
          No transactions found.
        </td>
      </tr>
    ) : (
      transactions
        .slice(0, showMore ? transactions.length : 5)
        .map((tx) => (
          <tr key={tx.id}>
            <td>{dayjs(tx.date).format('DD-MM-YYYY')}</td>
            <td>
              {tx.logo && (
                <img
                  src={tx.logo}
                  alt={tx.name}
                  style={{ width: '20px', height: '20px', marginRight: '8px' }}
                />
              )}
              {tx.name}
            </td>
            <td>{tx.category}</td>
            <td>${tx.amount.toFixed(2)}</td>
            <td>{tx.type}</td>
            <td>
              {tx.pending ? (
                <span className="badge bg-warning">Pending</span>
              ) : (
                <span className="badge bg-success">Posted</span>
              )}
            </td>
            <td className="text-center">
              <Button variant="light" className="me-2 btn-sm" onClick={() => handlePrint(tx)}>
                <FaEye />
              </Button>
             
            </td>
          </tr>
        ))
    )}
  </tbody>
</Table>


            {/* <div className="text-start">
              <Button variant="link" onClick={() => setShowMore(!showMore)}>
                {showMore ? 'See Less(↑)' : 'See More(↓)'}
              </Button>
            </div> */}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
              <Modal.Header closeButton className="border-0">
                <Modal.Title className="text-primary"></Modal.Title>
              </Modal.Header>
              <Modal.Body className="pt-0">
                <AccountAddTransaction />
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>) : null }


      {/* Print Transaction Modal */}
      <TransactionModal
        showModal={showPrintModal}
        handleClose={() => setShowPrintModal(false)}
        transaction={selectedTransaction}
      />

      {/* Add New Transaction */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3" style={{ color: '#2ab7a9' }}>Add New Transaction</h5>
          <form className="row g-3" onSubmit={handleAddTransaction}>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Description"
                style={{ borderColor: '#2ab7a9' }}
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
 <div className="col-md-2">
  <input
    className="form-control"
    placeholder="Amount"
    style={{ borderColor: '#2ab7a9' }}
    value={amountDisplay}
    onFocus={() => {
      // Clear display when focusing if it's at default
      if (amountDisplay === "$0.00") {
        setAmountDisplay("");
      }
    }}
    onBlur={() => {
      // Format back to currency on blur
      const num = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
      setAmountDisplay(
        num.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        })
      );
    }}
    onChange={(e) => {
      // Strip everything except digits
      let raw = e.target.value.replace(/\D/g, "");
      // Convert to cents
      let num = (parseInt(raw, 10) || 0) / 100;
      // Update states
      setAmount(String(num)); // raw numeric string for backend
      setAmountDisplay(
        `$${num.toFixed(2)}`
      );
    }}
  />
</div>


         <div className="col-md-2">
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      format="DD-MM-YYYY"
      value={date ? dayjs(date, 'YYYY-MM-DD') : null}
      onChange={(newValue) => {
        setDate(newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
      }}
      slotProps={{
        textField: {
          
          fullWidth: true,
          size: 'small',
          sx: { borderColor: '#2ab7a9' },
        },
      }}
    />
  </LocalizationProvider>
</div>
            <div className="d-flex align-items-center col-md-2 position-relative">
              <select
                className='form-control custom-select'
                value={category}
                onChange={e => setCategory(e.target.value)}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <option value="">Select Category</option>
                <option value="Investment">Investment</option>
                <option value="Freelance">Freelance</option>
                <option value="Salary">Salary</option>
                <option value="Supplies">Supplies</option>
              </select>
              <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} dropdown-icon`}></i>
            </div>
            <div className="col-md-2 d-flex align-items-center gap-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="type"
                  id="income"
                  checked={transactionType === "income"}
                  onChange={() => setTransactionType("income")}
                />
                <label className="form-check-label" htmlFor="income">Income</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="type"
                  id="expense"
                  checked={transactionType === "expense"}
                  onChange={() => setTransactionType("expense")}
                />
                <label className="form-check-label" htmlFor="expense">Expense</label>
              </div>
            </div>
            <div className="col-md-12 d-flex gap-2 align-items-end">
              <button
                className="btn btn-success"
                style={{ backgroundColor: '#2ab7a9', borderColor: '#2ab7a9' }}
                type="submit"
                disabled={loadingAdd}
              >
                {loadingAdd ? "Adding..." : <>Add Transaction <i className="bi bi-plus"></i></>}
              </button>
              <Button
                style={{
                  borderColor: '#2ab7a9',
                  backgroundColor: reusableColor.customTextColor,
                  color: 'white'
                }}
                onClick={() => setShowCategoryModal(true)}
                type="button"
              >
                <i className="bi bi-plus"></i> Add Category
              </Button>
            </div>
            {msg && (
              <div className={`col-12 alert ${msg.startsWith("Error") ? "alert-danger" : "alert-success"} mt-2`}>
                {msg}
              </div>
            )}
          </form>
        </div>
      </div>

      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-primary"></Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <div className="card shadow-sm mt-2">
            <div className="card-body">
              <h5 className="mb-3" style={{ color: '#2ab7a9' }}>Add New Category</h5>
              <form>
                <div className="mb-3">
                  <input className="form-control" placeholder="Category Name" style={{ borderColor: '#2ab7a9' }} />
                </div>
                <div className="mb-3">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      className="w-100 text-start d-flex justify-content-between align-items-center"
                      style={{ borderColor: '#2ab7a9', color: '#495057' }}
                      id="dropdown-type"
                    >
                      {categoryType ? categoryType : "Select Type"} <i className="bi bi-chevron-down ms-2"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setCategoryType("Income")}>Income</Dropdown.Item>
                      <Dropdown.Item onClick={() => setCategoryType("Expense")}>Expense</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Description" style={{ borderColor: '#2ab7a9' }} />
                </div>
                <div className="d-flex align-items-end">
                  <button className="btn btn-success w-100" style={{ backgroundColor: '#2ab7a9', borderColor: '#2ab7a9' }}>
                    Add Category <i className="bi bi-plus"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>


      
    </div>
  );
};

export default Accounting;
