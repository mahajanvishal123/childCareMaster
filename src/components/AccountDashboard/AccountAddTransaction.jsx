import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BASE_URL } from '../../utils/config';

const AccountAddTransaction = () => {
  const [transactionType, setTransactionType] = useState('income');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Gift'],
    expense: ['Fees', 'Supplies', 'Salary'],
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setIsDropdownOpen(false);
  };

  // Submit handler with axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!category || !amount || !date) {
      setMsg('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/accounting/transactions`,
        {
          transaction_type: transactionType,
          category,
          amount: parseFloat(amount),
          date,
          note,
        }
      );
      setMsg('Transaction added successfully!');
      setCategory('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" py-4 bg-light">
      <div className="card shadow w-100" >
        <div className="card-header text-white text-center" style={{ backgroundColor: "#2ab7a9" }}>
          <h5 className="mb-0">Add Transaction</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Transaction Type */}
            <div className="mb-3">
              <label className="form-label">Transaction Type</label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn w-50 ${transactionType === 'income' ? 'text-white' : 'btn-outline-secondary'}`}
                  style={transactionType === 'income' ? { backgroundColor: '#2ab7a9' } : {}}
                  onClick={() => setTransactionType('income')}
                >
                  <i className="fas fa-arrow-down me-2"></i>Income
                </button>
                <button
                  type="button"
                  className={`btn w-50 ${transactionType === 'expense' ? 'text-white' : 'btn-outline-secondary'}`}
                  style={transactionType === 'expense' ? { backgroundColor: '#2ab7a9' } : {}}
                  onClick={() => setTransactionType('expense')}
                >
                  <i className="fas fa-arrow-up me-2"></i>Expense
                </button>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="mb-3 position-relative">
              <label className="form-label">
                <i className="fas fa-tag me-2"></i>Category
              </label>
              <div
                className="form-control d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className={category ? 'text-dark' : 'text-muted'}>
                  {category || 'Select a category'}
                </span>
                <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
              </div>
              {isDropdownOpen && (
                <div className="position-absolute top-100 start-0 mt-1 w-100 bg-white border rounded shadow-sm z-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {categories[transactionType].map((cat) => (
                    <div
                      key={cat}
                      className="px-3 py-2 text-dark"
                      onClick={() => handleCategorySelect(cat)}
                      style={{ cursor: 'pointer' }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amount */}
            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-dollar-sign me-2"></i>Amount
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </div>
            </div>

            {/* Date */}
            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-calendar-alt me-2"></i>Date
              </label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Note */}
            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-pencil-alt me-2"></i>Note (Optional)
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn text-white w-100 d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "#2ab7a9" }}
              disabled={loading}
            >
              <i className="fas fa-plus-circle me-2"></i>
              {loading ? "Adding..." : "Add Transaction"}
            </button>
            {msg && (
              <div className={`mt-3 alert ${msg.startsWith("Error") ? "alert-danger" : "alert-success"}`}>
                {msg}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountAddTransaction;
