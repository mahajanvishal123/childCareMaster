import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { reusableColor } from '../reusableColor';
import html2pdf from 'html2pdf.js';

const TransactionModal = ({ showModal, handleClose, transaction }) => {
    const printRef = useRef();

    const handlePrint = () => {
        const element = printRef.current;
        const opt = {
            margin: 1,
            filename: 'transaction-details.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
    };

    return (
        <Modal show={showModal} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Transaction Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {transaction ? (
                    <div ref={printRef} style={{ textAlign: 'center' }}>
                        {transaction.status === "success" ? (
                            <FaCheckCircle size={50} className="text-success" />
                        ) : (
                            <FaTimesCircle size={50} className="text-danger" />
                        )}
                        <h5>{transaction.status === "success" ? 'Transaction Approved' : 'Transaction Failed'}</h5>
                        <div className='d-flex gap-5 justify-content-center align-items-start mt-4'>
                            <div style={{ textAlign: 'left' }}>
                                <p><strong>Type:</strong></p>
                                <p><strong>Transaction ID:</strong></p>
                                <p><strong>Date:</strong></p>
                                <p><strong>Description:</strong></p>
                                <p><strong>Amount:</strong></p>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p>{transaction.type}</p>
                                <p>{transaction.id}</p>
                                <p>{transaction.date}</p>
                                <p>{transaction.desc}</p>
                                <p>${transaction.amt}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No transaction data available.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handlePrint} style={{ backgroundColor: reusableColor.customTextColor }}>Print</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TransactionModal;
