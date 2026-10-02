import React, { useEffect } from "react";

function Modal({
    isOpen,
    title,
    children,
    onClose,
    width = "600px"
}) {

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        const handleEscape = (event) => {

            if (event.key === "Escape") {
                onClose();
            }

        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        document.body.style.overflow = "hidden";

        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow = "";
        };

    }, [isOpen, onClose]);


    if (!isOpen) {
        return null;
    }


    const handleOverlayClick = (event) => {

        if (event.target === event.currentTarget) {
            onClose();
        }

    };


    return (
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
        >

            <div
                className="modal-container"
                style={{ maxWidth: width }}
            >

                {/* HEADER */}

                <div className="modal-header">

                    <h3>
                        {title}
                    </h3>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* CONTENT */}

                <div className="modal-body">

                    {children}

                </div>

            </div>

        </div>
    );
}

export default Modal;