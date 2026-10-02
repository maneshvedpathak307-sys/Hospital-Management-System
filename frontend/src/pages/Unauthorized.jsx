import React from "react";
import { useNavigate } from "react-router-dom";

import "../styles/global.css";

function Unauthorized() {

    const navigate = useNavigate();

    return (
        <div className="unauthorized-page">

            <div className="unauthorized-card">

                <div className="unauthorized-icon">
                    🔒
                </div>

                <h1>403</h1>

                <h2>Access Denied</h2>

                <p>
                    You do not have permission to access
                    this page.
                </p>

                <button
                    className="primary-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Login
                </button>

            </div>

        </div>
    );
}

export default Unauthorized;