import React from "react";

function ConfirmDialog({
    isOpen,
    title = "Confirm Action",
    message = "Are you sure you want to continue?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel
}) {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">

            <div className="confirm-dialog">

                {/* ICON */}

                <div className="confirm-icon">
                    ⚠️
                </div>

                {/* CONTENT */}

                <div className="confirm-content">

                    <h3>
                        {title}
                    </h3>

                    <p>
                        {message}
                    </p>

                </div>

                {/* ACTIONS */}

                <div className="confirm-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className="danger-button"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ConfirmDialog;