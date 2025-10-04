import React from "react";
import { Modal, Button } from "react-bootstrap";

const VideoCallModal = ({ show, onClose, teacher }) => {
    return (
        <Modal show={show} onHide={onClose} size="lg" centered backdrop="static">
            <Modal.Header closeButton style={{ background: "#1f1f1f", color: "#fff" }}>
                <Modal.Title>
                    Video Call with <strong>{teacher?.name}</strong>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <div style={{ position: "relative", height: "500px", background: "#000" }}>
                    {/* Simulated Camera Feed */}
                    <div className="h-100 w-100 d-flex justify-content-center align-items-center text-white fs-4">
                        [Video Feed Placeholder]
                    </div>

                    {/* Simulated Self View (Bottom Right) */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 20,
                            right: 20,
                            width: "140px",
                            height: "100px",
                            background: "#444",
                            border: "2px solid #fff",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: 12,
                        }}
                    >
                        You
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center" style={{ background: "#1f1f1f" }}>
                <Button variant="danger" onClick={onClose}>
                    End Call
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VideoCallModal;
