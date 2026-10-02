import React from "react";
import {
    useLocation,
    useNavigate
} from "react-router-dom";

import "../../styles/emergency.css";


function EmergencyServices() {

    const navigate = useNavigate();
    const location = useLocation();


    /* =========================================
       BACK TO DASHBOARD
    ========================================= */

    const handleBack = () => {

        const currentPath =
            location.pathname;


        /* =====================================
           ADMIN
        ===================================== */

        if (
            currentPath.startsWith("/admin")
        ) {

            navigate(
                "/admin/dashboard"
            );

            return;
        }


        /* =====================================
           DOCTOR
        ===================================== */

        if (
            currentPath.startsWith("/doctor")
        ) {

            navigate(
                "/doctor/dashboard"
            );

            return;
        }


        /* =====================================
           PATIENT
        ===================================== */

        if (
            currentPath.startsWith("/patient")
        ) {

            navigate(
                "/patient/dashboard"
            );

            return;
        }


        /* =====================================
           DEFAULT
        ===================================== */

        navigate("/");

    };


    return (

        <div className="page-container">


            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <div
                className="emergency-page-header"
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                }}
            >

                {/* =================================
                    TITLE - LEFT
                ================================= */}

                <div>

                    <h1>
                        🚑 Emergency & Ambulance Services
                    </h1>

                    <p>
                        Quick access to ambulance services,
                        emergency contacts and hospital
                        emergency information.
                    </p>

                </div>


                {/* =================================
                    BACK BUTTON - RIGHT
                ================================= */}

                <button
                    type="button"
                    className="secondary-button"
                    onClick={handleBack}
                    style={{
                        marginLeft: "auto",
                        whiteSpace: "nowrap"
                    }}
                >

                    ← Back to Dashboard

                </button>

            </div>


            {/* =========================================
                AMBULANCE SERVICES
            ========================================= */}

            <section className="emergency-section">


                <div className="emergency-card-grid">


                    {/* =================================
                        HOSPITAL AMBULANCE
                    ================================= */}

                    <div className="emergency-card">

                        <div className="emergency-card-icon">
                            🚑
                        </div>

                        <h3>
                            Hospital Ambulance
                        </h3>

                        <p>
                            Available 24 × 7 for hospital
                            emergency transportation.
                        </p>


                        <div className="emergency-contact">

                            <span>
                                Emergency Number
                            </span>

                            <strong>
                                108
                            </strong>

                        </div>


                        <a
                            href="tel:108"
                            className="emergency-call-button"
                        >

                            📞 Emergency: 108

                        </a>

                    </div>


                    {/* =================================
                        HOSPITAL EMERGENCY
                    ================================= */}

                    <div className="emergency-card">

                        <div className="emergency-card-icon">
                            🏥
                        </div>

                        <h3>
                            Hospital Emergency
                        </h3>

                        <p>
                            Contact the hospital emergency
                            department for urgent assistance.
                        </p>


                        <div className="emergency-contact">

                            <span>
                                Hospital Emergency
                            </span>

                            <strong>
                                020-12345678
                            </strong>

                        </div>


                        <a
                            href="tel:02012345678"
                            className="emergency-call-button"
                        >

                            📞 Call Hospital

                        </a>

                    </div>


                    {/* =================================
                        EMERGENCY DEPARTMENT
                    ================================= */}

                    <div className="emergency-card">

                        <div className="emergency-card-icon">
                            🚨
                        </div>

                        <h3>
                            Emergency Department
                        </h3>

                        <p>
                            Emergency department is available
                            24 hours a day, 7 days a week.
                        </p>


                        <div className="emergency-contact">

                            <span>
                                Location
                            </span>

                            <strong>
                                Ground Floor
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                IMPORTANT CONTACTS
            ========================================= */}

            <section className="emergency-section">

                <div className="emergency-section-title">

                    <div className="emergency-section-icon">
                        📞
                    </div>

                    <div>

                        <h2>
                            Important Emergency Contacts
                        </h2>

                        <p>
                            Important numbers for emergency
                            situations.
                        </p>

                    </div>

                </div>


                <div className="emergency-contacts-card">


                    {/* =================================
                        AMBULANCE
                    ================================= */}

                    <div className="emergency-contact-row">

                        <div>

                            <span className="contact-icon">
                                🚑
                            </span>

                            <strong>
                                Ambulance
                            </strong>

                        </div>

                        <a href="tel:108">
                            108
                        </a>

                    </div>


                    {/* =================================
                        HOSPITAL
                    ================================= */}

                    <div className="emergency-contact-row">

                        <div>

                            <span className="contact-icon">
                                🏥
                            </span>

                            <strong>
                                Hospital Emergency
                            </strong>

                        </div>

                        <a href="tel:02012345678">
                            020-12345678
                        </a>

                    </div>


                    {/* =================================
                        POLICE
                    ================================= */}

                    <div className="emergency-contact-row">

                        <div>

                            <span className="contact-icon">
                                🚔
                            </span>

                            <strong>
                                Police
                            </strong>

                        </div>

                        <a href="tel:112">
                            112
                        </a>

                    </div>


                    {/* =================================
                        FIRE
                    ================================= */}

                    <div className="emergency-contact-row">

                        <div>

                            <span className="contact-icon">
                                🔥
                            </span>

                            <strong>
                                Fire & Rescue
                            </strong>

                        </div>

                        <a href="tel:101">
                            101
                        </a>

                    </div>

                </div>

            </section>


        </div>

    );

}


export default EmergencyServices;