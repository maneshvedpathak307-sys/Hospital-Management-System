import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PatientManagementService
    from "../../../services/PatientManagementService";

import Loading
    from "../../../components/common/Loading";

import PageHeader
    from "../../../components/common/PageHeader";


function PatientDetails() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [patient, setPatient] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================================
       LOAD PATIENT
    ========================================= */

    useEffect(() => {

        const loadPatient = async () => {

            try {

                setLoading(true);

                setError("");

                const data =
                    await PatientManagementService
                        .getPatientById(id);

                setPatient(data);

            } catch (error) {

                console.error(
                    "Patient details error:",
                    error
                );

                setError(

                    error?.response?.data?.message ||

                    (
                        typeof error?.response?.data === "string"

                            ? error.response.data

                            : "Unable to load patient details."
                    )

                );

            } finally {

                setLoading(false);

            }

        };


        loadPatient();

    }, [id]);


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {

        return (

            <div className="page-container">

                <Loading />

            </div>

        );

    }


    /* =========================================
       ERROR
    ========================================= */

    if (error || !patient) {

        return (

            <div className="page-container">

                <PageHeader
                    title="Patient Details"
                    subtitle="View patient information."
                />

                <div className="page-error">

                    ⚠️{" "}

                    {
                        error ||
                        "Patient not found."
                    }

                </div>


                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        navigate(
                            "/admin/patients"
                        )
                    }
                >

                    ← Back to Patients

                </button>

            </div>

        );

    }


    return (

        <div className="page-container">


            {/* =================================
                HEADER
            ================================= */}

            <PageHeader
                title="Patient Details"
                subtitle="View complete patient information."
            />


            {/* =================================
                ACTIONS
            ================================= */}

            <div className="details-actions">

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        navigate(
                            "/admin/patients"
                        )
                    }
                >

                    ← Back to Patients

                </button>

            </div>


            {/* =================================
                PROFILE CARD
            ================================= */}

            <div className="details-card">


                {/* =================================
                    PROFILE HEADER
                ================================= */}

                <div className="doctor-profile-header">

                    <div className="doctor-large-avatar">

                        🧑

                    </div>


                    <div>

                        <h2>

                            {
                                patient.patientName ||
                                "Patient"
                            }

                        </h2>


                        <p>
                            Patient
                        </p>


                        <span className="details-id">

                            Patient ID: #{patient.id}

                        </span>

                    </div>

                </div>


                {/* =================================
                    PERSONAL INFORMATION
                ================================= */}

                <div className="details-section">

                    <div className="details-section-title">

                        <div className="details-icon">
                            🧑
                        </div>


                        <div>

                            <h3>
                                Personal Information
                            </h3>

                            <p>
                                Patient personal details
                            </p>

                        </div>

                    </div>


                    <div className="details-grid">


                        <div className="details-item">

                            <span>
                                Patient Name
                            </span>

                            <strong>

                                {
                                    patient.patientName ||
                                    "Not available"
                                }

                            </strong>

                        </div>


                        <div className="details-item">

                            <span>
                                Patient ID
                            </span>

                            <strong>
                                #{patient.id}
                            </strong>

                        </div>


                        <div className="details-item">

                            <span>
                                Age
                            </span>

                            <strong>

                                {
                                    patient.age ??
                                    "-"
                                }

                            </strong>

                        </div>


                        <div className="details-item">

                            <span>
                                Gender
                            </span>

                            <strong>

                                {
                                    patient.gender ||
                                    "-"
                                }

                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    CONTACT INFORMATION
                ================================= */}

                <div className="details-section">

                    <div className="details-section-title">

                        <div className="details-icon">
                            📞
                        </div>


                        <div>

                            <h3>
                                Contact Information
                            </h3>

                            <p>
                                Patient contact details
                            </p>

                        </div>

                    </div>


                    <div className="details-grid">


                        <div className="details-item">

                            <span>
                                Phone
                            </span>

                            <strong>

                                {
                                    patient.phone ||
                                    "Not available"
                                }

                            </strong>

                        </div>


                        <div className="details-item">

                            <span>
                                Email
                            </span>

                            <strong>

                                {
                                    patient.email ||
                                    "Not available"
                                }

                            </strong>

                        </div>


                        <div className="details-item">

                            <span>
                                Address
                            </span>

                            <strong>

                                {
                                    patient.address ||
                                    "Not available"
                                }

                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    HEALTH INFORMATION
                ================================= */}

                <div className="details-section">

                    <div className="details-section-title">

                        <div className="details-icon">
                            🏥
                        </div>


                        <div>

                            <h3>
                                Health Information
                            </h3>

                            <p>
                                Patient health information
                            </p>

                        </div>

                    </div>


                    <div className="details-grid">


                        <div className="details-item">

                            <span>
                                Disease / Health Problem
                            </span>

                            <strong>

                                {
                                    patient.disease ||
                                    "No information provided"
                                }

                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    ACCOUNT INFORMATION
                ================================= */}

                <div className="details-section">

                    <div className="details-section-title">

                        <div className="details-icon">
                            🔐
                        </div>


                        <div>

                            <h3>
                                Account Information
                            </h3>

                            <p>
                                Patient login account information
                            </p>

                        </div>

                    </div>


                    <div className="details-grid">


                        <div className="details-item">

                            <span>
                                Login Email
                            </span>

                            <strong>

                                {
                                    patient.loginEmail ||
                                    "Not available"
                                }

                            </strong>

                        </div>


                        <div className="details-item">

                            <span>
                                Role
                            </span>

                            <strong>
                                {
                                    patient.role ||
                                    "PATIENT"
                                }
                            </strong>

                        </div>

                    </div>

                </div>


            </div>

        </div>

    );

}


export default PatientDetails;