import React from "react";

function StatusBadge({ status }) {

    if (!status) {
        return null;
    }

    const normalizedStatus =
        String(status).toUpperCase();

    return (
        <span
            className={`status-badge status-${normalizedStatus.toLowerCase()}`}
        >
            {normalizedStatus}
        </span>
    );
}

export default StatusBadge;