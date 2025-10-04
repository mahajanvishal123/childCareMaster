import React from 'react'

const AccountDashboard = () => {

    const financialSummary = {
        totalIncome: 8750.0,
        totalExpenses: 5320.45,
        netProfit: 3429.55,
    };

    const recentTransactions = [
        { id: 1, date: '2025-06-18', description: 'Client Payment - ABC Corp', amount: 2500.0, type: 'income' },
        { id: 2, date: '2025-06-15', description: 'Office Supplies', amount: -125.75, type: 'expense' },
        { id: 3, date: '2025-06-12', description: 'Client Payment - XYZ Ltd', amount: 1800.0, type: 'income' },
        { id: 4, date: '2025-06-10', description: 'Software Subscription', amount: -49.99, type: 'expense' },
        { id: 5, date: '2025-06-05', description: 'Consulting Services', amount: 950.0, type: 'income' },
    ];

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    };

    return (
        <div>
            <div className="min-vh-100 text-dark py-4">
                <div className="container">
                    {/* Header */}
                    <div className="mb-4 ">
                        <h3 className="fw-bold">Overview</h3>
                        <p className="opacity-75">
                            Financial summary as of{' '}
                            {new Date().toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-4">
                            <div className="card shadow h-100">
                                <div className="card-body">
                                    <h6 className="text-muted">Total Income</h6>
                                    <h3 className="fw-bold">{formatCurrency(financialSummary.totalIncome)}</h3>
                                    <div className="text-success mt-2">
                                        <i className="fas fa-arrow-up me-1"></i>12% from last month
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow h-100">
                                <div className="card-body">
                                    <h6 className="text-muted">Total Expenses</h6>
                                    <h3 className="fw-bold">{formatCurrency(financialSummary.totalExpenses)}</h3>
                                    <div className="text-danger mt-2">
                                        <i className="fas fa-arrow-up me-1"></i>8% from last month
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow h-100">
                                <div className="card-body">
                                    <h6 className="text-muted">Net Profit</h6>
                                    <h3 className="fw-bold">{formatCurrency(financialSummary.netProfit)}</h3>
                                    <div className="text-success mt-2">
                                        <i className="fas fa-arrow-up me-1"></i>15% from last month
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="card shadow mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Last 5 Transactions</h5>
                                <button className="btn btn-link text-info p-0">
                                    View All <i className="fas fa-chevron-right small ms-1"></i>
                                </button>
                            </div>

                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th className="text-end">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.map((tx) => (
                                            <tr key={tx.id}>
                                                <td>{formatDate(tx.date)}</td>
                                                <td className="fw-medium">{tx.description}</td>
                                                <td className={`text-end fw-bold ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                                    {formatCurrency(tx.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="mb-4">Quick Actions</h5>

                            <div className="row g-3">
                                <div className="col-12 col-sm-6 col-md-3">
                                    <button className="btn w-100 text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: "#2ab7a9" }}>
                                        <i className="fas fa-plus-circle me-2"></i>Add Income
                                    </button>
                                </div>
                                <div className="col-12 col-sm-6 col-md-3">
                                    <button className="btn w-100 text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: "#2ab7a9" }}>
                                        <i className="fas fa-minus-circle me-2"></i>Add Expense
                                    </button>
                                </div>
                                <div className="col-12 col-sm-6 col-md-3">
                                    <button className="btn w-100 text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: "#2ab7a9" }}>
                                        <i className="fas fa-file-invoice me-2"></i>Generate Report
                                    </button>
                                </div>
                                <div className="col-12 col-sm-6 col-md-3">
                                    <button className="btn w-100 text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: "#2ab7a9" }}>
                                        <i className="fas fa-cog me-2"></i>Settings
                                    </button>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountDashboard
