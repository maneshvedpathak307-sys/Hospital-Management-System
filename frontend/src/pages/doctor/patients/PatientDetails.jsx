import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../../../services/api";

import PageHeader
    from "../../../components/common/PageHeader";

import Loading
    from "../../../components/common/Loading";

import "../../../styles/patient-details.css";


function PatientDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [patient, setPatient] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD PATIENT
    // =====================================================

    const fetchPatient = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await api.get(
                        `/doctor/patients/${id}`
                    );


                setPatient(
                    response.data
                );


            } catch (error) {

                console.error(
                    "Error loading patient details:",
                    error
                );


                setPatient(null);


                setError(

                    error.response?.data?.message ||

                    (
                        typeof error.response?.data ===
                        "string"

                            ? error.response.data

                            : "Unable to load patient details."
                    )

                );


            } finally {

                setLoading(false);

            }

        },
        [id]
    );


    // =====================================================
    // EFFECT
    // =====================================================

    useEffect(() => {

        fetchPatient();

    }, [fetchPatient]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page-container">

                <Loading />

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="page-container patient-details-page">

                <PageHeader
                    title="Patient Details"
                    subtitle="View patient information."
                />


                <div className="patient-details-error">

                    <div className="patient-error-icon">
                        ⚠️
                    </div>


                    <h3>
                        Unable to load patient
                    </h3>


                    <p>
                        {error}
                    </p>


                    <button
                        type="button"
                        className="patient-back-button"
                        onClick={() =>
                            navigate(
                                "/doctor/patients"
                            )
                        }
                    >
                        ← Back to Patients
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // PATIENT NOT FOUND
    // =====================================================

    if (!patient) {

        return (

            <div className="page-container patient-details-page">

                <PageHeader
                    title="Patient Details"
                    subtitle="View patient information."
                />


                <div className="patient-details-error">

                    <div className="patient-error-icon">
                        🧑
                    </div>


                    <h3>
                        Patient not found
                    </h3>


                    <p>
                        The requested patient
                        could not be found.
                    </p>


                    <button
                        type="button"
                        className="patient-back-button"
                        onClick={() =>
                            navigate(
                                "/doctor/patients"
                            )
                        }
                    >
                        ← Back to Patients
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="page-container patient-details-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="patient-details-page-header">

                <div>

                    <span className="patient-details-label">
                        DOCTOR PORTAL
                    </span>

                    <h1>
                        Patient Details
                    </h1>

                    <p>
                        View complete patient information.
                    </p>

                </div>


                <button
                    type="button"
                    className="patient-back-button"
                    onClick={() =>
                        navigate(
                            "/doctor/patients"
                        )
                    }
                >
                    ← Back to Patients
                </button>

            </div>


            {/* =================================================
                PATIENT PROFILE CARD
            ================================================= */}

            <div className="patient-details-card">


                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="patient-details-profile">

                    <div className="patient-details-avatar">
                        🧑
                    </div>


                    <div className="patient-details-basic">

                        <h2>

                            {
                                patient.patientName ||
                                "Patient"
                            }

                        </h2>


                        <p>
                            Patient ID:
                            #{patient.id}
                        </p>


                        <span className="patient-details-badge">
                            PATIENT
                        </span>

                    </div>

                </div>


                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <div className="patient-details-section">

                    <div className="patient-section-heading">

                        <h3>
                            Personal Information
                        </h3>

                        <p>
                            Patient personal details
                        </p>

                    </div>


                    <div className="patient-details-grid">


                        {/* NAME */}

                        <div className="patient-detail-item">

                            <span className="patient-detail-icon">
                                👤
                            </span>

                            <div>

                                <small>
                                    Patient Name
                                </small>

                                <strong>
                                    {
                                        patient.patientName ||
                                        "-"
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* AGE */}

                        <div className="patient-detail-item">

                            <span className="patient-detail-icon">
                                🎂
                            </span>

                            <div>

                                <small>
                                    Age
                                </small>

                                <strong>
                                    {
                                        patient.age ??
                                        "-"
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* GENDER */}

                        <div className="patient-detail-item">

                            <span className="patient-detail-icon">
                                ⚥
                            </span>

                            <div>

                                <small>
                                    Gender
                                </small>

                                <strong>
                                    {
                                        patient.gender ||
                                        "-"
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* DISEASE */}

                        <div className="patient-detail-item">

                            <span className="patient-detail-icon">
                                🩺
                            </span>

                            <div>

                                <small>
                                    Health Problem
                                </small>

                                <strong>
                                    {
                                        patient.disease ||
                                        "Not specified"
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CONTACT INFORMATION
                ================================================= */}

                <div className="patient-details-section">

                    <div className="patient-section-heading">

                        <h3>
                            Contact Information
                        </h3>

                        <p>
                            Patient contact details
                        </p>

                    </div>


                    <div className="patient-details-grid">


                        {/* EMAIL */}

                        <div className="patient-detail-item">

                            <span className="patient-detail-icon">
                                ✉️
                            </span>

                            <div>

                                <small>
                                    Email
                                </small>

                                <strong>
                                    {
                                        patient.email ||
                                        "Not available"
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="patient-detail-item">

                            <span className="patient-detail-icon">
                                📞
                            </span>

                            <div>

                                <small>
                                    Phone
                                </small>

                                <strong>
                                    {
                                        patient.phone ||
                                        "Not available"
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* ADDRESS */}

                        <div className="patient-detail-item patient-detail-full">

                            <span className="patient-detail-icon">
                                📍
                            </span>

                            <div>

                                <small>
                                    Address
                                </small>

                                <strong>
                                    {
                                        patient.address ||
                                        "Not available"
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="patient-details-footer">

                    <button
                        type="button"
                        className="patient-secondary-button"
                        onClick={() =>
                            navigate(
                                "/doctor/patients"
                            )
                        }
                    >
                        ← Back to Patients
                    </button>

                </div>

            </div>

        </div>

    );

}


export default PatientDetails;