import React from "react";

const ExportButton = ({ label, icon, onClick }) => {
    return (
        <button
            className="btn d-flex align-items-center gap-2 border border-secondary rounded"
            style={{ backgroundColor: "#fff", fontSize: "1rem" }}
            onClick={onClick}
        >
            <span role="img" aria-label="export-icon">{icon}</span>
            <span className="d-none d-sm-inline">{label}</span>
        </button>
    );
};

export default ExportButton;
